import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IShopOut extends Document {
  product: Types.ObjectId;
  quantity: number;
  customerName?: string;
  note?: string;
  date: Date;
  createdAt: Date;
}

const ShopOutSchema = new Schema<IShopOut>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    customerName: { type: String, trim: true },
    note: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ShopOut: Model<IShopOut> =
  mongoose.models.ShopOut || mongoose.model<IShopOut>("ShopOut", ShopOutSchema);