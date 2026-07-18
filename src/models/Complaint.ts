import mongoose, { Schema, Document, Model } from "mongoose";

export type ComplaintPriority = "Low" | "Medium" | "High";
export type ComplaintStatus = "registered" | "done";

export interface IComplaint extends Document {
  complaintNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productName: string;
  issueDetails: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    complaintNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerAddress: { type: String, required: true, trim: true },
    productName: { type: String, required: true, trim: true },
    issueDetails: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["registered", "done"], default: "registered" },
  },
  { timestamps: true }
);

export const Complaint: Model<IComplaint> =
  mongoose.models.Complaint || mongoose.model<IComplaint>("Complaint", ComplaintSchema);