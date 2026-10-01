"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, MapPin, Building2, Calendar, Loader2, UserCheck, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useGetPropertyManagerQuery } from "@/features/user_management/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PropertyManagerApprovalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  // Call GET API: GET /user?role=property_manager
  const { data: apiResponse, isLoading } = useGetPropertyManagerQuery({
    search: searchTerm,
  });

  const allUsers: any[] = apiResponse?.data?.users || [];

  // Pending count
  const pendingUsers = allUsers.filter(
    (u) => (u.approvalStatus || u.status || "").toLowerCase() === "pending"
  );

  // Filtered Users list based on selected status filter
  const displayedUsers = allUsers.filter((u) => {
    const status = (u.approvalStatus || u.status || "").toLowerCase();
    if (statusFilter === "pending") return status === "pending";
    if (statusFilter === "approved") return status === "approved";
    if (statusFilter === "rejected") return status === "rejected";
    return true;
  });

  const getStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s === "approved") {
      return (
        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200 inline-flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Approved
        </span>
      );
    }
    if (s === "rejected") {
      return (
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-semibold text-xs border border-red-200 inline-flex items-center gap-1">
          <XCircle className="w-3.5 h-3.5 text-red-600" />
          Rejected
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-semibold text-xs border border-amber-200 inline-flex items-center gap-1">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Pending Review
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Property Manager Approval Requests
            </h1>
            <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs border border-amber-200">
              {pendingUsers.length} pending
            </span>
          </div>
          <p className="text-sm text-gray-500 font-normal mt-1">
            Review, verify credentials, and manage platform access for property managers.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === "pending"
              ? "bg-white text-[#8E25E3] shadow-xs"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            Pending ({pendingUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === "all"
              ? "bg-white text-[#8E25E3] shadow-xs"
              : "text-gray-600 hover:text-gray-900"
              }`}
          >
            All Requests ({allUsers.length})
          </button>
        </div>
      </div>

      {/* Search Bar & Refresh */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
        <Input
          placeholder="Search by company, applicant name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md h-10 text-xs rounded-xl border-gray-200 focus:border-[#8E25E3] focus:ring-[#8E25E3]"
        />
      </div>

      {/* Approvals Queue Cards List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#8E25E3]" />
            <p className="text-sm font-semibold text-gray-700">Loading Property Managers</p>
          </div>
        ) : displayedUsers.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 font-medium">
            <UserCheck className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-base font-bold text-gray-800">No property manager requests found</p>
            <p className="text-xs text-gray-400 mt-1">
              {statusFilter === "pending"
                ? "All property manager approval requests have been processed!"
                : "No items match your search filter."}
            </p>
          </div>
        ) : (
          displayedUsers.map((user, idx) => {
            const profile = user.profile || {};
            const companyName =
              profile.companyName ||
              profile.legalBusinessName ||
              `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
              user.userName ||
              user.email;
            const applicantName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;
            const jobTitle = profile.jobTitle || "Property Manager";
            const location =
              profile.city && profile.state
                ? `${profile.city}, ${profile.state}`
                : profile.city || profile.state || "N/A";
            const portfolio = profile.portfolioSize || (user.totalUnitsUsed ? `${user.totalUnitsUsed} Units` : "N/A");
            const submittedDate = user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              : "N/A";

            const avatarChar = companyName.charAt(0).toUpperCase() || "P";

            return (
              <div
                key={user._id}
                className="bg-white hover:bg-purple-50/20 border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150"
              >
                {/* Left Side: Number, Avatar & Company Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs font-mono font-semibold text-gray-400 w-5 text-center shrink-0">
                    {idx + 1}
                  </span>

                  {/* Avatar Badge */}
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#8E25E3] font-bold text-lg flex items-center justify-center shrink-0 shadow-xs">
                    {avatarChar}
                  </div>

                  {/* Company & Applicant Name */}
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-gray-900 leading-snug truncate">
                      {companyName}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium truncate mt-0.5">
                      {applicantName} · <span className="text-[#8E25E3]">{jobTitle}</span>
                    </p>
                  </div>
                </div>

                {/* Middle Section: Metadata Columns */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs md:ml-auto pr-2">
                  {/* Status Badge */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                      STATUS
                    </span>
                    {getStatusBadge(user.approvalStatus || user.status)}
                  </div>

                  {/* Location */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                      LOCATION
                    </span>
                    <div className="flex items-center gap-1 text-gray-700 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{location}</span>
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                      PORTFOLIO
                    </span>
                    <span className="text-gray-800 font-bold bg-gray-100 px-2 py-0.5 rounded-md">
                      {portfolio}
                    </span>
                  </div>

                  {/* Submitted */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                      SUBMITTED
                    </span>
                    <span className="text-gray-700 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {submittedDate}
                    </span>
                  </div>
                </div>

                {/* Right Side: Review Button Navigating to /property-manager-approval/[id] */}
                <div className="shrink-0 pt-2 md:pt-0">
                  <Link
                    href={`/property-manager-approval/${user._id}`}
                    className="w-full md:w-auto px-5 py-2.5 bg-[#8E25E3] hover:bg-[#7b1ed0] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <span>Review Application</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
