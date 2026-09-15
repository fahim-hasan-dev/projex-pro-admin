"use client";

import React from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { VendorPaymentItem } from "./types";

interface BatchPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVendors: VendorPaymentItem[];
  onConfirmBatchPayout: () => void;
  isProcessing: boolean;
}

export default function BatchPayoutModal({
  isOpen,
  onClose,
  selectedVendors,
  onConfirmBatchPayout,
  isProcessing,
}: BatchPayoutModalProps) {
  if (!isOpen) return null;

  const totalAmount = selectedVendors.reduce((sum, v) => sum + v.amount, 0);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 border border-gray-200 animate-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#8E25E3] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Process Batch Payout</h3>
              <p className="text-xs text-gray-500 font-medium">
                Mass payout execution for selected service providers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Vendors Summary */}
        <div className="space-y-3 bg-purple-50/50 border border-purple-100 rounded-2xl p-4">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-600 font-medium">Selected Vendors Count:</span>
            <span className="font-bold text-gray-900 bg-purple-100 px-2.5 py-0.5 rounded-full text-[#8E25E3]">
              {selectedVendors.length} Service Providers
            </span>
          </div>

          <div className="flex justify-between items-center text-xs border-t border-purple-100/80 pt-2">
            <span className="text-gray-600 font-medium">Total Payout Amount:</span>
            <span className="text-base font-medium text-emerald-600">
              ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* List of Vendors Preview */}
        <div>
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Payout Breakdown Preview
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-2 custom-scrollbar pr-1">
            {selectedVendors.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-gray-200/80 text-xs"
              >
                <div>
                  <p className="font-bold text-gray-900">{item.vendorName}</p>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {item.workOrder} · {item.type}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${item.amount.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{item.paymentMethod}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirmBatchPayout}
            disabled={isProcessing}
            className="px-5 py-2.5 bg-[#8E25E3] hover:bg-[#781dc6] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing Payouts...</span>
              </>
            ) : (
              <span>Process Batch Payout ({selectedVendors.length})</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
