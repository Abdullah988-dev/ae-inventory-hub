import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Complaint } from "@/models/Complaint";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status: "done" },
      { new: true }
    );

    if (!complaint) {
      return NextResponse.json({ status: "error", message: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", data: complaint });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to update complaint" },
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

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return NextResponse.json({ status: "error", message: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", message: "Complaint deleted" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to delete complaint" },
      { status: 500 }
    );
  }
}