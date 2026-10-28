"use client";

import React from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PartnerStatus, PropertyPartner } from "./types";

interface EditPartnerModalProps {
  partner: PropertyPartner | null;
  setPartner: (partner: PropertyPartner | null) => void;
  onSave: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function EditPartnerModal({
  partner,
  setPartner,
  onSave,
  onClose,
}: EditPartnerModalProps) {
  if (!partner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <form
        onSubmit={onSave}
        className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <span className="text-[11px] font-bold text-[#8E25E3] uppercase">{partner.id}</span>
            <h3 className="text-base font-bold text-gray-900">Update Partner Status</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-200 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Read-only info section */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 space-y-2 text-xs text-gray-700">
          <div>
            <span className="text-gray-500 font-medium">Partner Name:</span>
            <p className="font-semibold text-gray-900 text-sm mt-0.5">{partner.propertyName}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-gray-500 font-medium">Contact:</span>
              <p className="font-semibold text-gray-800 truncate">{partner.contactEmail}</p>
            </div>
            <div>
              <span className="text-gray-500 font-medium">Current Plan:</span>
              <p className="font-semibold text-[#8E25E3]">{partner.plan}</p>
            </div>
          </div>
        </div>

        {/* The ONLY editable field: Status */}
        <div className="space-y-1.5 text-xs">
          <label className="block text-gray-800 font-bold">Account Status</label>
          <Select
            value={partner.status}
            onValueChange={(val) => setPartner({ ...partner, status: val as PartnerStatus })}
          >
            <SelectTrigger className="w-full bg-white border border-gray-300 rounded-xl h-11 text-xs font-semibold text-gray-800 cursor-pointer focus:ring-2 focus:ring-[#8E25E3]/40">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 text-xs font-medium text-gray-800 shadow-xl">
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] text-gray-500">
            Note: Only the partner status can be modified here.
          </p>
        </div>

        <div className="pt-2 border-t border-gray-200 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#8E25E3] hover:bg-[#7b1fc9] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            Update Status
          </button>
        </div>
      </form>
    </div>
  );
}
