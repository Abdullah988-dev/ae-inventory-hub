import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";
import { LedgerTransaction } from "@/models/LedgerTransaction";

const updateSchema = z.object({
  name: z.string().min(1).trim().optional(),
  openingBalance: z.coerce.number().optional(),
  notes: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const company = await Company.findById(id);
    if (!company) {
      return NextResponse.json({ status: "error", message: "Company not found" }, { status: 404 });
    }

    if (parsed.data.openingBalance !== undefined) {
      const transactionCount = await LedgerTransaction.countDocuments({ company: id });
      if (transactionCount > 0) {
        return NextResponse.json(
          {
            status: "error",
            message: "Cannot change opening balance — this company already has transactions",
          },
          { status: 409 }
        );
      }
      const diff = parsed.data.openingBalance - company.openingBalance;
      company.outstandingBalance += diff;
      company.openingBalance = parsed.data.openingBalance;
    }

    if (parsed.data.name !== undefined) company.name = parsed.data.name;
    if (parsed.data.notes !== undefined) company.notes = parsed.data.notes;
    if (parsed.data.isActive !== undefined) company.isActive = parsed.data.isActive;

    await company.save();

    return NextResponse.json({ status: "ok", data: company });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to update company" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const transactionCount = await LedgerTransaction.countDocuments({ company: id });
    if (transactionCount > 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Cannot delete — this company has ledger transactions. Mark it Inactive instead.",
        },
        { status: 409 }
      );
    }

    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return NextResponse.json({ status: "error", message: "Company not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", message: "Company deleted" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to delete company" },
      { status: 500 }
    );
  }
}