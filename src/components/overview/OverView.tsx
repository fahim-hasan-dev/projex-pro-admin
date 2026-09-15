"use client";

import React from "react";
import RevenueChart from "./RevenueChart";
import ServicesChart from "./ServicesChart";
import RecentContractor from "./RecentContractor";
import PendingProperty from "./PendingProperty";


export default function Overview(): React.ReactElement {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[#8E25E3] font-bold text-sm">Welcome Admin!</span>
          <span className="text-xl">👋</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 font-medium mt-1">
          Your Central hub for open requests, pending approvals, and project updates.
        </p>
        
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <RevenueChart />
        <ServicesChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <RecentContractor />
        <PendingProperty />
      </div>
    </div>
  );
}