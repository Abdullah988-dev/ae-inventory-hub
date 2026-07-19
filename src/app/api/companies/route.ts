import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";

const companySchema = z.object({
  name: z.string().min(1, "Company name is required").trim(),
  openingBalance: z.coerce.number().default(0),
  notes: z.string().trim().optional(),
});

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const search = req.nextUrl.searchParams.get("search");
    const status = req.nextUrl.searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    const companies = await Company.find(filter).sort({ name: 1 }).lean();

    return NextResponse.json({ status: "ok", data: companies });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = companySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await Company.findOne({ name: parsed.data.name });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "A company with this name already exists" },
        { status: 409 }
      );
    }

    const company = await Company.create({
      ...parsed.data,
      outstandingBalance: parsed.data.openingBalance,
    });

    return NextResponse.json({ status: "ok", data: company }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to create company" },
      { status: 500 }
    );
  }
}