import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Complaint } from "@/models/Complaint";
import { generateComplaintNumber } from "@/lib/whatsapp";

const complaintSchema = z.object({
  customerName: z.string().min(1, "Customer name is required").trim(),
  customerPhone: z.string().min(1, "Customer phone is required").trim(),
  customerAddress: z.string().min(1, "Customer address is required").trim(),
  productName: z.string().min(1, "Product name is required").trim(),
  issueDetails: z.string().min(1, "Issue details are required").trim(),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
});

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const status = req.nextUrl.searchParams.get("status") ?? "registered";

    const complaints = await Complaint.find({ status: status as any }).sort({ createdAt: -1 });

    return NextResponse.json({ status: "ok", data: complaints });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch complaints" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = complaintSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let complaintNumber = generateComplaintNumber();

    let existing = await Complaint.findOne({ complaintNumber });
    while (existing) {
      complaintNumber = generateComplaintNumber();
      existing = await Complaint.findOne({ complaintNumber });
    }

    const complaint = await Complaint.create({
      ...parsed.data,
      complaintNumber,
      status: "registered",
    });

    return NextResponse.json({ status: "ok", data: complaint }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to register complaint" },
      { status: 500 }
    );
  }
}