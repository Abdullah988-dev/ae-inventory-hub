import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectToDatabase } from "@/lib/db";
import { Brand } from "@/models/Brand";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required").trim(),
});

export async function GET() {
  try {
    await connectToDatabase();
    const brands = await Brand.find().sort({ name: 1 });
    return NextResponse.json({ status: "ok", data: brands });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = brandSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { status: "error", message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await Brand.findOne({ name: parsed.data.name });
    if (existing) {
      return NextResponse.json(
        { status: "error", message: "Brand already exists" },
        { status: 409 }
      );
    }

    const brand = await Brand.create(parsed.data);
    return NextResponse.json({ status: "ok", data: brand }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to create brand" },
      { status: 500 }
    );
  }
}