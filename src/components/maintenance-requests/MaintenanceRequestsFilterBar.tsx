"use client";

import React from "react";
import { FilterTab, ServiceRequestItem } from "./types";

interface MaintenanceRequestsFilterBarProps {
  activeTab: FilterTab;
  setActiveTab: (tab: FilterTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  requests: ServiceRequestItem[];
}

export default function MaintenanceRequestsFilterBar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  requests,
}: MaintenanceRequestsFilterBarProps) {
  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "All Requests", label: "All Requests", count: requests.length },
    { key: "Pending", label: "Pending", count: requests.filter((r) => r.status === "Pending").length },
    { key: "Assigned", label: "Assigned", count: requests.filter((r) => r.status === "Assigned").length },
    {
      key: "In Progress",
      label: "In Progress",
      count: requests.filter((r) => r.status === "In Progress" || r.status === "Accepted" || r.status === "Pending Approval").length,
    },
    { key: "Completed", label: "Completed", count: requests.filter((r) => r.status === "Completed").length },
    { key: "Rejected", label: "Rejected", count: requests.filter((r) => r.status === "Rejected" || r.status === "Declined").length },
    { key: "Cancelled", label: "Cancelled", count: requests.filter((r) => r.status === "Cancelled").length },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/80 pb-1">
      {/* Tabs */}
      <div className="flex items-center gap-6 overflow-x-auto custom-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap border-b-2 ${
                isActive
                  ? "border-[#8E25E3] text-[#8E25E3] font-bold"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  isActive
                    ? "bg-[#F3E8FF] text-[#8E25E3]"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative w-full md:w-64 pb-2 md:pb-0">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg text-xs sm:text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E25E3]/20 focus:border-[#8E25E3] transition-colors"
        />
      </div>
    </div>
  );
}

