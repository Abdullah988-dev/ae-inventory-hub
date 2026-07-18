import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Brand } from "@/models/Brand";

export async function GET() {
  try {
    await connectToDatabase();

    const [products, totalCategories, totalBrands] = await Promise.all([
      Product.find().populate("category", "name").lean(),
      Category.countDocuments(),
      Brand.countDocuments(),
    ]);

    const totalProducts = products.length;
    const totalStockValue = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const lowStockProducts = products
      .filter((p) => p.quantity <= p.lowStockThreshold)
      .map((p) => ({
        _id: p._id,
        name: p.name,
        sku: p.sku,
        quantity: p.quantity,
        lowStockThreshold: p.lowStockThreshold,
      }))
      .sort((a, b) => a.quantity - b.quantity);

    const categoryMap = new Map<string, number>();
    for (const p of products) {
      const categoryName = (p.category as any)?.name ?? "Uncategorized";
      categoryMap.set(categoryName, (categoryMap.get(categoryName) ?? 0) + 1);
    }
    const categoryBreakdown = Array.from(categoryMap.entries()).map(
      ([name, count]) => ({ name, count })
    );

    return NextResponse.json({
      status: "ok",
      data: {
        totalProducts,
        totalCategories,
        totalBrands,
        totalStockValue,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        categoryBreakdown,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}