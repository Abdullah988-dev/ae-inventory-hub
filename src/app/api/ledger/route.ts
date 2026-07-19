import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { LedgerTransaction } from "@/models/LedgerTransaction";
import { Company } from "@/models/Company";

const ledgerSchema = z.object({
  company: z.string().min(1, "Company is required"),
  type: z.enum(["purchase", "payment"]),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  paymentMethod: z.enum(["Cash", "Bank", "EasyPaisa", "JazzCash", "Other"]).optional(),
  note: z.string().trim().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const companyId = req.nextUrl.searchParams.get("company");
    const from = req.nextUrl.searchParams.get("from");
    const to = req.nextUrl.searchParams.get("to");

    const filter: Record<string, unknown> = {};
    if (companyId) filter.company = companyId;
    if (from || to) {
      filter.date = {
        ...(from ? { $gte: new Date(from) } : {}),
        ...(to ? { $lte: new Date(`${to}T23:59:59`) } : {}),
      };
    }

    const transactions = await LedgerTransaction.find(filter)
      .populate("company", "name")
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ status: "ok", data: transactions });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch ledger transactions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ledgerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { company, type, amount, date, paymentMethod, note } = parsed.data;

    if (type === "payment" && !paymentMethod) {
      return NextResponse.json(
        { status: "error", message: "Payment method is required for payment entries" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const session = await mongoose.startSession();

    try {
      let createdEntry;

      await session.withTransaction(async () => {
        const companyDoc = await Company.findById(company).session(session);

        if (!companyDoc) {
          throw new Error("COMPANY_NOT_FOUND");
        }

        if (type === "purchase") {
          companyDoc.totalPurchases += amount;
          companyDoc.outstandingBalance += amount;
        } else {
          companyDoc.totalPayments += amount;
          companyDoc.outstandingBalance -= amount;
        }
        companyDoc.lastTransactionDate = new Date(date);
        await companyDoc.save({ session });

        const entries = await LedgerTransaction.create(
          [
            {
              company,
              type,
              amount,
              date: new Date(date),
              paymentMethod: type === "payment" ? paymentMethod : undefined,
              note,
              balanceAfter: companyDoc.outstandingBalance,
            },
          ],
          { session }
        );
        createdEntry = entries[0];
      });

      const populatedEntry = await LedgerTransaction.findById(createdEntry!._id).populate(
        "company",
        "name"
      );

      return NextResponse.json({ status: "ok", data: populatedEntry }, { status: 201 });
    } catch (err) {
      if (err instanceof Error && err.message === "COMPANY_NOT_FOUND") {
        return NextResponse.json(
          { status: "error", message: "Company not found" },
          { status: 404 }
        );
      }
      throw err;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to record transaction" },
      { status: 500 }
    );
  }
}