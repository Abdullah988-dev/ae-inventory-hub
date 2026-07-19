import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type LedgerTransactionType = "purchase" | "payment";
export type PaymentMethod = "Cash" | "Bank" | "EasyPaisa" | "JazzCash" | "Other";

export interface ILedgerTransaction extends Document {
  company: Types.ObjectId;
  type: LedgerTransactionType;
  amount: number;
  date: Date;
  paymentMethod?: PaymentMethod;
  note?: string;
  balanceAfter: number;
  createdAt: Date;
}

const LedgerTransactionSchema = new Schema<ILedgerTransaction>(
  {
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    type: { type: String, enum: ["purchase", "payment"], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    date: { type: Date, required: true, default: Date.now },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank", "EasyPaisa", "JazzCash", "Other"],
    },
    note: { type: String, trim: true },
    balanceAfter: { type: Number, required: true },
  },
  { timestamps: true }
);

LedgerTransactionSchema.index({ company: 1, date: -1 });

export const LedgerTransaction: Model<ILedgerTransaction> =
  mongoose.models.LedgerTransaction ||
  mongoose.model<ILedgerTransaction>("LedgerTransaction", LedgerTransactionSchema);