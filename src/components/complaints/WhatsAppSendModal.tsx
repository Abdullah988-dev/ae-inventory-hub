"use client";

import { MessageCircle, Store } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { buildCustomerMessage, buildShopMessage, buildWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppSendModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  complaint: {
    complaintNumber: string;
    customerName: string;
    customerPhone: string;
    productName: string;
    issueDetails: string;
    priority: string;
  } | null;
}

export function WhatsAppSendModal({ open, onOpenChange, complaint }: WhatsAppSendModalProps) {
  if (!complaint) return null;

  const shopNumber = process.env.NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER ?? "";

  const customerMessage = buildCustomerMessage(complaint);
  const shopMessage = buildShopMessage(complaint);

  const customerLink = buildWhatsAppLink(complaint.customerPhone, customerMessage);
  const shopLink = shopNumber ? buildWhatsAppLink(shopNumber, shopMessage) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle>Complaint Registered — {complaint.complaintNumber}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-slate-400">
          Ab WhatsApp pe messages bhejein — dono buttons WhatsApp kholenge, message pehle se
          type hoga, bas Send dabana hai.
        </p>

        <div className="space-y-3">
          <a href={customerLink} target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-emerald-600 hover:bg-emerald-500">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message Customer on WhatsApp
            </Button>
          </a>

          {shopLink ? (
            <a href={shopLink} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
                <Store className="mr-2 h-4 w-4" />
                Forward to Shop WhatsApp
              </Button>
            </a>
          ) : (
            <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
              Shop WhatsApp number set nahi hai — `.env.local` mein
              `NEXT_PUBLIC_SHOP_WHATSAPP_NUMBER` add karein.
            </p>
          )}
        </div>

        <Button
          variant="ghost"
          onClick={() => onOpenChange(false)}
          className="w-full text-slate-400 hover:text-white"
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}