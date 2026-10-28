"use client";

import React from "react";
import { X } from "lucide-react";
import { PropertyPartner } from "./types";

interface ViewPartnerModalProps {
  partner: PropertyPartner | null;
  onClose: () => void;
}

export default function ViewPartnerModal({ partner, onClose }: ViewPartnerModalProps) {
  if (!partner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <span className="text-xs font-bold text-[#8E25E3]">{partner.id}</span>
            <h3 className="text-base font-bold text-gray-900">{partner.propertyName}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 text-xs text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-200">
          <p><strong>Location:</strong> {partner.location}</p>
          <p><strong>Contact Person:</strong> {partner.contactName}</p>
          <p><strong>Email:</strong> {partner.contactEmail}</p>
          {partner.contactPhone && <p><strong>Phone:</strong> {partner.contactPhone}</p>}
          <p><strong>Managed Properties:</strong> {partner.noOfUnits} properties</p>
          <p><strong>Subscription Plan:</strong> {partner.plan}</p>
          <p><strong>Account Status:</strong> {partner.status}</p>
          <p><strong>Payment Type:</strong> {partner.paymentType}</p>
          <p className="text-[10px] text-gray-400 font-mono pt-1"><strong>Database ID:</strong> {partner.rawId}</p>
        </div>

        <div className="pt-2 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#8E25E3] text-white font-semibold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
