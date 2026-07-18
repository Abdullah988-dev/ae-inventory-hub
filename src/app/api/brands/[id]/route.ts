import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Brand } from "@/models/Brand";
import { Product } from "@/models/Product";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const inUse = await Product.findOne({ brand: id });
    if (inUse) {
      return NextResponse.json(
        { status: "error", message: "Cannot delete — brand is in use by a product" },
        { status: 409 }
      );
    }

    await Brand.findByIdAndDelete(id);
    return NextResponse.json({ status: "ok", message: "Brand deleted" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to delete brand" },
      { status: 500 }
    );
  }
}