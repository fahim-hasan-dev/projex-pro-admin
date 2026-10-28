"use client";

import React from "react";
import { ServiceRequestItem } from "./types";

interface MaintenanceRequestsStatsProps {
  requests: ServiceRequestItem[];
}

export default function MaintenanceRequestsStats({ requests }: MaintenanceRequestsStatsProps) {
  const criticalCount = requests.filter((r) => r.priority === "Critical" || r.priority === "Urgent").length;
  const inProgressCount = requests.filter(
    (r) => r.status === "In Progress" || r.status === "Accepted" || r.status === "Pending Approval"
  ).length;
  const pendingAssignmentCount = requests.filter((r) => r.status === "Pending" || r.contractor === "Unassigned").length;
  const specializedCount = requests.filter((r) => r.isSpecialized || !!r.rateBonus).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* Card 1: Critical */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 shadow-xs flex flex-col justify-center transition-all hover:shadow-md">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#DC2626] leading-none mb-1.5">{criticalCount}</h2>
        <p className="text-xs sm:text-sm font-medium text-gray-500">Critical</p>
      </div>

      {/* Card 2: In Progress */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 shadow-xs flex flex-col justify-center transition-all hover:shadow-md">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#2563EB] leading-none mb-1.5">{inProgressCount}</h2>
        <p className="text-xs sm:text-sm font-medium text-gray-500">In Progress</p>
      </div>

      {/* Card 3: Pending Assignment */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 shadow-xs flex flex-col justify-center transition-all hover:shadow-md">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#D97706] leading-none mb-1.5">{pendingAssignmentCount}</h2>
        <p className="text-xs sm:text-sm font-medium text-gray-500">Pending Assignment</p>
      </div>

      {/* Card 4: Specialized Rate Jobs */}
      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 shadow-xs flex flex-col justify-center transition-all hover:shadow-md">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#8E25E3] leading-none mb-1.5">{specializedCount}</h2>
        <p className="text-xs sm:text-sm font-medium text-gray-500">Specialized Rate Jobs</p>
      </div>
    </div>
  );
}

