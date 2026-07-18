import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const inUse = await Product.findOne({ category: id });
    if (inUse) {
      return NextResponse.json(
        { status: "error", message: "Cannot delete — category is in use by a product" },
        { status: 409 }
      );
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ status: "ok", message: "Category deleted" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to delete category" },
      { status: 500 }
    );
  }
}