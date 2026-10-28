"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  MapPin,
  Calendar,
  Loader2,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useGetPropertyManagerQuery } from "@/features/user_management/userApi";
import { Input } from "@/components/ui/input";
import PaginationComponent from "@/components/ui/pagination-component";

export default function PropertyManagerApprovalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"pending" | "all">("pending");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Call GET API: GET /user?role=property_manager with query parameters
  const { data: apiResponse, isLoading, isFetching } = useGetPropertyManagerQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    approvalStatus: statusFilter === "pending" ? "pending,resubmitted" : undefined,
  });

  const { data: countResponse } = useGetPropertyManagerQuery({
    limit: 100,
  });

  const allUsers: any[] = apiResponse?.data?.users || [];
  const meta = apiResponse?.data?.meta;

  const allManagersList: any[] = countResponse?.data?.users || [];
  const totalPending = allManagersList.filter((u) => {
    const s = (u.approvalStatus || "").toLowerCase();
    return s === "pending" || s === "resubmitted";
  }).length;
  const totalAll = countResponse?.data?.meta?.total ?? allManagersList.length;

  const handleStatusFilterChange = (filter: "pending" | "all") => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

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
    if (s === "resubmitted") {
      return (
        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-xs border border-blue-200 inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Resubmitted
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
              {totalPending} pending
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
            onClick={() => handleStatusFilterChange("pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === "pending"
                ? "bg-white text-[#8E25E3] shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Pending ({totalPending})
          </button>
          <button
            type="button"
            onClick={() => handleStatusFilterChange("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-white text-[#8E25E3] shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            All Requests ({totalAll})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4">
        <Input
          placeholder="Search by company, applicant name, or email..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-md h-10 text-xs rounded-xl border-gray-200 focus:border-[#8E25E3] focus:ring-[#8E25E3]"
        />
        {meta && (
          <span className="text-xs text-gray-500 font-medium">
            Showing {allUsers.length} of {meta.total} requests
          </span>
        )}
      </div>

      {/* Approvals Queue Cards List */}
      <div className="space-y-4">
        {isLoading || isFetching ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#8E25E3]" />
            <p className="text-sm font-semibold text-gray-700">Loading Property Managers...</p>
          </div>
        ) : allUsers.length === 0 ? (
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
          allUsers.map((user, idx) => {
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
                : profile.city || profile.state || profile.businessAddress || "N/A";
            const portfolio =
              profile.portfolioSize ||
              (user.calculatedUnits || user.totalUnitsUsed
                ? `${user.calculatedUnits || user.totalUnitsUsed} Units`
                : user.propertyCount
                ? `${user.propertyCount} Properties`
                : "N/A");
            const submittedDate = user.createdAt
              ? new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "N/A";

            const avatarChar = (companyName || applicantName || "P").charAt(0).toUpperCase();

            // Calculate display serial based on pagination
            const serialNumber = (currentPage - 1) * itemsPerPage + idx + 1;

            return (
              <div
                key={user._id}
                className="bg-white hover:bg-purple-50/20 border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-150"
              >
                {/* Left Side: Number, Avatar & Company Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-xs font-mono font-semibold text-gray-400 w-5 text-center shrink-0">
                    {serialNumber}
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

      {/* Pagination Component & Info */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium px-1">
        <div>
          Showing {allUsers.length} of {meta?.total ?? allUsers.length} applications
        </div>
        {meta && meta.total > itemsPerPage && (
          <PaginationComponent
            totalItems={meta.total}
            itemsPerPage={itemsPerPage}
            initialPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}
