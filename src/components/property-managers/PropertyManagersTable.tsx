"use client";

import React from "react";
import { Edit, Eye, Mail, MapPin, Trash2 } from "lucide-react";
import { PlanType, PropertyPartner, PartnerStatus } from "./types";

interface PropertyManagersTableProps {
  partners: PropertyPartner[];
  setViewPartner: (partner: PropertyPartner) => void;
  setEditPartner: (partner: PropertyPartner) => void;
  setDeletePartner: (partner: PropertyPartner) => void;
}

export default function PropertyManagersTable({
  partners,
  setViewPartner,
  setEditPartner,
  setDeletePartner,
}: PropertyManagersTableProps) {
  const getPlanBadgeStyle = (plan: PlanType) => {
    const p = String(plan || "").toLowerCase();
    if (p.includes("enterprise")) {
      return "bg-purple-100 text-[#8E25E3]";
    }
    if (p.includes("pro") || p.includes("professional")) {
      return "bg-blue-100 text-blue-700";
    }
    if (p.includes("prime")) {
      return "bg-amber-100 text-amber-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status: PartnerStatus) => {
    const s = String(status || "").toLowerCase();
    if (s === "active") {
      return { dot: "bg-emerald-500", text: "text-emerald-600", label: "Active" };
    }
    if (s === "pending") {
      return { dot: "bg-amber-500", text: "text-amber-600", label: "Pending" };
    }
    if (s === "rejected") {
      return { dot: "bg-red-500", text: "text-red-600", label: "Rejected" };
    }
    return { dot: "bg-rose-500", text: "text-rose-600", label: "Suspended" };
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] text-gray-500 text-xs font-semibold">
              <th className="py-4 px-5 font-medium">ID</th>
              <th className="py-4 px-5 font-medium">Property Name / Location</th>
              <th className="py-4 px-5 font-medium">Point of Contact</th>
              <th className="py-4 px-5 font-medium">No of Properties</th>
              <th className="py-4 px-5 font-medium">Plan</th>
              <th className="py-4 px-5 font-medium">Status</th>
              <th className="py-4 px-5 font-medium">Payment Type</th>
              <th className="py-4 px-5 font-medium text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs font-medium text-gray-800">
            {partners.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-gray-500 font-medium">
                  No property accounts found matching your search.
                </td>
              </tr>
            ) : (
              partners.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {/* ID */}
                  <td className="py-4 px-5 font-bold text-[#8E25E3]">
                    {item.id}
                  </td>

                  {/* Property Name / Location */}
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-medium text-gray-900 text-sm leading-snug">{item.propertyName}</p>
                      <p className="text-[11px] text-gray-500 font-normal mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{item.location}</span>
                      </p>
                    </div>
                  </td>

                  {/* Point of Contact */}
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-medium text-gray-900">{item.contactName}</p>
                      <p className="text-[11px] text-gray-500 font-normal mt-0.5 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{item.contactEmail}</span>
                      </p>
                    </div>
                  </td>

                  {/* No of Properties */}
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-bold text-gray-900 text-base leading-none">{item.noOfProperties ?? item.noOfUnits}</p>
                      <span className="text-[11px] text-gray-500 font-normal">properties</span>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="py-4 px-5">
                    <span
                      className={`px-3 py-1 rounded-md text-[11px] font-semibold inline-block ${getPlanBadgeStyle(
                        item.plan
                      )}`}
                    >
                      {item.plan}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5">
                    {(() => {
                      const sb = getStatusBadge(item.status);
                      return (
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span className={`w-2 h-2 rounded-full ${sb.dot}`} />
                          <span className={sb.text}>{sb.label}</span>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Payment Type */}
                  <td className="py-4 px-5 text-gray-600 font-normal">
                    {item.paymentType}
                  </td>

                  {/* Actions (View, Edit, Delete) */}
                  <td className="py-4 px-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* View Button */}
                      <button
                        type="button"
                        onClick={() => setViewPartner(item)}
                        className="p-2 bg-[#FFFFFF] hover:bg-gray-50 border border-[#E5E7EB] rounded-md text-gray-600 hover:text-[#8E25E3] transition-colors cursor-pointer"
                        title="View Partner Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => setEditPartner(item)}
                        className="p-2 bg-[#FFFFFF] hover:bg-gray-50 border border-[#E5E7EB] rounded-md text-gray-600 hover:text-[#8E25E3] transition-colors cursor-pointer"
                        title="Edit Partner"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeletePartner(item)}
                        className="p-2 bg-[#FFFFFF] hover:bg-gray-50 border border-[#E5E7EB] rounded-md text-gray-600 hover:text-[#8E25E3] transition-colors cursor-pointer"
                        title="Delete Partner"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
