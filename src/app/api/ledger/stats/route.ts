import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Company } from "@/models/Company";

export async function GET() {
  try {
    await connectToDatabase();

    const companies = await Company.find().lean();

    const totalOutstanding = companies.reduce((sum, c) => sum + c.outstandingBalance, 0);
    const totalPurchases = companies.reduce((sum, c) => sum + c.totalPurchases, 0);
    const totalPayments = companies.reduce((sum, c) => sum + c.totalPayments, 0);
    const companiesCount = companies.length;

    return NextResponse.json({
      status: "ok",
      data: { totalOutstanding, totalPurchases, totalPayments, companiesCount },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch ledger stats" },
      { status: 500 }
    );
  }
}