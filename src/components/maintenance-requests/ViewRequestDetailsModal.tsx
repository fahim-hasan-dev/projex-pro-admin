"use client";

import React from "react";
import {
  X,
  MapPin,
  Calendar as CalendarIcon,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Building,
  Tag,
  Phone,
  Mail,
  Loader2,
  DollarSign,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";
import { useGetSingleServicesRequestQuery } from "@/features/request/requestApi";
import { baseURL } from "@/utils/BaseURL";

interface ViewRequestDetailsModalProps {
  job: any | null;
  onClose: () => void;
  onOpenAssignModal?: (job: any) => void;
}

export default function ViewRequestDetailsModal({
  job,
  onClose,
  onOpenAssignModal,
}: ViewRequestDetailsModalProps) {
  const targetId = job?._id || job?.id || "";

  // Call single request GET API endpoint: GET /service-request/:id
  const { data: apiResponse, isLoading, isFetching, isError } = useGetSingleServicesRequestQuery(
    targetId,
    { skip: !targetId }
  );

  if (!job) return null;

  // Single request item data returned from API (or fallback to job passed in props)
  const singleData = apiResponse?.data || job;

  const getImageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const pmUser = singleData?.user || {};
  const propertyInfo = singleData?.property || {};
  const categoryInfo = propertyInfo?.category || {};
  const subCategoryInfo = propertyInfo?.subCategory || {};
  const providerInfo = singleData?.assignedProvider || null;

  const images: string[] = singleData?.images || [];

  const canAssign = singleData?.status === "Pending" || singleData?.status === "Rejected" || singleData?.status === "Declined";
  const isRejected = singleData?.status === "Rejected" || singleData?.status === "Declined";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#6B1294] text-white">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white border border-white/30 font-mono">
              {singleData?.requestNo || singleData?._id || singleData?.id}
            </span>
            <div>
              <h2 className="text-lg font-bold">
                {singleData?.issueTitle || singleData?.issue || "Service Request Details"}
              </h2>
              <p className="text-xs text-purple-200 font-normal flex items-center gap-1.5 mt-0.5">
                <Building className="w-3.5 h-3.5" />
                <span>{propertyInfo?.name || singleData?.property || "Property"}</span>
                {pmUser?.firstName && (
                  <>
                    <span>•</span>
                    <span>PM: {pmUser.firstName} {pmUser.lastName}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {isLoading || isFetching ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-500 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#6B1294]" />
              <p className="text-sm font-semibold">Loading request details via API...</p>
              <span className="text-xs font-mono text-gray-400">GET /service-request/{targetId}</span>
            </div>
          ) : (
            <>
              {/* Header Info Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div
                  className={`border rounded-xl p-3 ${
                    isRejected
                      ? "bg-red-50/80 border-red-200"
                      : singleData?.status === "Assigned"
                      ? "bg-purple-50/70 border-purple-200"
                      : singleData?.status === "Completed"
                      ? "bg-emerald-50/70 border-emerald-200"
                      : "bg-purple-50/70 border-purple-100"
                  }`}
                >
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Status</span>
                  <p
                    className={`font-bold text-sm mt-0.5 flex items-center gap-1.5 ${
                      isRejected
                        ? "text-red-700"
                        : singleData?.status === "Completed"
                        ? "text-emerald-700"
                        : "text-[#6B1294]"
                    }`}
                  >
                    {isRejected ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {singleData?.status || "Pending"}
                  </p>
                </div>

                <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Priority</span>
                  <p className="font-bold text-amber-700 text-sm mt-0.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    {singleData?.priority || "Medium"}
                  </p>
                </div>

                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Category</span>
                  <p className="font-bold text-blue-700 text-xs mt-0.5 truncate">
                    {categoryInfo?.name || singleData?.type || "General"}
                  </p>
                  {subCategoryInfo?.name && (
                    <span className="text-[10px] text-blue-500 font-medium truncate block">
                      Sub: {subCategoryInfo.name}
                    </span>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Created Date</span>
                  <p className="font-bold text-gray-800 text-xs mt-0.5 flex items-center gap-1">
                    <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                    {singleData?.createdAt ? new Date(singleData.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>

              {/* Property Manager & Property Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* PM Info */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-200 pb-2">
                    <User className="w-4 h-4 text-[#6B1294]" />
                    Property Manager
                  </h4>
                  <div className="space-y-1 text-gray-700">
                    <p className="font-bold text-gray-900 text-sm">
                      {pmUser?.firstName} {pmUser?.lastName}
                    </p>
                    <p className="flex items-center gap-1.5 text-gray-600">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {pmUser?.email || "N/A"}
                    </p>
                    <p className="flex items-center gap-1.5 text-gray-600">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {pmUser?.contactNumber || pmUser?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-200 pb-2">
                    <Building className="w-4 h-4 text-[#6B1294]" />
                    Property Information
                  </h4>
                  <div className="space-y-1 text-gray-700">
                    <p className="font-bold text-gray-900 text-sm">
                      {propertyInfo?.name || singleData?.property}
                    </p>
                    <p className="flex items-center gap-1.5 text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {propertyInfo?.address || singleData?.address || "N/A"}
                    </p>
                    {propertyInfo?.totalUnits && (
                      <p className="text-gray-500 font-medium">
                        Total Units: <span className="font-bold text-gray-800">{propertyInfo.totalUnits}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Work Description & Location Details */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3 text-xs">
                <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-200 pb-2">
                  <Wrench className="w-4 h-4 text-[#6B1294]" />
                  Issue & Location Details
                </h4>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Issue Title</span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">
                    {singleData?.issueTitle || singleData?.issue}
                  </p>
                </div>

                {singleData?.description && (
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Description</span>
                    <p className="font-medium text-gray-700 mt-0.5 leading-relaxed bg-white p-3 rounded-xl border border-gray-200/70">
                      {singleData.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  {singleData?.locationDetails && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Specific Location</span>
                      <p className="font-semibold text-gray-800 mt-0.5">{singleData.locationDetails}</p>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Occupancy Status</span>
                    <p className="font-semibold text-gray-800 mt-0.5">
                      {singleData?.isOccupied ? "Occupied" : "Vacant"}
                    </p>
                  </div>

                  {singleData?.tenantName && (
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Tenant Contact</span>
                      <p className="font-semibold text-gray-800 mt-0.5">
                        {singleData.tenantName} ({singleData.tenantPhone || "No Phone"})
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Assigned Provider Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#6B1294]" />
                    Assigned Service Provider
                  </h4>
                  {isRejected && (
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-700 font-bold text-[11px] rounded-full border border-red-200 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Rejected by Provider
                    </span>
                  )}
                </div>

                {/* Show Rejection Notice & Reason if rejected */}
                {isRejected && singleData?.rejectionReason && (
                  <div className="bg-red-50/90 border border-red-200 rounded-xl p-3 text-red-800 space-y-1">
                    <p className="font-bold text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                      Provider Rejection Reason:
                    </p>
                    <p className="text-xs italic pl-5">
                      &quot;{singleData.rejectionReason}&quot;
                    </p>
                    <p className="text-[11px] text-red-600 pl-5">
                      This job requires reassigning to another available service provider.
                    </p>
                  </div>
                )}

                {providerInfo ? (
                  <div className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-gray-200">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">
                        {providerInfo.firstName} {providerInfo.lastName}
                      </p>
                      <p className="text-gray-500 font-normal">{providerInfo.email}</p>
                      <p className="text-gray-500 font-normal">{providerInfo.contactNumber || providerInfo.phone}</p>
                    </div>
                    <div>
                      {isRejected ? (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-red-100 text-red-800 font-bold text-xs rounded-full border border-red-200">
                            Rejected
                          </span>
                          {onOpenAssignModal && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenAssignModal(singleData);
                              }}
                              className="px-3 py-1.5 bg-[#6B1294] hover:bg-[#580e7a] text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer"
                            >
                              Reassign
                            </button>
                          )}
                        </div>
                      ) : singleData?.status === "Assigned" ? (
                        <span className="px-3 py-1 bg-purple-100 text-[#6B1294] font-bold text-xs rounded-full border border-purple-200">
                          Assigned (Awaiting Acceptance)
                        </span>
                      ) : singleData?.status === "Accepted" || singleData?.status === "In Progress" ? (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold text-xs rounded-full border border-blue-200">
                          Accepted & Active
                        </span>
                      ) : singleData?.status === "Completed" ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
                          Completed
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
                          {singleData?.status || "Assigned"}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 flex items-center justify-between">
                    <p className="text-amber-800 font-semibold text-xs">
                      No service provider assigned yet.
                    </p>
                    {onOpenAssignModal && canAssign && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenAssignModal(singleData);
                        }}
                        className="px-3 py-1.5 bg-[#6B1294] hover:bg-[#580e7a] text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer"
                      >
                        Assign Provider
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Attached Images */}
              {images.length > 0 && (
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#6B1294]" />
                    Attached Site Photos ({images.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {images.map((imgUrl, idx) => (
                      <a
                        key={idx}
                        href={getImageUrl(imgUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-video block"
                      >
                        <img
                          src={getImageUrl(imgUrl)}
                          alt={`Request image ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-xs">
                          View Image
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Base Payment</span>
                  <p className="font-bold text-gray-900 text-base mt-0.5">
                    ${singleData?.basePayment ?? singleData?.basePay ?? 0}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-[#6B1294] uppercase">Final Payout</span>
                  <p className="font-bold text-[#6B1294] text-base mt-0.5">
                    ${singleData?.finalPayout ?? 0}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl border border-gray-300 transition-colors cursor-pointer"
          >
            Close Details
          </button>

          {onOpenAssignModal && canAssign ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAssignModal(singleData);
              }}
              className="px-5 py-2.5 bg-[#6B1294] hover:bg-[#580e7a] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4" />
              <span>{isRejected ? "Reassign Provider" : "Review & Assign Job"}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Status:</span>
              <span
                className={`px-3 py-1 font-bold text-xs rounded-full border ${
                  singleData?.status === "Assigned"
                    ? "bg-purple-100 text-[#6B1294] border-purple-200"
                    : singleData?.status === "In Progress" || singleData?.status === "Accepted"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : singleData?.status === "Completed"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-gray-200 text-gray-700 border-gray-300"
                }`}
              >
                {singleData?.status === "Assigned"
                  ? "Assigned (Awaiting Acceptance)"
                  : singleData?.status || "N/A"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
