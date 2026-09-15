"use client";

import React, { useState } from "react";
import {
  Eye,
  Clock,
  Wrench,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import { PriorityLevel, ServiceCategory, ServiceRequestItem } from "@/types/serviceRequestStore";

interface MaintenanceRequestsTableProps {
  requests: ServiceRequestItem[];
  handleOpenJobModal: (job: ServiceRequestItem) => void;
  handleOpenDetailsModal?: (job: ServiceRequestItem) => void;
}

export default function MaintenanceRequestsTable({
  requests,
  handleOpenJobModal,
  handleOpenDetailsModal,
}: MaintenanceRequestsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    "SR-1024": true, // Default expand seed job with extra work
    "SR-1028": true,
  });

  const toggleRowExpand = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getPriorityBadgeStyle = (priority: PriorityLevel) => {
    switch (priority) {
      case "Critical":
        return "bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]";
      case "High":
        return "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]";
      case "Medium":
        return "bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]";
      case "Low":
        return "bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]";
    }
  };

  const getTypeStyle = (type: ServiceCategory) => {
    switch (type) {
      case "Plumbing":
        return { dot: "bg-[#2563EB]", text: "text-[#2563EB]" };
      case "Electrical":
        return { dot: "bg-[#D97706]", text: "text-[#D97706]" };
      case "HVAC":
        return { dot: "bg-[#16A34A]", text: "text-[#16A34A]" };
      case "Cleaning":
        return { dot: "bg-[#8E25E3]", text: "text-[#8E25E3]" };
      case "Painting":
        return { dot: "bg-[#E53935]", text: "text-[#E53935]" };
    }
  };

  const renderStatus = (status: string) => {
    switch (status) {
      case "In Progress":
      case "Accepted":
        return (
          <span className="flex items-center gap-1.5 text-[#2563EB] font-semibold text-xs">
            <Wrench className="w-3.5 h-3.5 text-[#2563EB]" />
            In Progress
          </span>
        );
      case "Pending":
        return (
          <span className="flex items-center gap-1.5 text-[#D97706] font-semibold text-xs">
            <Clock className="w-3.5 h-3.5 text-[#D97706]" />
            Pending Review
          </span>
        );
      case "Assigned":
        return (
          <span className="flex items-center gap-1.5 text-[#8E25E3] font-semibold text-xs">
            <Clock className="w-3.5 h-3.5 text-[#8E25E3]" />
            Assigned
          </span>
        );
      case "Reassignment Requested":
        return (
          <span className="flex items-center gap-1.5 text-red-600 font-bold text-xs bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Reassign Needed
          </span>
        );
      case "Completed":
        return (
          <span className="flex items-center gap-1.5 text-[#16A34A] font-semibold text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="flex items-center gap-1.5 text-gray-500 font-semibold text-xs">
            <XCircle className="w-3.5 h-3.5 text-gray-400" />
            Cancelled
          </span>
        );
      default:
        return <span className="text-gray-600 text-xs">{status}</span>;
    }
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[980px]">
          <thead>
            <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              <th className="py-4 px-3 text-center w-10"></th>
              <th className="py-4 px-4">Job ID</th>
              <th className="py-4 px-5">Property & Issue</th>
              <th className="py-4 px-4">Type</th>
              <th className="py-4 px-4">Service Provider</th>
              <th className="py-4 px-4">Priority</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Price / Fee</th>
              <th className="py-4 px-5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-800">
            {requests.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-gray-500 font-medium">
                  No service requests found.
                </td>
              </tr>
            ) : (
              requests.map((item) => {
                const typeStyle = getTypeStyle(item.type);
                const hasExtraWorks = item.extraWorkRequests && item.extraWorkRequests.length > 0;
                const isExpanded = !!expandedRows[item.id];

                return (
                  <React.Fragment key={item.id}>
                    {/* PARENT SERVICE REQUEST ROW */}
                    <tr className={`hover:bg-purple-50/20 transition-colors ${isExpanded ? "bg-purple-50/10" : ""}`}>

                      {/* Expand / Collapse Chevron */}
                      <td className="py-4 px-3 text-center">
                        {hasExtraWorks ? (
                          <button
                            type="button"
                            onClick={() => toggleRowExpand(item.id)}
                            className="p-1 rounded-md hover:bg-purple-100 text-[#8E25E3] transition-colors cursor-pointer"
                            title={isExpanded ? "Collapse Extra Work" : "Expand Extra Work"}
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        ) : (
                          <span className="text-gray-300 text-[10px]">•</span>
                        )}
                      </td>

                      {/* Job ID */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div>
                          <p className="font-bold text-[#8E25E3] text-xs sm:text-sm">{item.id}</p>
                          <p className="text-[11px] text-gray-400 font-normal mt-0.5">{item.date}</p>
                        </div>
                      </td>

                      {/* Property & Issue */}
                      <td className="py-4 px-5 max-w-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-gray-900 text-xs sm:text-sm">{item.property}</p>
                            {hasExtraWorks && (
                              <span className="px-2 py-0.5 bg-purple-100 text-[#8E25E3] rounded-full text-[10px] font-medium">
                                +{item.extraWorkRequests.length} Extra
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 font-normal truncate mt-0.5">{item.issue}</p>
                          <p className="text-[11px] text-gray-400 font-normal">PM: {item.propertyManager}</p>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-bold text-xs">
                          <span className={`w-2 h-2 rounded-full ${typeStyle.dot}`} />
                          <span className={typeStyle.text}>{item.type}</span>
                        </span>
                      </td>

                      {/* Contractor */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`font-semibold text-xs ${item.contractor === "Unassigned" ? "text-[#DC2626]" : "text-gray-900"
                            }`}
                        >
                          {item.contractor}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold inline-block ${getPriorityBadgeStyle(
                            item.priority
                          )}`}
                        >
                          {item.priority}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {renderStatus(item.status)}
                      </td>

                      {/* Price / Fee */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div>
                          <span className="font-bold text-gray-900 text-xs sm:text-sm">
                            ${item.basePay}
                          </span>
                          {item.additionalFee ? (
                            <span className="text-[11px] text-[#8E25E3] font-semibold block">
                              +${item.additionalFee} Custom Fee
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-center whitespace-nowrap space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenJobModal(item)}
                          className="px-3 py-1.5 border border-[#E9D5FF] hover:border-[#8E25E3] text-[#8E25E3] bg-[#F3E8FF] hover:bg-[#E9D5FF] font-semibold text-xs rounded-lg transition-all cursor-pointer inline-flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>Open Job</span>
                        </button>

                        {handleOpenDetailsModal && (
                          <button
                            type="button"
                            onClick={() => handleOpenDetailsModal(item)}
                            className="px-2.5 py-1.5 border border-gray-200 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg transition-all cursor-pointer inline-flex items-center justify-center gap-1"
                            title="View Full Context"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                            <span>Details</span>
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* REASSIGNMENT ALERT ROW IF DECLINED */}
                    {item.declineReason && (
                      <tr className="bg-red-50/80 border-b border-red-200 text-xs">
                        <td></td>
                        <td colSpan={8} className="py-2.5 px-4 text-red-900">
                          <div className="flex items-center gap-2 font-medium">
                            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                            <span>
                              <strong>Decline Reason Attached:</strong> {item.declineReason}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleOpenJobModal(item)}
                              className="ml-auto underline font-bold text-red-700 hover:text-red-900 cursor-pointer"
                            >
                              Reassign Job Now →
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* COLLAPSIBLE CHILD ROWS FOR EXTRA WORK REQUESTS */}
                    {hasExtraWorks && isExpanded && (
                      <tr className="bg-purple-50/40 border-b border-purple-200">
                        <td></td>
                        <td colSpan={8} className="py-3 px-4 sm:px-6">
                          <div className="bg-white border border-purple-200 rounded-xl p-4 space-y-3 shadow-2xs">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                              <span className="text-xs font-bold text-[#8E25E3] uppercase tracking-wider flex items-center gap-1.5">
                                ↳ Related Extra Work Requests ({item.extraWorkRequests.length})
                              </span>
                              <span className="text-[11px] text-gray-500 font-medium">
                                Parent Request: <strong>#{item.id}</strong>
                              </span>
                            </div>

                            <div className="space-y-2.5">
                              {item.extraWorkRequests.map((ew) => (
                                <div
                                  key={ew.id}
                                  className="bg-purple-50/20 border border-purple-100 rounded-lg p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                  <div className="space-y-1 max-w-xl">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-[#8E25E3]">{ew.id}</span>
                                      <h5 className="font-bold text-gray-900">{ew.extraServiceName}</h5>
                                    </div>
                                    <p className="text-gray-600 font-normal leading-relaxed">{ew.description}</p>
                                    <div className="text-[11px] text-gray-400 font-normal">
                                      Requested by: <strong>{ew.requestedBy}</strong> on {ew.requestedDate}
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                                    <div>
                                      {ew.approvalStatus === "Approved" ? (
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                          Approved
                                        </span>
                                      ) : ew.approvalStatus === "Declined" ? (
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 border border-red-200 inline-flex items-center gap-1">
                                          <XCircle className="w-3 h-3 text-red-600" />
                                          Declined
                                        </span>
                                      ) : (
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                                          <Clock className="w-3 h-3 text-amber-600" />
                                          Pending PM Approval
                                        </span>
                                      )}
                                    </div>

                                    <div className="font-bold text-gray-900 text-xs">
                                      Additional Fee: <span className="text-[#8E25E3] font-medium">${ew.additionalFee}</span>
                                    </div>

                                    {ew.images && ew.images.length > 0 && (
                                      <div className="flex items-center gap-1 mt-0.5">
                                        <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="text-[10px] text-gray-500 font-medium">
                                          {ew.images.length} photo(s) attached
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
