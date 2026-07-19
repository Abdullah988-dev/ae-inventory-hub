import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface LedgerRow {
  date: string;
  type: string;
  amount: number;
  balanceAfter: number;
  note?: string;
}

export function exportLedgerToExcel(companyName: string, rows: LedgerRow[]) {
  const worksheetData = rows.map((r) => ({
    Date: new Date(r.date).toLocaleDateString(),
    Type: r.type === "purchase" ? "Purchase" : "Payment",
    Amount: r.amount,
    "Running Balance": r.balanceAfter,
    Note: r.note ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger");
  XLSX.writeFile(workbook, `${companyName}-ledger.xlsx`);
}

export function exportLedgerToPdf(companyName: string, rows: LedgerRow[]) {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text(`${companyName} — Ledger Statement`, 14, 16);

  autoTable(doc, {
    startY: 22,
    head: [["Date", "Type", "Amount", "Running Balance", "Note"]],
    body: rows.map((r) => [
      new Date(r.date).toLocaleDateString(),
      r.type === "purchase" ? "Purchase" : "Payment",
      `Rs. ${r.amount.toLocaleString()}`,
      `Rs. ${r.balanceAfter.toLocaleString()}`,
      r.note ?? "-",
    ]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [79, 70, 229] },
  });

  doc.save(`${companyName}-ledger.pdf`);
}