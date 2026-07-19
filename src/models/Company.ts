import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICompany extends Document {
  name: string;
  openingBalance: number;
  totalPurchases: number;
  totalPayments: number;
  outstandingBalance: number;
  lastTransactionDate: Date | null;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    openingBalance: { type: Number, required: true, default: 0 },
    totalPurchases: { type: Number, required: true, default: 0 },
    totalPayments: { type: Number, required: true, default: 0 },
    outstandingBalance: { type: Number, required: true, default: 0 },
    lastTransactionDate: { type: Date, default: null },
    notes: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Company: Model<ICompany> =
  mongoose.models.Company || mongoose.model<ICompany>("Company", CompanySchema);