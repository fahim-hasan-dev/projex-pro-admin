"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyManagersFiltersBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  planFilter: string;
  setPlanFilter: (plan: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  filteredCount: number;
}

export default function PropertyManagersFiltersBar({
  searchQuery,
  setSearchQuery,
  planFilter,
  setPlanFilter,
  statusFilter,
  setStatusFilter,
  filteredCount,
}: PropertyManagersFiltersBarProps) {
  const quickTabs = [
    { label: "All Partners", status: "All Statuses", plan: "All Plans" },
    { label: "Active Subscriptions", status: "Active", plan: "All Plans" },
    { label: "Pending Approvals", status: "Pending", plan: "All Plans" },
    { label: "Suspended", status: "Suspended", plan: "All Plans" },
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border border-gray-200/80 shadow-2xs">
      {/* Left: Quick Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
        {quickTabs.map((tab) => {
          const isActive =
            (tab.status === "All Statuses" && statusFilter === "All Statuses") ||
            (tab.status !== "All Statuses" && statusFilter === tab.status);

          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => {
                setStatusFilter(tab.status);
                if (tab.plan) setPlanFilter(tab.plan);
              }}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "bg-[#8E25E3] text-white shadow-xs"
                  : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right: Search Input, Plan & Status Dropdowns + Account Count */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {/* Search */}
        <div className="relative w-full sm:w-56">
          <input
            type="text"
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E25E3]/40 transition-colors"
          />
        </div>

        {/* Plan Filter Dropdown */}
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[140px] bg-gray-50 border-gray-200 rounded-xl text-xs font-medium text-gray-700 h-[38px] focus:ring-2 focus:ring-[#8E25E3]/40 cursor-pointer">
            <SelectValue placeholder="All Plans" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 text-xs font-medium text-gray-800 shadow-md">
            <SelectItem value="All Plans">All Plans</SelectItem>
            <SelectItem value="Enterprise">Enterprise</SelectItem>
            <SelectItem value="Pro">ProjexPro Pro</SelectItem>
            <SelectItem value="Prime">Prime</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter Dropdown */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px] bg-gray-50 border-gray-200 rounded-xl text-xs font-medium text-gray-700 h-[38px] focus:ring-2 focus:ring-[#8E25E3]/40 cursor-pointer">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 text-xs font-medium text-gray-800 shadow-md">
            <SelectItem value="All Statuses">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>

        {/* Account Count Badge */}
        <div className="text-xs font-semibold text-gray-500 shrink-0 ml-1">
          {filteredCount} accounts
        </div>
      </div>
    </div>
  );
}
