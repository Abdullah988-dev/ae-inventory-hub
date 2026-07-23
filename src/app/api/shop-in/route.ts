import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ShopIn } from "@/models/ShopIn";
import { Product } from "@/models/Product";

const shopInSchema = z.object({
  product: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  pricePerUnit: z.coerce.number().min(0, "Price cannot be negative"),
  supplierName: z.string().trim().optional(),
  note: z.string().trim().optional(),
  date: z.string().optional(),
});

export async function GET() {
  try {
    await connectToDatabase();
    const entries = await ShopIn.find()
      .populate("product", "name sku")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ status: "ok", data: entries });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch shop-in history" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = shopInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const { product, quantity, pricePerUnit, supplierName, note, date } = parsed.data;
    const entryDate = date ? new Date(date) : new Date();
    const totalAmount = quantity * pricePerUnit;

    const session = await mongoose.startSession();

    try {
      let createdEntry;

      await session.withTransaction(async () => {
        const productDoc = await Product.findById(product).session(session);

        if (!productDoc) {
          throw new Error("PRODUCT_NOT_FOUND");
        }

        productDoc.quantity += quantity;
        await productDoc.save({ session });

        const entries = await ShopIn.create(
          [{ product, quantity, pricePerUnit, totalAmount, supplierName, note, date: entryDate }],
          { session }
        );
        createdEntry = entries[0];
      });

      const populatedEntry = await ShopIn.findById(createdEntry!._id).populate(
        "product",
        "name sku"
      );

      return NextResponse.json({ status: "ok", data: populatedEntry }, { status: 201 });
    } catch (err) {
      if (err instanceof Error && err.message === "PRODUCT_NOT_FOUND") {
        return NextResponse.json(
          { status: "error", message: "Product not found" },
          { status: 404 }
        );
      }
      throw err;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to record shop-in entry" },
      { status: 500 }
    );
  }
}