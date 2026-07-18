import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Category } from "@/models/Category";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").trim(),
});

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ name: 1 });
    return NextResponse.json({ status: "ok", data: categories });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await Category.findOne({ name: parsed.data.name });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "Category already exists" },
        { status: 409 }
      );
    }

    const category = await Category.create(parsed.data);
    return NextResponse.json({ status: "ok", data: category }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to create category" },
      { status: 500 }
    );
  }
}