"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
  XCircle,
  Zap,
} from "lucide-react";
import { Plan, PackageBody } from "@/components/subscribe/types";
import AddModal from "@/components/subscribe/AddModal";
import EditModal from "@/components/subscribe/EditModal";
import DeleteModal from "@/components/subscribe/DeleteModal";
import PlanCard from "@/components/subscribe/PlanCard";

// Initial Demo Subscription Plans
const defaultPlans: Plan[] = [
  {
    _id: "plan-prime",
    title: "PRIME",
    tagline: "For property managers starting out with core operational tools",
    pricePerUnit: "per unit / month",
    unitRange: "Up to 1,000 Units",
    minimumText: "$ 500 monthly min. | 250 - door minimum",
    targetAudience: "Best for independent operators needing essential tracking & work orders.",
    footerTagline: "Streamline Operations . Build Efficiency",
    ctaText: "Select Prime",
    participantCount: 1000,
    benefits: [
      "Essential Work Order & Ticket Management",
      "Standard Tenant & Vendor Communication",
      "Basic Invoice & Payment Processing",
      "Automated Monthly Financial Reporting",
      "Email & In-App Customer Support",
      "Basic Portfolio Analytics Dashboard",
    ],
    planPrices: [
      { type: "month", price: 1.0, priceId: "p_prime_mo" },
      { type: "year", price: 10.0, priceId: "p_prime_yr" },
    ],
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    _id: "plan-pro",
    title: "PRO",
    tagline: "For property professionals ready to streamline operations",
    pricePerUnit: "per unit / month",
    unitRange: "1,000 - 15,000 Units",
    minimumText: "$ 2,000 monthly min. | 1,000 - door minimum",
    targetAudience: "Best for owners and portfolio leaders who want complete visibility and accountability.",
    footerTagline: "Track Every Project . Verify Every Outcome",
    ctaText: "Go Pro",
    isPopular: true,
    badgeText: "MOST POPULAR",
    participantCount: 15000,
    benefits: [
      "All Prime features, plus",
      "Renovation & Turnover Project Workspace",
      "Multi-Vendor Bidding & Comparison",
      "Milestone-Based Project Approvals",
      "Change -Order Review & Approvals",
      "Property Work Order & Invoice Reporting",
      "Vendor Performance & Compliance Tracking",
      "Priority Access to ProjexPro Vetted Marketplace",
      "White-Glove Portfolio Setup & Priority Support",
    ],
    planPrices: [
      { type: "month", price: 2.0, priceId: "p_pro_mo" },
      { type: "year", price: 20.0, priceId: "p_pro_yr" },
    ],
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    _id: "plan-enterprise",
    title: "ENTERPRISE",
    tagline: "For enterprise portfolio leaders needing custom scale & SLA support",
    pricePerUnit: "per unit / month",
    unitRange: "15,000+ Units",
    minimumText: "Custom monthly min. | Enterprise SLA",
    targetAudience: "Best for large institutional portfolio leaders requiring dedicated infrastructure & API access.",
    footerTagline: "Empower Scale . Enterprise Security",
    ctaText: "Contact Enterprise",
    participantCount: 50000,
    benefits: [
      "All Pro features, plus",
      "Unlimited Property Units & Sub-Portfolios",
      "Instant Emergency Job Matching",
      "API Integration & Custom Webhooks",
      "Dedicated Account Manager (24/7)",
      "Custom SLA Guarantee (99.9%)",
      "White-Label Portal & Multi-Vendor Escrow",
    ],
    planPrices: [
      { type: "month", price: 3.5, priceId: "p_ent_mo" },
      { type: "year", price: 35.0, priceId: "p_ent_yr" },
    ],
    createdAt: "2026-01-05T00:00:00Z",
  },
];

// Initial Demo Active Subscribers
interface SubscriberAccount {
  id: string;
  partnerName: string;
  email: string;
  planTitle: string;
  cycle: "Monthly" | "Yearly";
  mrr: number;
  startDate: string;
  renewalDate: string;
  status: "Active Subscriptions" | "Trial Periods" | "Cancelled Plans";
  paymentMethod: string;
}

const initialSubscribers: SubscriberAccount[] = [
  {
    id: "SUB-801",
    partnerName: "Apex Property Group LLC",
    email: "billing@apexproperty.com",
    planTitle: "ENTERPRISE Plan",
    cycle: "Yearly",
    mrr: 3500,
    startDate: "Jan 12, 2026",
    renewalDate: "Jan 12, 2027",
    status: "Active Subscriptions",
    paymentMethod: "Visa ending in 4242",
  },
  {
    id: "SUB-802",
    partnerName: "Beacon Hill Management",
    email: "finance@beaconhill.com",
    planTitle: "PRO Plan",
    cycle: "Monthly",
    mrr: 2000,
    startDate: "Feb 01, 2026",
    renewalDate: "Mar 01, 2026",
    status: "Active Subscriptions",
    paymentMethod: "Mastercard ending in 8812",
  },
  {
    id: "SUB-803",
    partnerName: "Crestview Realty Partners",
    email: "admin@crestviewrealty.com",
    planTitle: "PRIME Plan",
    cycle: "Monthly",
    mrr: 500,
    startDate: "Feb 05, 2026",
    renewalDate: "Mar 05, 2026",
    status: "Trial Periods",
    paymentMethod: "ACH Direct Debit",
  },
  {
    id: "SUB-804",
    partnerName: "Oakridge Residential",
    email: "payments@oakridgeres.com",
    planTitle: "PRO Plan",
    cycle: "Monthly",
    mrr: 2000,
    startDate: "Dec 15, 2025",
    renewalDate: "Feb 15, 2026",
    status: "Cancelled Plans",
    paymentMethod: "Amex ending in 1004",
  },
  {
    id: "SUB-805",
    partnerName: "Summit Housing Solutions",
    email: "contact@summithousing.com",
    planTitle: "ENTERPRISE Plan",
    cycle: "Monthly",
    mrr: 3500,
    startDate: "Jan 20, 2026",
    renewalDate: "Feb 20, 2026",
    status: "Active Subscriptions",
    paymentMethod: "Visa ending in 9091",
  },
];

export default function SubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>(defaultPlans);
  const [subscribers, setSubscribers] = useState<SubscriberAccount[]>(initialSubscribers);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);

  // Filter & Search states
  const [subscriberFilter, setSubscriberFilter] = useState<
    "All" | "Active Subscriptions" | "Trial Periods" | "Cancelled Plans"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Plan Handler
  const handleAddPlan = (newPackage: PackageBody) => {
    const newPlan: Plan = {
      _id: `plan-${Date.now()}`,
      title: `${newPackage.title.toUpperCase()}`,
      tagline: newPackage.tagline,
      pricePerUnit: newPackage.pricePerUnit || "per unit / month",
      unitRange: newPackage.unitRange || "Custom Units",
      minimumText: newPackage.minimumText || "Custom Minimum",
      targetAudience: newPackage.targetAudience || "Custom tier for property management",
      footerTagline: newPackage.footerTagline || "Track Every Project . Verify Every Outcome",
      ctaText: `Select ${newPackage.title.toUpperCase()}`,
      participantCount: newPackage.participantCount,
      benefits: newPackage.benefits,
      planPrices:
        newPackage.title === "free"
          ? [{ type: "free", price: 0 }]
          : [
            { type: newPackage.type, price: newPackage.price, productId: newPackage.productId },
          ],
      createdAt: new Date().toISOString(),
    };

    setPlans((prev) => [...prev, newPlan]);
    toast.success(`Subscription Plan "${newPlan.title}" created successfully!`);
    setIsAddModalOpen(false);
  };

  // Edit Plan Handler
  const handleSaveEditPlan = (updatedPlan: Plan) => {
    setPlans((prev) => prev.map((p) => (p._id === updatedPlan._id ? updatedPlan : p)));
    toast.success(`Plan "${updatedPlan.title}" updated successfully!`);
    setEditingPlan(null);
  };

  // Delete Plan Handler
  const handleDeleteConfirmPlan = (planId: string) => {
    const target = plans.find((p) => p._id === planId);
    setPlans((prev) => prev.filter((p) => p._id !== planId));
    toast.error(`Plan "${target?.title || "Subscription Plan"}" deleted.`);
    setDeletingPlan(null);
  };

  // Subscriber status toggle handler
  const handleToggleSubscriberStatus = (id: string, currentStatus: SubscriberAccount["status"]) => {
    const nextStatus: SubscriberAccount["status"] =
      currentStatus === "Active Subscriptions"
        ? "Cancelled Plans"
        : "Active Subscriptions";

    setSubscribers((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: nextStatus } : sub))
    );
    toast.success(
      `Subscriber ${id} status updated to ${nextStatus === "Active Subscriptions" ? "ACTIVE" : "CANCELLED"}`
    );
  };

  // Filter Subscribers
  const filteredSubscribers = subscribers.filter((sub) => {
    const matchesSearch =
      sub.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.planTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      subscriberFilter === "All" || sub.status === subscriberFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalMRR = subscribers
    .filter((s) => s.status === "Active Subscriptions")
    .reduce((sum, s) => sum + s.mrr, 0);

  const activeCount = subscribers.filter((s) => s.status === "Active Subscriptions").length;
  const trialCount = subscribers.filter((s) => s.status === "Trial Periods").length;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              The One Platform You Need Today, To Drive Growth For Tomorrow.
            </h1>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#8E25E3] font-semibold text-xs flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SaaS Tiers</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Built to adapt. Engineered to scale.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-3 bg-[#8E25E3] hover:bg-[#781dc6] text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {/* 2. Overview Stats Cards Grid (4 Cards Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: MRR */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Monthly Recurring Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#8E25E3] flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              ${totalMRR.toLocaleString()}/mo
            </h2>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12.4% vs last month</span>
            </p>
          </div>
        </div>

        {/* Card 2: Active Subscriptions */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Active Subscriptions
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {activeCount} Partners
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-1">
              14 Monthly, 4 Annual Tiers
            </p>
          </div>
        </div>

        {/* Card 3: Trial Memberships */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Trial Memberships
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {trialCount} Accounts
            </h2>
            <p className="text-xs font-semibold text-blue-600 mt-1">
              Next conversion in 7 days
            </p>
          </div>
        </div>

        {/* Card 4: ARPU (Average Revenue Per Partner) */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Avg. Revenue Per Partner
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              ${Math.round(totalMRR / (activeCount || 1))}/mo
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-1">
              98.2% Retention Rate
            </p>
          </div>
        </div>
      </div>

      {/* 3. Membership & Pricing Tiers Section (Card Grid) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Membership Plans & Tiers</h2>
            <p className="text-xs text-gray-500 font-normal">
              Active pricing tiers offered to Property Managers and Landlords
            </p>
          </div>

          <span className="text-xs font-semibold text-[#8E25E3] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            {plans.length} Configured Tiers
          </span>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              onEdit={(target) => setEditingPlan(target)}
              onDelete={(target) => setDeletingPlan(target)}
            />
          ))}

        </div>
      </div>

      {/* 4. Active Subscribers List Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Subscriber Accounts</h2>
            <p className="text-xs text-gray-500 font-normal">
              Monitor active property partner subscriptions, billing status, and renewal dates
            </p>
          </div>
        </div>

        {/* Subtabs Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3.5 rounded-lg border border-gray-200 shadow-2xs">
          {/* Subtab Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {[
              { id: "All", label: "All Subscribers" },
              { id: "Active Subscriptions", label: "Active Subscriptions" },
              { id: "Trial Periods", label: "Trial Periods" },
              { id: "Cancelled Plans", label: "Cancelled Plans" },
            ].map((tab) => {
              const isActive = subscriberFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSubscriberFilter(tab.id as typeof subscriberFilter)}
                  className={`px-3.5 py-3 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${isActive
                    ? "bg-[#8E25E3] text-white shadow-xs"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E25E3]/40 transition-colors"
            />
          </div>
        </div>

        {/* Subscriber Accounts Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold bg-gray-50/50">
                  <th className="py-4 px-5 font-medium">Sub ID</th>
                  <th className="py-4 px-5 font-medium">Property Partner</th>
                  <th className="py-4 px-5 font-medium">Plan Tier</th>
                  <th className="py-4 px-5 font-medium">Cycle</th>
                  <th className="py-4 px-5 font-medium">Monthly Fee</th>
                  <th className="py-4 px-5 font-medium">Renewal Date</th>
                  <th className="py-4 px-5 font-medium">Payment Method</th>
                  <th className="py-4 px-5 font-medium">Status</th>
                  <th className="py-4 px-5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-xs font-medium text-gray-800">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-gray-500 font-medium">
                      No subscriber accounts found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-5 font-bold text-[#8E25E3]">{item.id}</td>
                      <td className="py-4 px-5">
                        <div>
                          <p className="font-bold text-gray-900">{item.partnerName}</p>
                          <p className="text-[11px] text-gray-500 font-normal">{item.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-5 font-semibold text-gray-800">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-[#8E25E3]">
                          {item.planTitle}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-normal">{item.cycle}</td>
                      <td className="py-4 px-5 font-bold text-emerald-600 text-sm">
                        ${item.mrr}/mo
                      </td>
                      <td className="py-4 px-5 text-gray-600 font-normal">{item.renewalDate}</td>
                      <td className="py-4 px-5 text-gray-600 font-normal">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>{item.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit ${item.status === "Active Subscriptions"
                              ? "bg-emerald-100 text-emerald-700"
                              : item.status === "Trial Periods"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                          {item.status === "Active Subscriptions" && (
                            <CheckCircle2 className="w-3 h-3" />
                          )}
                          {item.status === "Trial Periods" && <Clock className="w-3 h-3" />}
                          {item.status === "Cancelled Plans" && <XCircle className="w-3 h-3" />}
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleSubscriberStatus(item.id, item.status)}
                          className="px-3 py-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          {item.status === "Active Subscriptions" ? "Cancel" : "Reactivate"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Modals */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPlan}
      />

      <EditModal
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        plan={editingPlan}
        onSave={handleSaveEditPlan}
      />

      <DeleteModal
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        plan={deletingPlan}
        onDelete={handleDeleteConfirmPlan}
      />
    </div>
  );
}
