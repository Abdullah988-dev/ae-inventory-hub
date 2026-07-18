import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IShopIn extends Document {
  product: Types.ObjectId;
  quantity: number;
  supplierName?: string;
  note?: string;
  createdAt: Date;
}

const ShopInSchema = new Schema<IShopIn>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    supplierName: { type: String, trim: true },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

export const ShopIn: Model<IShopIn> =
  mongoose.models.ShopIn || mongoose.model<IShopIn>("ShopIn", ShopInSchema);