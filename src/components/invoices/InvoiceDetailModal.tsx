"use client";

import React from "react";
import Image from "next/image";
import { Check, Download, X } from "lucide-react";
import { Invoice } from "@/types/invoice";
import InvoiceStatusBadge from "./InvoiceStatusBadge";
import toast from "react-hot-toast";

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
  onPaySuccess?: (id: string) => void;
}

export default function InvoiceDetailModal({
  invoice,
  onClose,
  onPaySuccess,
}: InvoiceDetailModalProps) {
  if (!invoice) return null;

  // Currency helper
  const fmt = (val?: number) => {
    if (val === undefined || val === null) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handlePayNow = () => {
    if (onPaySuccess) {
      onPaySuccess(invoice.id);
    }
    toast.success(`Payment for ${invoice.id} processed successfully!`);
    onClose();
  };

  const handleDownloadPDF = () => {
    toast.success(`Downloading PDF for ${invoice.id}...`);
  };

  const isPaid = invoice.status === "Paid";
  const isDeposit = invoice.status === "Deposit" || invoice.status === "Pending";



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 ease-out">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-4">
            <Image
              src="/logo/logo.png"
              alt="ProjexPro Logo"
              width={160}
              height={45}
              className="h-9 w-auto object-contain"
            />
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              {invoice.id}
            </h2>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="text-sm text-gray-500 font-medium mt-1">
            {invoice.description}
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto pr-1 space-y-6 flex-1">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs sm:text-sm bg-gray-50/80 p-4 rounded-2xl border border-gray-100">
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                PROPERTY NAME
              </span>
              <span className="font-semibold text-gray-900 mt-0.5 block">
                {invoice.property}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {invoice.accountId ? "ACCOUNT ID" : "CONTRACTOR"}
              </span>
              <span className="font-semibold text-gray-900 mt-0.5 block">
                {invoice.accountId || invoice.serviceProvider}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {invoice.serviceRequestTitle ? "JOB ID" : "ISSUE DATE"}
              </span>
              <span className="font-semibold text-gray-900 mt-0.5 block">
                {invoice.serviceRequestTitle ? invoice.id : (invoice.issueDate || "Jun 22, 2026")}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {invoice.serviceRequestTitle ? "SERVICE REQUEST" : "START DATE"}
              </span>
              <span className="font-semibold text-gray-900 mt-0.5 block">
                {invoice.serviceRequestTitle || (invoice.startDate || "Jul 7, 2026")}
              </span>
            </div>

            {invoice.invoiceNo && (
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  INVOICE NO.
                </span>
                <span className="font-semibold text-gray-900 mt-0.5 block">
                  {invoice.invoiceNo}
                </span>
              </div>
            )}

            {invoice.dueDate && (
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  DUE DATE
                </span>
                <span className="font-semibold text-gray-900 mt-0.5 block">
                  {invoice.dueDate}
                </span>
              </div>
            )}

            {isPaid && invoice.finalInvoiceDate && (
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  FINAL INVOICE DATE
                </span>
                <span className="font-semibold text-gray-900 mt-0.5 block">
                  {invoice.finalInvoiceDate}
                </span>
              </div>
            )}
          </div>

          {/* Line Items Table Box */}
          <div className="bg-[#EDEDF0] rounded-2xl p-4">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-300/60 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="pb-2">Description</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Unit Price</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300/40 text-gray-800">
                {(invoice.lineItems || [
                  { id: "1", description: "Labour (8 hrs)", qty: 8, unitPrice: 85, amount: 680 },
                  { id: "2", description: "Materials", qty: 1, unitPrice: 520, amount: 520 },
                ]).map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 font-medium">{item.description}</td>
                    <td className="py-2.5 text-center">{item.qty}</td>
                    <td className="py-2.5 text-right">{fmt(item.unitPrice)}</td>
                    <td className="py-2.5 text-right font-semibold">{fmt(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Subtotals & Final Calculation */}
          <div className="space-y-2 text-xs sm:text-sm text-gray-600 border-b border-gray-200 pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{fmt(invoice.subtotal || 1200)}</span>
            </div>
            {invoice.tax !== undefined && (
              <div className="flex justify-between">
                <span>Tax (10%)</span>
                <span className="font-semibold text-gray-900">{fmt(invoice.tax)}</span>
              </div>
            )}
            {invoice.discount && invoice.discount > 0 ? (
              <div className="flex justify-between text-gray-500">
                <span>Discount Applied</span>
                <span>{fmt(invoice.discount)}</span>
              </div>
            ) : null}
            {!isPaid && (
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-semibold text-gray-900">{fmt(invoice.totalAmount)}</span>
              </div>
            )}
          </div>

          {/* Highlighted Big Amount */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {isPaid
                ? "Total Paid"
                : isDeposit
                  ? "Deposit Amount"
                  : "Final Balance Due"}
            </span>
            <span className="text-2xl sm:text-3xl font-medium text-[#7C3AED]">
              {isPaid
                ? fmt(invoice.totalAmount)
                : isDeposit
                  ? fmt(invoice.depositAmountRequired || 820)
                  : fmt(invoice.finalBalanceDue || invoice.totalDue)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              className={`py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-2xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-center gap-2 ${isPaid ? "w-full" : "flex-1"
                }`}
            >
              <Download className="w-4 h-4 text-gray-600" />
              <span>Download PDF</span>
            </button>

            {!isPaid && (
              <button
                type="button"
                onClick={handlePayNow}
                className="flex-1 py-3.5 px-4 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-2xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Pay Now</span>
              </button>
            )}
          </div>

          {/* Payment Terms Notice */}
          {isDeposit && (
            <p className="text-[11px] text-gray-400 font-normal leading-relaxed text-center pt-1">
              <span className="font-semibold text-gray-600">Payment Terms:</span> Invoices not manually approved or rejected within 7 days of submission will automatically approve and schedule for payment.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
