"use client";

import React from "react";
import {
  X,
  MapPin,
  Calendar as CalendarIcon,
  User,
  Wrench,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  History,
} from "lucide-react";
import { ServiceRequestItem } from "@/types/serviceRequestStore";

interface ViewRequestDetailsModalProps {
  job: ServiceRequestItem | null;
  onClose: () => void;
  onOpenAssignModal?: (job: ServiceRequestItem) => void;
}

export default function ViewRequestDetailsModal({
  job,
  onClose,
  onOpenAssignModal,
}: ViewRequestDetailsModalProps) {
  if (!job) return null;

  const extraWorks = job.extraWorkRequests || [];
  const totalExtraFees = extraWorks.reduce(
    (sum, ew) => (ew.approvalStatus === "Approved" ? sum + ew.additionalFee : sum),
    0
  );
  const grandTotalPayout = (job.basePay || 0) + (job.additionalFee || 0) + totalExtraFees;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-200 animate-in fade-in zoom-in-95 duration-150">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#6B1294] text-white">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold text-white border border-white/30">
              {job.id}
            </span>
            <div>
              <h2 className="text-lg font-bold">{job.property}</h2>
              <p className="text-xs text-purple-200 font-normal">
                Property Manager: <strong className="text-white">{job.propertyManager}</strong>
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

          {/* Reassignment Alert Banner if declined */}
          {job.declineReason && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-red-900">
                  Reassignment Request — Service Provider Declined
                </h4>
                <p className="text-xs font-medium">
                  Decline Reason: <span className="italic">{job.declineReason}</span>
                </p>
                {job.previousContractors && job.previousContractors.length > 0 && (
                  <div className="text-[11px] text-red-700 pt-1">
                    Previous Contractor: <strong>{job.previousContractors[job.previousContractors.length - 1].contractor}</strong> ({job.previousContractors[job.previousContractors.length - 1].date})
                  </div>
                )}
              </div>
            </div>
          )}

          {/* MAIN JOB DETAILS SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#6B1294]" />
                Main Job Context & Details
              </h3>
              <span className="px-3 py-1 bg-purple-100 text-[#6B1294] font-bold text-xs rounded-full">
                Status: {job.status}
              </span>
            </div>

            {/* Grid 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Service Category</span>
                <p className="font-bold text-gray-900 text-sm">{job.type}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Assigned Service Provider</span>
                <p className={`font-bold text-sm ${job.contractor === "Unassigned" ? "text-red-600" : "text-gray-900"}`}>
                  {job.contractor}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Scheduled Service Date</span>
                <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  {job.etaDate}
                </p>
              </div>
            </div>

            {/* Grid 2: Payout Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Main Base Price</span>
                <p className="font-medium text-gray-900 text-base mt-0.5">${job.basePay}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Super Admin Custom Fee</span>
                <p className="font-medium text-gray-900 text-base mt-0.5">${job.additionalFee || 0}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Approved Extra Work Fees</span>
                <p className="font-medium text-emerald-700 text-base mt-0.5">+${totalExtraFees}</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5">
                <span className="text-[10px] font-bold text-[#6B1294] uppercase">Grand Total Payout</span>
                <p className="font-medium text-[#6B1294] text-lg mt-0.5">${grandTotalPayout}</p>
              </div>
            </div>

            {/* Address & Issue */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Job Site Address</span>
                <p className="font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-[#6B1294]" />
                  {job.address} {job.unit ? `(${job.unit})` : ""}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Main Issue / Work Description</span>
                <p className="font-medium text-gray-800 leading-relaxed mt-0.5">{job.issue}</p>
              </div>
            </div>
          </div>

          {/* EXTRA WORK DETAILS SECTION */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-emerald-600" />
                Related Extra Work Requests ({extraWorks.length})
              </h3>
            </div>

            {extraWorks.length === 0 ? (
              <div className="p-6 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs font-medium text-gray-500">No extra work requests associated with this job.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {extraWorks.map((ew) => (
                  <div
                    key={ew.id}
                    className="border border-purple-200 rounded-2xl p-4 bg-purple-50/30 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#6B1294] text-white font-bold text-xs rounded-md">
                          {ew.id}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900">{ew.extraServiceName}</h4>
                      </div>

                      <div>
                        {ew.approvalStatus === "Approved" ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Approved by PM (${ew.additionalFee})
                          </span>
                        ) : ew.approvalStatus === "Declined" ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 inline-flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-red-600" />
                            Declined by PM
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Pending PM Approval
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="md:col-span-2 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Work Description</span>
                        <p className="text-gray-800 font-normal leading-relaxed">{ew.description}</p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-xl p-3 space-y-1">
                        <div className="flex justify-between items-center text-gray-600">
                          <span>Requested By:</span>
                          <span className="font-bold text-gray-900">{ew.requestedBy}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                          <span>Requested Date:</span>
                          <span className="font-semibold">{ew.requestedDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-900 border-t border-gray-100 pt-1.5">
                          <span className="font-bold">Additional Fee:</span>
                          <span className="font-medium text-[#6B1294]">${ew.additionalFee}</span>
                        </div>
                      </div>
                    </div>

                    {/* Images */}
                    {ew.images && ew.images.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Attached Site Photos</span>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {ew.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              alt="Extra work detail"
                              className="w-20 h-14 object-cover rounded-lg border border-gray-200"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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

          {onOpenAssignModal && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAssignModal(job);
              }}
              className="px-5 py-2.5 bg-[#6B1294] hover:bg-[#580e7a] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Wrench className="w-4 h-4" />
              <span>Review & Assign Job</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
