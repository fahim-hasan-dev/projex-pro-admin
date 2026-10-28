"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  User,
  XCircle,
  Loader2,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetSingleUserQuery,
  useApproveRejectUserByAdminMutation,
} from "@/features/user_management/userApi";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyManagerApprovalDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const targetId = resolvedParams.id;

  // Fetch single user directly via GET /api/v1/user/:id
  const { data: singleUserResponse, isLoading, isFetching } = useGetSingleUserQuery(targetId, {
    skip: !targetId,
  });
  const [approveRejectUser, { isLoading: isSubmitting }] = useApproveRejectUserByAdminMutation();

  const user = singleUserResponse?.data || singleUserResponse?.user;

  const [activeActionView, setActiveActionView] = useState<"default" | "reject_note">("default");
  const [rejectionNote, setRejectionNote] = useState("");

  if (isLoading || isFetching) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
        <Loader2 className="w-8 h-8 animate-spin text-[#8E25E3]" />
        <p className="text-sm font-semibold text-gray-700">Loading Property Manager</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-4">
        <p className="text-base font-bold text-gray-800">Property Manager Application Not Found</p>
        <Link
          href="/property-manager-approval"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#8E25E3] text-white rounded-xl font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Approval Queue
        </Link>
      </div>
    );
  }

  const profile = user.profile || {};
  const companyName =
    profile.companyName ||
    profile.legalBusinessName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.email;
  const applicantName =
    profile.contactFullName ||
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.email;
  const roleTitle = profile.jobTitle || "Property Manager";
  const email = profile.businessEmail || user.email || "N/A";
  const phone = profile.businessPhone || user.contactNumber || user.phone || "N/A";
  const businessAddress = profile.businessAddress || "";
  const city = profile.city || "";
  const state = profile.state || "";
  const zipCode = profile.zipCode || "";
  const location = [businessAddress, city, state, zipCode].filter(Boolean).join(", ") || (city && state ? `${city}, ${state}` : city || state || "N/A");
  const portfolioUnits = profile.portfolioSize || (user.calculatedUnits || user.totalUnitsUsed ? `${user.calculatedUnits || user.totalUnitsUsed} Units` : (user.propertyCount ? `${user.propertyCount} Properties` : "N/A"));
  const maintenanceType = profile.maintenanceInfrastructure || "Outsourced to third-party vendors";
  const submittedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "N/A";

  const currentApprovalStatus = (user.approvalStatus || user.status || "pending").toLowerCase();
  const isApproved = currentApprovalStatus === "approved";
  const isRejected = currentApprovalStatus === "rejected";
  const isResubmitted = currentApprovalStatus === "resubmitted";
  const isProcessed = isApproved || isRejected;

  const avatarChar = companyName.charAt(0).toUpperCase() || "P";

  // Property Types Array
  const propertyTypesList: string[] = Array.isArray(profile.propertyTypes)
    ? profile.propertyTypes
    : [];

  // Approve Handler -> Body: { "approvalStatus": "approved" }
  const handleApprove = async () => {
    try {
      const res = await approveRejectUser({
        id: user._id,
        data: {
          approvalStatus: "approved",
        },
      }).unwrap();

      toast.success(res?.message || `Application for ${companyName} approved successfully!`);
    } catch (err: any) {
      console.error("Approve Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to approve application");
    }
  };

  // Reject Handler -> Body: { "approvalStatus": "rejected", "rejectionReason": "..." }
  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rejectionNote.trim()) {
      toast.error("Please enter a rejection reason note.");
      return;
    }

    try {
      const res = await approveRejectUser({
        id: user._id,
        data: {
          approvalStatus: "rejected",
          rejectionReason: rejectionNote.trim(),
        },
      }).unwrap();

      toast.error(res?.message || `Application for ${companyName} rejected.`);
      setActiveActionView("default");
    } catch (err: any) {
      console.error("Reject Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to reject application");
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation Header */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <Link
          href="/property-manager-approval"
          className="px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-gray-700 flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Queue</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span>Approval Queue</span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-bold text-gray-900">{companyName}</span>
      </div>

      {/* Top Header Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar Circle */}
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-[#8E25E3] font-bold text-xl flex items-center justify-center shrink-0 shadow-xs">
            {avatarChar}
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-snug">
              {companyName}
            </h1>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {applicantName} · <span className="text-[#8E25E3] font-semibold">{roleTitle}</span>
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-600 font-medium mt-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{location}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>Submitted {submittedDate}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          <span
            className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 border capitalize ${isApproved
                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                : isRejected
                  ? "bg-red-100 text-red-800 border-red-200"
                  : isResubmitted
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-amber-100 text-amber-800 border-amber-200"
              }`}
          >
            {isApproved ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : isRejected ? (
              <XCircle className="w-3.5 h-3.5 text-red-600" />
            ) : isResubmitted ? (
              <Clock className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>{isResubmitted ? "Resubmitted" : currentApprovalStatus}</span>
          </span>
        </div>
      </div>

      {/* 2x2 Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: CONTACT INFORMATION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            CONTACT INFORMATION
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-[#8E25E3] shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">FULL NAME</span>
                <span className="font-bold text-gray-900 text-sm">{applicantName}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-[#8E25E3] shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">JOB TITLE</span>
                <span className="font-bold text-gray-900 text-sm">{roleTitle}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-[#8E25E3] shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">BUSINESS EMAIL</span>
                <span className="font-bold text-gray-900 text-sm">{email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-[#8E25E3] shrink-0 mt-0.5">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">CONTACT NUMBER</span>
                <span className="font-bold text-gray-900 text-sm">{phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: COMPANY & LOCATION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            COMPANY & LOCATION
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-[#8E25E3] shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">COMPANY NAME</span>
                <span className="font-bold text-gray-900 text-sm">{companyName}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-[#8E25E3] shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">CITY</span>
                <span className="font-bold text-gray-900 text-sm">{city}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-[#8E25E3] shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">STATE</span>
                <span className="font-bold text-gray-900 text-sm">{state}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: PORTFOLIO DETAILS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            PORTFOLIO DETAILS
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-[#8E25E3] shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">PORTFOLIO SIZE</span>
                <span className="font-bold text-gray-900 text-sm">{portfolioUnits}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-purple-50 text-[#8E25E3] shrink-0 mt-0.5">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase block">MAINTENANCE INFRASTRUCTURE</span>
                <span className="font-semibold text-gray-800 text-xs leading-relaxed">{maintenanceType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: PROPERTY TYPES */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            PROPERTY TYPES
          </h3>

          {propertyTypesList.length === 0 ? (
            <p className="text-xs text-gray-400 font-medium">No property types specified.</p>
          ) : (
            propertyTypesList.map((pt, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-purple-50 text-[#8E25E3] font-bold text-xs flex items-center justify-between shadow-2xs border border-purple-100"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>{pt}</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-[#8E25E3]" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Section: Action Required OR Status Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        {isProcessed ? (
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Application Processed</h3>
            {isApproved ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>This property manager application has been APPROVED. No further action is required.</span>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-800 space-y-1">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>This property manager application has been REJECTED.</span>
                </div>
                {user.rejectionReason && (
                  <p className="text-xs text-red-700 font-normal pl-7">
                    Reason: {user.rejectionReason}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : activeActionView === "default" ? (
          <>
            <div>
              <h3 className="text-base font-bold text-gray-900">Action Required</h3>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Please review this submitted application and take action to approve or reject.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Approve Button */}
              <button
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="py-3.5 px-6 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-500 text-emerald-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                )}
                <span>Approve Application</span>
              </button>

              {/* Reject Button -> Opens Rejection Note Form */}
              <button
                type="button"
                onClick={() => setActiveActionView("reject_note")}
                disabled={isSubmitting}
                className="py-3.5 px-6 bg-red-50 hover:bg-red-100 border-2 border-red-300 text-red-700 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Reject Application</span>
              </button>
            </div>
          </>
        ) : (
          /* Rejection Note Input Form View */
          <form onSubmit={handleRejectSubmit} className="space-y-4">
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>Please enter a reason/note before submitting the rejection.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                REJECTION REASON <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="e.g. Information invalid, please correct your information."
                className="w-full p-3.5 bg-white border border-gray-300 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-red-400 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center justify-start gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <span>Submit Rejection</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveActionView("default");
                  setRejectionNote("");
                }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
