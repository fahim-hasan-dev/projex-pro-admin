"use client";

import React from "react";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Mail,
  Phone,
  ShieldAlert,
  Wrench,
  XCircle,
  Building2,
  MapPin,
  Eye,
  Award,
} from "lucide-react";
import { ProviderApplicantItem } from "./types";
import { baseURL } from "@/utils/BaseURL";

const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};

interface ProviderApplicantsListProps {
  applicants: ProviderApplicantItem[];
  expandedCardId: string | null;
  toggleExpand: (id: string) => void;
  handleApprove: (id: string, name: string) => void;
  handleOpenRejectModal: (id: string, name: string) => void;
  handleViewDocument: (title: string, url: string) => void;
  isActionLoading?: boolean;
}

export default function ProviderApplicantsList({
  applicants,
  expandedCardId,
  toggleExpand,
  handleApprove,
  handleOpenRejectModal,
  handleViewDocument,
  isActionLoading,
}: ProviderApplicantsListProps) {
  if (applicants.length === 0) {
    return (
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-12 text-center text-gray-500 font-medium shadow-xs">
        <Wrench className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-base font-bold text-gray-800">No service providers found</p>
        <p className="text-xs text-gray-400 mt-1">
          No applicants match the current filter or search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applicants.map((item) => {
        const isExpanded = expandedCardId === item.id;
        const isPending = item.status === "Pending" || item.status === "Under Review";

        return (
          <div
            key={item.id}
            className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs transition-all duration-200 hover:border-purple-200"
          >
            {/* Main Header Row */}
            <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Left: Avatar & Applicant Metadata */}
              <div className="flex items-center gap-4 min-w-0">
                {/* Avatar Circle or Image */}
                {item.image ? (
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0 shadow-2xs border border-purple-100"
                  />
                ) : (
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.avatarBg} ${item.avatarColor} font-bold text-base flex items-center justify-center shrink-0 shadow-2xs border border-purple-100`}
                  >
                    {item.avatarChar}
                  </div>
                )}

                {/* Content */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                      {item.name}
                    </h3>

                    {item.companyName && item.companyName !== item.name && (
                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-gray-400" />
                        {item.companyName}
                      </span>
                    )}

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-semibold flex items-center gap-1 ${item.status === "Pending"
                        ? "bg-[#FEF3C7] text-[#D97706]"
                        : item.status === "Under Review"
                          ? "bg-[#DBEAFE] text-[#2563EB]"
                          : item.status === "Approved"
                            ? "bg-[#DCFCE7] text-[#16A34A]"
                            : "bg-[#FEE2E2] text-[#DC2626]"
                        }`}
                    >
                      {item.status === "Approved" ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : item.status === "Rejected" ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {item.status}
                    </span>
                  </div>

                  {/* ID & Skills Badges */}
                  <div className="flex items-center gap-2 flex-wrap mt-1.5">
                    {item.trade && (
                      <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-semibold rounded-md flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-blue-500" />
                        <span className="truncate max-w-[200px]">{item.trade}</span>
                      </span>
                    )}
                  </div>

                  {/* Subtitle with icons */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-500 font-normal mt-2">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.experienceYears} Year{item.experienceYears === 1 ? "" : "s"} Exp</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{item.email}</span>
                    </span>

                    {item.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{item.phone}</span>
                      </span>
                    )}

                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Applied {item.appliedDate}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                {isPending && (
                  <>
                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => handleApprove(item.id, item.name)}
                      className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-semibold text-xs sm:text-sm rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve</span>
                    </button>

                    <button
                      type="button"
                      disabled={isActionLoading}
                      onClick={() => handleOpenRejectModal(item.id, item.name)}
                      className="px-4 py-2 bg-[#FEE2E2] hover:bg-[#FCA5A5] text-[#DC2626] border border-[#FCA5A5] font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {/* Toggle Expand Details */}
                <button
                  type="button"
                  onClick={() => toggleExpand(item.id)}
                  className="px-4 py-2 bg-[#FFFFFF] hover:bg-gray-50 border border-gray-300/80 text-gray-700 font-medium text-xs sm:text-sm rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <span>Details</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* Smooth Animated Expansion Details View */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${isExpanded
                ? "grid-rows-[1fr] opacity-100 border-t border-[#E5E7EB]"
                : "grid-rows-[0fr] opacity-0 border-t-0"
                }`}
            >
              <div className="overflow-hidden bg-gray-50/50">
                <div className="p-5 sm:p-6 space-y-6">
                  {/* Detailed Identifier Badges Card */}
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                      Service Provider Details & Identifiers
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">


                      <div className="bg-blue-50/80 border border-blue-200 rounded-lg p-2.5">
                        <span className="text-[10px] font-bold text-blue-600 uppercase block mb-0.5">
                          Company Name
                        </span>
                        <span className="text-xs font-bold text-blue-900 truncate block">
                          {item.companyName || "N/A"}
                        </span>
                      </div>

                      <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-2.5">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-0.5">
                          Years in Business
                        </span>
                        <span className="text-xs font-bold text-emerald-950 block">
                          {item.experienceYears} Year{item.experienceYears === 1 ? "" : "s"}
                        </span>
                      </div>

                      <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-2.5">
                        <span className="text-[10px] font-bold text-amber-700 uppercase block mb-0.5">
                          Tax ID
                        </span>
                        <span className="text-xs font-mono font-bold text-amber-950 truncate block">
                          {item.taxId || "N/A"}
                        </span>
                      </div>

                      <div className="bg-purple-50/80 border border-purple-200 rounded-lg p-2.5">
                        <span className="text-[10px] font-bold text-purple-700 uppercase block mb-0.5">
                          Provider ID
                        </span>
                        <span className="text-xs font-mono font-bold text-purple-950 truncate block" title={item.id}>
                          #{item.id ? String(item.id).slice(-6).toUpperCase() : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rejection Banner if rejected */}
                  {item.status === "Rejected" && item.rejectionReason && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-800 flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Rejection Note:</span>
                        <span>{item.rejectionReason}</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column: Bio & Skills & Addresses */}
                    <div className="space-y-4">
                      {/* Bio */}
                      <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Provider Bio / Summary
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-700 font-normal leading-relaxed bg-white border border-gray-200 p-3.5 rounded-xl shadow-2xs">
                          {item.aboutText}
                        </p>
                      </div>

                      {/* Skills Badges */}
                      {item.skills && item.skills.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Skills & Expertise
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {item.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-3 py-1 bg-purple-50 border border-purple-200 text-[#8E25E3] font-semibold text-xs rounded-lg flex items-center gap-1.5"
                              >
                                <Wrench className="w-3 h-3 text-[#8E25E3]" />
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Address Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        {item.personalAddress && (
                          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                              PERSONAL ADDRESS
                            </span>
                            <div className="flex items-start gap-1.5 text-xs text-gray-800 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                              <span>{item.personalAddress}</span>
                            </div>
                          </div>
                        )}

                        {item.officeAddress && (
                          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-2xs">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                              OFFICE ADDRESS
                            </span>
                            <div className="flex items-start gap-1.5 text-xs text-gray-800 font-medium">
                              <Building2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                              <span>{item.officeAddress}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Column: Submitted Documents */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                        Documents Submitted
                      </h4>
                      {item.documents.length === 0 ? (
                        <div className="p-4 bg-white border border-gray-200 rounded-xl text-xs text-gray-400 font-medium text-center shadow-2xs">
                          No document files attached.
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {item.documents.map((doc, idx) => (
                            <div
                              key={idx}
                              className="px-3.5 py-3 bg-[#FFFFFF] border border-gray-200 rounded-xl flex items-center justify-between shadow-2xs hover:border-purple-200 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-gray-800 min-w-0">
                                <FileText className="w-4 h-4 text-[#8E25E3] shrink-0" />
                                <span className="truncate">{doc.title}</span>
                              </div>

                              {doc.url ? (
                                <button
                                  type="button"
                                  onClick={() => handleViewDocument(doc.title, doc.url)}
                                  className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#8E25E3] border border-purple-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                                >
                                  <Eye className="w-3.5 h-3.5 text-[#8E25E3]" />
                                  <span>View Document</span>
                                </button>
                              ) : (
                                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
