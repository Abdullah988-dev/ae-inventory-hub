import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";

const productUpdateSchema = z.object({
  name: z.string().min(1).trim().optional(),
  sku: z.string().min(1).trim().optional(),
  category: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  quantity: z.coerce.number().min(0).optional(),
  price: z.coerce.number().min(0).optional(),
  lowStockThreshold: z.coerce.number().min(0).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = productUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findByIdAndUpdate(id, parsed.data, { new: true })
      .populate("category", "name")
      .populate("brand", "name");

    if (!product) {
      return NextResponse.json({ status: "error", message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", data: product });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to update product" },
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

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json({ status: "error", message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok", message: "Product deleted" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to delete product" },
      { status: 500 }
    );
  }
}