import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { ShopOut } from "@/models/ShopOut";
import { Product } from "@/models/Product";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const entry = await ShopOut.findById(id).session(session);

        if (!entry) {
          throw new Error("ENTRY_NOT_FOUND");
        }

        const product = await Product.findById(entry.product).session(session);

        if (product) {
          product.quantity += entry.quantity;
          await product.save({ session });
        }

        await ShopOut.findByIdAndDelete(id).session(session);
      });

      return NextResponse.json({ status: "ok", message: "Entry deleted and stock restored" });
    } catch (err) {
      if (err instanceof Error && err.message === "ENTRY_NOT_FOUND") {
        return NextResponse.json(
          { status: "error", message: "Entry not found" },
          { status: 404 }
        );
      }
      throw err;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to delete entry" },
      { status: 500 }
    );
  }
}