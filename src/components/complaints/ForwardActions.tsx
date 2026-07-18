"use client";

import { MessageCircle, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { buildCustomerMessage, buildShopMessage, buildWhatsAppLink } from "@/lib/whatsapp";
import { COMPANY_CONTACTS } from "@/config/whatsapp-companies";

interface ForwardActionsProps {
  complaint: {
    complaintNumber: string;
    customerName: string;
    customerPhone: string;
    productName: string;
    issueDetails: string;
    priority: string;
  };
}

export function ForwardActions({ complaint }: ForwardActionsProps) {
  const customerLink = buildWhatsAppLink(
    complaint.customerPhone,
    buildCustomerMessage(complaint)
  );

  function openCompanyLink(phone: string) {
    const link = buildWhatsAppLink(phone, buildShopMessage(complaint));
    window.open(link, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a href={customerLink} target="_blank" rel="noopener noreferrer">
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500">
          <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
          Customer
        </Button>
      </a>

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-700 px-3 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white">
          <Send className="h-3.5 w-3.5" />
          Company
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-slate-700 bg-slate-800 text-white">
          {COMPANY_CONTACTS.map((company) => (
            <DropdownMenuItem
              key={company.id}
              onClick={() => openCompanyLink(company.phone)}
              className="cursor-pointer focus:bg-slate-700 focus:text-white"
            >
              {company.name} — {company.phone}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}