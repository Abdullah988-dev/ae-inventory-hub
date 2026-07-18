"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: { _id: string; name: string };
  brand: { _id: string; name: string };
  quantity: number;
  price: number;
  lowStockThreshold: number;
}

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-slate-800 text-sm text-slate-500">
        No products yet — click &quot;Add Product&quot; to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-800 hover:bg-transparent">
            <TableHead className="text-slate-400">Name</TableHead>
            <TableHead className="text-slate-400">SKU</TableHead>
            <TableHead className="text-slate-400">Category</TableHead>
            <TableHead className="text-slate-400">Brand</TableHead>
            <TableHead className="text-slate-400">Qty</TableHead>
            <TableHead className="text-slate-400">Price</TableHead>
            <TableHead className="text-right text-slate-400">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => {
            const isLowStock = product.quantity <= product.lowStockThreshold;
            return (
              <TableRow key={product._id} className="border-slate-800">
                <TableCell className="font-medium text-white">{product.name}</TableCell>
                <TableCell className="text-slate-400">{product.sku}</TableCell>
                <TableCell className="text-slate-400">{product.category?.name}</TableCell>
                <TableCell className="text-slate-400">{product.brand?.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      isLowStock
                        ? "border-red-500/40 text-red-400"
                        : "border-emerald-500/40 text-emerald-400"
                    }
                  >
                    {product.quantity}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-400">
                  Rs. {product.price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => onEdit(product)}
                    className="mr-3 text-slate-500 hover:text-indigo-400"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}