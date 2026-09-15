"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Send,
  XCircle,
} from "lucide-react";
import {
  MainInvoiceTab,
  PlatformCommissionItem,
  PropertyPartnerInvoice,
  SubscriptionBillingItem,
  VendorPaymentItem,
} from "./types";
import BatchPayoutModal from "./BatchPayoutModal";
import toast from "react-hot-toast";

interface InvoicesTableProps {
  activeTab: MainInvoiceTab;
  propertyInvoices: PropertyPartnerInvoice[];
  vendorPayments: VendorPaymentItem[];
  setVendorPayments: React.Dispatch<React.SetStateAction<VendorPaymentItem[]>>;
  platformCommissions: PlatformCommissionItem[];
  subscriptionBillings: SubscriptionBillingItem[];
  onSelectPropertyInvoice?: (item: PropertyPartnerInvoice) => void;
}

export default function InvoicesTable({
  activeTab,
  propertyInvoices,
  vendorPayments,
  setVendorPayments,
  platformCommissions,
  subscriptionBillings,
  onSelectPropertyInvoice,
}: InvoicesTableProps) {
  // Batch Payout Selection State
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  // Toggle Single Vendor Checkbox
  const handleToggleSelectVendor = (id: string) => {
    setSelectedVendorIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select All Vendors
  const handleSelectAllVendors = () => {
    const pendingOnly = vendorPayments.filter(
      (v) => v.status === "Pending Payout" || v.status === "Processing"
    );
    if (selectedVendorIds.length === pendingOnly.length && pendingOnly.length > 0) {
      setSelectedVendorIds([]);
    } else {
      setSelectedVendorIds(pendingOnly.map((v) => v.id));
    }
  };

  // Open Batch Payout Modal
  const handleOpenBatchModal = () => {
    if (selectedVendorIds.length === 0) {
      toast.error("Please select at least one vendor to process payout.");
      return;
    }
    setIsBatchModalOpen(true);
  };

  // Execute Batch Payout
  const handleConfirmBatchPayout = () => {
    setIsProcessingBatch(true);
    setTimeout(() => {
      setVendorPayments((prev) =>
        prev.map((v) =>
          selectedVendorIds.includes(v.id) ? { ...v, status: "Paid" } : v
        )
      );
      toast.success(
        `Successfully processed batch payout for ${selectedVendorIds.length} service provider(s)!`
      );
      setSelectedVendorIds([]);
      setIsProcessingBatch(false);
      setIsBatchModalOpen(false);
    }, 1200);
  };

  const selectedVendorsList = vendorPayments.filter((v) =>
    selectedVendorIds.includes(v.id)
  );

  return (
    <div className="space-y-4">
      {/* Vendor Payments Action Bar */}
      {activeTab === "vendor-payments" && (
        <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-700">
              Vendor Selection:
            </span>
            <span className="px-3 py-1 bg-white border border-purple-200 text-[#8E25E3] font-bold text-xs rounded-full">
              {selectedVendorIds.length} Selected
            </span>
            {selectedVendorIds.length > 0 && (
              <span className="text-xs font-semibold text-emerald-600">
                (Total: $
                {selectedVendorsList
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toLocaleString()}
                )
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenBatchModal}
            disabled={selectedVendorIds.length === 0}
            className="px-5 py-2.5 bg-[#8E25E3] hover:bg-[#781dc6] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Process Batch Payout ({selectedVendorIds.length})</span>
          </button>
        </div>
      )}

      {/* Main Table Wrapper */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          {/* TAB 1: Property Partner Invoices Table */}
          {activeTab === "property-partner-invoices" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-gray-500 text-xs font-semibold bg-gray-50/50">
                  <th className="py-4 px-5 font-medium">Invoice ID</th>
                  <th className="py-4 px-5 font-medium">Date</th>
                  <th className="py-4 px-5 font-medium">Description</th>
                  <th className="py-4 px-5 font-medium">Property Partner</th>
                  <th className="py-4 px-5 font-medium">Category</th>
                  <th className="py-4 px-5 font-medium">Amount</th>
                  <th className="py-4 px-5 font-medium">Payment Method</th>
                  <th className="py-4 px-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs font-medium text-gray-800">
                {propertyInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-500 font-medium">
                      No invoices match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  propertyInvoices.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => onSelectPropertyInvoice && onSelectPropertyInvoice(item)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-5 font-bold text-[#8E25E3]">{item.id}</td>
                      <td className="py-4 px-5 text-gray-600 font-normal">{item.date}</td>
                      <td className="py-4 px-5 font-normal text-gray-900">{item.description}</td>
                      <td className="py-4 px-5 text-gray-700 font-medium">{item.partner}</td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100/70 text-[#8E25E3]">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-bold text-emerald-600 text-sm">
                        +${item.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-normal">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{item.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit ${item.status === "Paid"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "Overdue"
                                ? "bg-red-100 text-red-700"
                                : item.status === "Billed"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                        >
                          {item.status === "Paid" && <CheckCircle2 className="w-3 h-3" />}
                          {item.status === "Overdue" && <XCircle className="w-3 h-3" />}
                          {item.status === "Billed" && <Clock className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* TAB 2: Vendor Payments Table */}
          {activeTab === "vendor-payments" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-gray-500 text-xs font-semibold bg-gray-50/50">
                  <th className="py-4 px-5 w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedVendorIds.length > 0 &&
                        selectedVendorIds.length ===
                        vendorPayments.filter(
                          (v) => v.status === "Pending Payout" || v.status === "Processing"
                        ).length
                      }
                      onChange={handleSelectAllVendors}
                      className="rounded border-gray-300 text-[#8E25E3] focus:ring-[#8E25E3]/40 cursor-pointer"
                    />
                  </th>
                  <th className="py-4 px-5 font-medium">Payout ID</th>
                  <th className="py-4 px-5 font-medium">Date</th>
                  <th className="py-4 px-5 font-medium">Vendor / Service Provider</th>
                  <th className="py-4 px-5 font-medium">Payout Type</th>
                  <th className="py-4 px-5 font-medium">Work Order</th>
                  <th className="py-4 px-5 font-medium">Amount Owed</th>
                  <th className="py-4 px-5 font-medium">Payment Method</th>
                  <th className="py-4 px-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs font-medium text-gray-800">
                {vendorPayments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-gray-500 font-medium">
                      No vendor payments match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  vendorPayments.map((item) => {
                    const isSelected = selectedVendorIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${isSelected ? "bg-purple-50/40" : "hover:bg-gray-50"
                          }`}
                      >
                        <td className="py-4 px-5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectVendor(item.id)}
                            className="rounded border-gray-300 text-[#8E25E3] focus:ring-[#8E25E3]/40 cursor-pointer"
                          />
                        </td>
                        <td className="py-4 px-5 font-bold text-[#8E25E3]">{item.id}</td>
                        <td className="py-4 px-5 text-gray-600 font-normal">{item.date}</td>
                        <td className="py-4 px-5 font-bold text-gray-900">{item.vendorName}</td>
                        <td className="py-4 px-5">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100/70 text-blue-700">
                            {item.type}
                          </span>
                        </td>
                        <td className="py-4 px-5 font-semibold text-gray-700">{item.workOrder}</td>
                        <td className="py-4 px-5 font-bold text-red-600 text-sm">
                          -${item.amount.toLocaleString()}
                        </td>
                        <td className="py-4 px-5 text-gray-600 font-normal">
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{item.paymentMethod}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit ${item.status === "Paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : item.status === "Pending Payout"
                                  ? "bg-amber-100 text-amber-800"
                                  : item.status === "Processing"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                          >
                            {item.status === "Paid" && <CheckCircle2 className="w-3 h-3" />}
                            {item.status === "Pending Payout" && <Clock className="w-3 h-3" />}
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}

          {/* TAB 3: Platform Commissions Table */}
          {activeTab === "platform-commissions" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-gray-500 text-xs font-semibold bg-gray-50/50">
                  <th className="py-4 px-5 font-medium">Comm ID</th>
                  <th className="py-4 px-5 font-medium">Date</th>
                  <th className="py-4 px-5 font-medium">Work Order</th>
                  <th className="py-4 px-5 font-medium">Property</th>
                  <th className="py-4 px-5 font-medium">Vendor</th>
                  <th className="py-4 px-5 font-medium">Total Job Amount</th>
                  <th className="py-4 px-5 font-medium">Platform Commission</th>
                  <th className="py-4 px-5 font-medium">Payment Method</th>
                  <th className="py-4 px-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs font-medium text-gray-800">
                {platformCommissions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-gray-500 font-medium">
                      No commission records match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  platformCommissions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-5 font-bold text-[#8E25E3]">{item.id}</td>
                      <td className="py-4 px-5 text-gray-600 font-normal">{item.date}</td>
                      <td className="py-4 px-5 font-semibold text-gray-900">{item.workOrder}</td>
                      <td className="py-4 px-5 text-gray-700 font-medium">{item.property}</td>
                      <td className="py-4 px-5 text-gray-700 font-medium">{item.vendorName}</td>
                      <td className="py-4 px-5 font-bold text-gray-800">
                        ${item.totalJobAmount.toLocaleString()}
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-medium text-emerald-600 text-sm flex items-center gap-1">
                          <span>+${item.platformCommission.toFixed(2)}</span>
                          <span className="text-[10px] font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                            ({item.commissionRate})
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-normal">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{item.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit ${item.status === "Collected" || item.status === "Completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-800"
                            }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* TAB 4: Subscription Billings Table */}
          {activeTab === "subscription-billings" && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E5E7EB] text-gray-500 text-xs font-semibold bg-gray-50/50">
                  <th className="py-4 px-5 font-medium">Subscription ID</th>
                  <th className="py-4 px-5 font-medium">Date</th>
                  <th className="py-4 px-5 font-medium">Property Partner</th>
                  <th className="py-4 px-5 font-medium">Plan Name</th>
                  <th className="py-4 px-5 font-medium">Cycle</th>
                  <th className="py-4 px-5 font-medium">Amount</th>
                  <th className="py-4 px-5 font-medium">Payment Method</th>
                  <th className="py-4 px-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs font-medium text-gray-800">
                {subscriptionBillings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-gray-500 font-medium">
                      No subscription billings match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  subscriptionBillings.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-5 font-bold text-[#8E25E3]">{item.id}</td>
                      <td className="py-4 px-5 text-gray-600 font-normal">{item.date}</td>
                      <td className="py-4 px-5 font-bold text-gray-900">{item.partner}</td>
                      <td className="py-4 px-5 font-medium text-gray-800">{item.planName}</td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100/70 text-[#8E25E3]">
                          {item.billingCycle}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-bold text-emerald-600 text-sm">
                        +${item.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-normal">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{item.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit ${item.status === "Active Subscriptions"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "Trial Periods"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                          {item.status === "Active Subscriptions" && <CheckCircle2 className="w-3 h-3" />}
                          {item.status === "Trial Periods" && <Clock className="w-3 h-3" />}
                          {item.status === "Cancelled Plans" && <XCircle className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Batch Payout Confirmation Modal */}
      <BatchPayoutModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        selectedVendors={selectedVendorsList}
        onConfirmBatchPayout={handleConfirmBatchPayout}
        isProcessing={isProcessingBatch}
      />
    </div>
  );
}
