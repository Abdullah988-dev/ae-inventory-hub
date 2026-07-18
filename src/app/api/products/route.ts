import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required").trim(),
  sku: z.string().min(1, "SKU is required").trim(),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  lowStockThreshold: z.coerce.number().min(0).default(5),
});

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const search = req.nextUrl.searchParams.get("search");
    const filter = search
      ? { $or: [{ name: { $regex: search, $options: "i" } }, { sku: { $regex: search, $options: "i" } }] }
      : {};

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("brand", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ status: "ok", data: products });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await Product.findOne({ sku: parsed.data.sku.toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "SKU already exists" },
        { status: 409 }
      );
    }

    const product = await Product.create(parsed.data);
    return NextResponse.json({ status: "ok", data: product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to create product" },
      { status: 500 }
    );
  }
}