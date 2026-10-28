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
  Loader2,
  ExternalLink,
  ShieldAlert,
  Building,
  Check,
  X,
} from "lucide-react";
import { Plan, CreatePlanPayload } from "@/components/subscribe/types";
import AddModal from "@/components/subscribe/AddModal";
import EditModal from "@/components/subscribe/EditModal";
import DeleteModal from "@/components/subscribe/DeleteModal";
import PlanCard from "@/components/subscribe/PlanCard";
import {
  useGetAllPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetAllSubscriptionsQuery,
  useGetEnterpriseRequestsQuery,
  useApproveEnterpriseRequestMutation,
  useRejectEnterpriseRequestMutation,
} from "@/features/subscription/subscriptionApi";

export default function SubscriptionPage() {
  // 1. API: Fetch Live Plans from GET /plan
  const {
    data: plansResponse,
    isLoading: isLoadingPlans,
    refetch: refetchPlans,
  } = useGetAllPlansQuery(undefined);

  // 2. API: Fetch Live Subscriptions from GET /subscription
  const {
    data: subscriptionsResponse,
    isLoading: isLoadingSubs,
    refetch: refetchSubs,
  } = useGetAllSubscriptionsQuery({ limit: 500 });

  // 3. API: Fetch Enterprise Requests from GET /subscription/enterprise/requests
  const {
    data: enterpriseResponse,
    isLoading: isLoadingEnterprise,
  } = useGetEnterpriseRequestsQuery({});

  // Mutations
  const [createPlan, { isLoading: isCreatingPlan }] = useCreatePlanMutation();
  const [updatePlan, { isLoading: isUpdatingPlan }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: isDeletingPlan }] = useDeletePlanMutation();
  const [approveEnterprise, { isLoading: isApprovingEnterprise }] = useApproveEnterpriseRequestMutation();
  const [rejectEnterprise, { isLoading: isRejectingEnterprise }] = useRejectEnterpriseRequestMutation();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);

  // Enterprise Approval Modal state
  const [approvingRequest, setApprovingRequest] = useState<any | null>(null);
  const [approvalUnits, setApprovalUnits] = useState("15000");
  const [approvalFee, setApprovalFee] = useState("3.50");

  // Filter & Search states
  const [subscriberFilter, setSubscriberFilter] = useState<
    "All" | "active" | "expired" | "cancel" | "enterprise_requests"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Raw data from APIs
  const plansList: Plan[] = plansResponse?.data?.plans || [];
  const plansMeta = plansResponse?.data?.meta || {};
  const rawSubscriptions: any[] = subscriptionsResponse?.data?.subscriptions || [];
  const enterpriseRequests: any[] = enterpriseResponse?.data?.requests || [];

  // Add Plan Handler
  const handleAddPlan = async (newPlanPayload: CreatePlanPayload) => {
    try {
      const res = await createPlan(newPlanPayload).unwrap();
      toast.success(res?.message || `Subscription Plan "${newPlanPayload.title}" created successfully!`);
      setIsAddModalOpen(false);
      refetchPlans();
    } catch (err: any) {
      console.error("Create Plan Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to create plan");
    }
  };

  // Edit Plan Handler
  const handleSaveEditPlan = async (updatedData: any) => {
    try {
      const res = await updatePlan({
        id: updatedData._id,
        data: updatedData,
      }).unwrap();
      toast.success(res?.message || `Plan updated successfully!`);
      setEditingPlan(null);
      refetchPlans();
    } catch (err: any) {
      console.error("Update Plan Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to update plan");
    }
  };

  // Delete Plan Handler
  const handleDeleteConfirmPlan = async (planId: string) => {
    try {
      const res = await deletePlan(planId).unwrap();
      toast.success(res?.message || "Plan deleted successfully!");
      setDeletingPlan(null);
      refetchPlans();
    } catch (err: any) {
      console.error("Delete Plan Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to delete plan");
    }
  };

  // Enterprise Request Approval Handler
  const handleConfirmApproveEnterprise = async () => {
    if (!approvingRequest) return;
    try {
      const units = parseInt(approvalUnits) || 15000;
      const fee = parseFloat(approvalFee) || 3.5;
      const today = new Date();
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      await approveEnterprise({
        id: approvingRequest._id,
        data: {
          planName: approvingRequest.plan?.title || "ENTERPRISE",
          numberOfUnits: units,
          perUnitFee: fee,
          effectiveDate: today,
          billingDate: nextMonth,
        },
      }).unwrap();

      toast.success("Enterprise request approved & subscription activated!");
      setApprovingRequest(null);
      refetchSubs();
    } catch (err: any) {
      console.error("Approve Enterprise Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to approve enterprise request");
    }
  };

  // Enterprise Request Reject Handler
  const handleRejectEnterprise = async (requestId: string) => {
    try {
      await rejectEnterprise(requestId).unwrap();
      toast.success("Enterprise request rejected.");
    } catch (err: any) {
      console.error("Reject Enterprise Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to reject enterprise request");
    }
  };

  // Filter Subscriptions based on search & tab
  const filteredSubscriptions = rawSubscriptions.filter((sub) => {
    const user = sub.user || {};
    const plan = sub.plan || {};
    const partnerName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName || "N/A";
    const email = user.email || "";
    const planTitle = plan.title || (sub.isEnterprise ? "ENTERPRISE" : "Subscription");
    const subId = sub.subscriptionId || sub.trxId || sub._id || "";

    const matchesSearch =
      !searchQuery ||
      partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      planTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      subscriberFilter === "All" || sub.status === subscriberFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter Enterprise Requests based on search
  const filteredEnterprise = enterpriseRequests.filter((req) => {
    const user = req.user || {};
    const partnerName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName || "";
    const email = user.email || "";
    return (
      !searchQuery ||
      partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Dynamic Metrics Calculation from Real Data
  const activeSubs = rawSubscriptions.filter((s) => s.status === "active");
  const totalMRR = activeSubs.reduce((sum, s) => sum + (s.price || s.plan?.price || 0), 0);
  const activeCount = plansMeta.activeSubscriptions ?? activeSubs.length;
  const expiredCount = plansMeta.expiredSubscriptions ?? rawSubscriptions.filter((s) => s.status === "expired").length;
  const cancelledCount = plansMeta.failedSubscriptions ?? rawSubscriptions.filter((s) => s.status === "cancel").length;
  const arpu = activeCount > 0 ? Math.round(totalMRR / activeCount) : 0;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Subscription Management & SaaS Tiers
            </h1>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#8E25E3] font-semibold text-xs flex items-center gap-1 shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Stripe Integration</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
            Real-time membership tier catalog, customer recurring revenue, and active subscriptions
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-3 bg-[#8E25E3] hover:bg-[#781dc6] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>
        </div>
      </div>

      {/* 2. Overview Stats Cards Grid (Dynamic Metrics from Live API) */}
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
              <span>Calculated from active subscriptions</span>
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
              Property manager accounts in good standing
            </p>
          </div>
        </div>

        {/* Card 3: Expired / Cancelled */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Expired & Cancelled
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {expiredCount + cancelledCount} Accounts
            </h2>
            <p className="text-xs font-semibold text-amber-700 mt-1">
              {expiredCount} Expired • {cancelledCount} Cancelled
            </p>
          </div>
        </div>

        {/* Card 4: ARPU (Average Revenue Per Partner) */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-2xs flex flex-col justify-between hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Avg. Revenue Per Partner
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              ${arpu}/mo
            </h2>
            <p className="text-xs font-medium text-gray-500 mt-1">
              Average across all active property partners
            </p>
          </div>
        </div>
      </div>

      {/* 3. Membership & Pricing Tiers Section (Dynamic Plans from GET /plan) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Configured Membership Plans & Tiers</h2>
            <p className="text-xs text-gray-500 font-normal">
              Live pricing catalog synchronized with Stripe and MongoDB
            </p>
          </div>

          <span className="text-xs font-semibold text-[#8E25E3] bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            {plansList.length} Active Tiers
          </span>
        </div>

        {/* Cards Grid */}
        {isLoadingPlans ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#8E25E3]" />
            <p className="text-sm font-semibold text-gray-700">Loading subscription tiers via API...</p>
          </div>
        ) : plansList.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500">
            <p className="text-sm font-semibold">No subscription plans found in the system.</p>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="mt-3 px-4 py-2 bg-[#8E25E3] text-white rounded-lg text-xs font-bold"
            >
              Create First Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plansList.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onEdit={(target) => setEditingPlan(target)}
                onDelete={(target) => setDeletingPlan(target)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Active Subscribers & Enterprise Requests Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Subscriber Accounts & Requests</h2>
            <p className="text-xs text-gray-500 font-normal">
              Monitor active property partner subscriptions, billing status, and enterprise quote requests
            </p>
          </div>
        </div>

        {/* Subtabs Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs">
          {/* Subtab Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {[
              { id: "All", label: "All Subscribers", count: rawSubscriptions.length },
              { id: "active", label: "Active", count: rawSubscriptions.filter((s) => s.status === "active").length },
              { id: "expired", label: "Expired", count: rawSubscriptions.filter((s) => s.status === "expired").length },
              { id: "cancel", label: "Cancelled", count: rawSubscriptions.filter((s) => s.status === "cancel").length },
              { id: "enterprise_requests", label: "Enterprise Quotes", count: enterpriseRequests.length },
            ].map((tab) => {
              const isActive = subscriberFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSubscriberFilter(tab.id as typeof subscriberFilter)}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#8E25E3] text-white shadow-xs font-bold"
                      : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64 shrink-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8E25E3]/40 transition-colors"
            />
          </div>
        </div>

        {/* Dynamic Table: Subscribers or Enterprise Requests */}
        {subscriberFilter === "enterprise_requests" ? (
          /* Enterprise Requests Table */
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold bg-gray-50/50">
                    <th className="py-4 px-5 font-medium">Request ID</th>
                    <th className="py-4 px-5 font-medium">Property Partner</th>
                    <th className="py-4 px-5 font-medium">Plan Requested</th>
                    <th className="py-4 px-5 font-medium">Units Requested</th>
                    <th className="py-4 px-5 font-medium">Request Date</th>
                    <th className="py-4 px-5 font-medium">Status</th>
                    <th className="py-4 px-5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs font-medium text-gray-800">
                  {isLoadingEnterprise ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#8E25E3] mb-2" />
                        Loading enterprise requests...
                      </td>
                    </tr>
                  ) : filteredEnterprise.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-gray-500 font-medium">
                        No enterprise quotes or custom requests found.
                      </td>
                    </tr>
                  ) : (
                    filteredEnterprise.map((req) => {
                      const user = req.user || {};
                      const partnerName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName || "N/A";
                      return (
                        <tr key={req._id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-5 font-mono text-xs font-bold text-[#8E25E3]">
                            {req._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="py-4 px-5">
                            <div>
                              <p className="font-bold text-gray-900">{partnerName}</p>
                              <p className="text-[11px] text-gray-500 font-normal">{user.email || "No email"}</p>
                            </div>
                          </td>
                          <td className="py-4 px-5 font-semibold text-gray-800">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-[#8E25E3]">
                              {req.plan?.title || "ENTERPRISE"}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-gray-700">
                            {req.numberOfUnits ? `${req.numberOfUnits.toLocaleString()} Units` : "15,000+ Units"}
                          </td>
                          <td className="py-4 px-5 text-gray-600 font-normal">
                            {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A"}
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-bold inline-block capitalize ${
                                req.status === "approved"
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : req.status === "rejected"
                                  ? "bg-red-100 text-red-700 border border-red-200"
                                  : "bg-amber-100 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {req.status}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right space-x-2">
                            {req.status === "pending" ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setApprovingRequest(req);
                                    setApprovalUnits((req.numberOfUnits || 15000).toString());
                                    setApprovalFee("3.50");
                                  }}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectEnterprise(req._id)}
                                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-lg border border-red-200 transition-colors cursor-pointer"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-gray-400 text-xs italic">Processed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Live Subscribers Table */
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-xs font-semibold bg-gray-50/50">
                    <th className="py-4 px-5 font-medium">Sub ID</th>
                    <th className="py-4 px-5 font-medium">Property Partner</th>
                    <th className="py-4 px-5 font-medium">Plan Tier</th>
                    <th className="py-4 px-5 font-medium">Cycle</th>
                    <th className="py-4 px-5 font-medium">Monthly Charge</th>
                    <th className="py-4 px-5 font-medium">Current Period Ends</th>
                    <th className="py-4 px-5 font-medium">Stripe / Invoice</th>
                    <th className="py-4 px-5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs font-medium text-gray-800">
                  {isLoadingSubs ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-500">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#8E25E3] mb-2" />
                        Loading subscriber accounts via API...
                      </td>
                    </tr>
                  ) : filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-gray-500 font-medium">
                        No subscriber accounts found matching this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((item) => {
                      const user = item.user || {};
                      const plan = item.plan || {};
                      const partnerName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.userName || "N/A";
                      const subIdDisplay = item.subscriptionId
                        ? item.subscriptionId.slice(-8).toUpperCase()
                        : item.trxId
                        ? item.trxId.slice(-8).toUpperCase()
                        : item._id?.slice(-8).toUpperCase();

                      return (
                        <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-5 font-mono text-xs font-bold text-[#8E25E3]" title={item.subscriptionId || item._id}>
                            {subIdDisplay}
                          </td>
                          <td className="py-4 px-5">
                            <div>
                              <p className="font-bold text-gray-900">{partnerName}</p>
                              <p className="text-[11px] text-gray-500 font-normal">{user.email || "No email"}</p>
                              {user.totalUnitsUsed !== undefined && (
                                <p className="text-[10px] text-gray-400 font-medium">
                                  Units in portfolio: {user.totalUnitsUsed}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-5 font-semibold text-gray-800">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-[#8E25E3]">
                              {plan.title || (item.isEnterprise ? "ENTERPRISE" : "Subscription")}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-gray-600 font-normal">
                            {plan.paymentType || plan.duration || "Monthly"}
                          </td>
                          <td className="py-4 px-5 font-bold text-emerald-600 text-sm">
                            ${(item.price || plan.price || 0).toLocaleString()}/mo
                          </td>
                          <td className="py-4 px-5 text-gray-600 font-normal">
                            {item.currentPeriodEnd
                              ? new Date(item.currentPeriodEnd).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </td>
                          <td className="py-4 px-5 text-gray-600 font-normal">
                            {item.invoice ? (
                              <a
                                href={item.invoice}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[#8E25E3] hover:underline font-semibold text-xs"
                              >
                                <span>Stripe Receipt</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : item.trxId ? (
                              <span className="text-[11px] font-mono text-gray-400">{item.trxId.slice(0, 14)}...</span>
                            ) : (
                              <span className="text-gray-400 text-xs">Direct Subscription</span>
                            )}
                          </td>
                          <td className="py-4 px-5">
                            <span
                              className={`px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 w-fit capitalize ${
                                item.status === "active"
                                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                  : item.status === "expired"
                                  ? "bg-amber-100 text-amber-700 border border-amber-200"
                                  : "bg-red-100 text-red-700 border border-red-200"
                              }`}
                            >
                              {item.status === "active" && <CheckCircle2 className="w-3 h-3" />}
                              {item.status === "expired" && <Clock className="w-3 h-3" />}
                              {item.status === "cancel" && <XCircle className="w-3 h-3" />}
                              <span>{item.status === "cancel" ? "Cancelled" : item.status}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. Modals */}
      <AddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPlan}
        isLoading={isCreatingPlan}
      />

      <EditModal
        isOpen={!!editingPlan}
        onClose={() => setEditingPlan(null)}
        plan={editingPlan}
        onSave={handleSaveEditPlan}
        isLoading={isUpdatingPlan}
      />

      <DeleteModal
        isOpen={!!deletingPlan}
        onClose={() => setDeletingPlan(null)}
        plan={deletingPlan}
        onDelete={handleDeleteConfirmPlan}
        isLoading={isDeletingPlan}
      />

      {/* Enterprise Approval Modal */}
      {approvingRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Approve Enterprise Subscription</h3>
              <button
                type="button"
                onClick={() => setApprovingRequest(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-xs text-[#8E25E3]">
              <p className="font-bold">
                Requester: {approvingRequest.user?.firstName} {approvingRequest.user?.lastName} ({approvingRequest.user?.email})
              </p>
              <p className="text-[11px] text-purple-700 mt-0.5">
                Set approved unit quota and monthly rate for this enterprise property manager.
              </p>
            </div>

            <div className="space-y-3 text-xs font-medium text-gray-700">
              <div>
                <label className="block mb-1 font-semibold">Total Approved Units</label>
                <input
                  type="number"
                  value={approvalUnits}
                  onChange={(e) => setApprovalUnits(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold">Per Unit Monthly Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={approvalFee}
                  onChange={(e) => setApprovalFee(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold"
                />
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-gray-600">Calculated Monthly Rate:</span>
                <span className="font-bold text-emerald-600 text-sm">
                  ${((parseInt(approvalUnits) || 0) * (parseFloat(approvalFee) || 0)).toLocaleString()}/mo
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setApprovingRequest(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproveEnterprise}
                disabled={isApprovingEnterprise}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isApprovingEnterprise && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isApprovingEnterprise ? "Activating..." : "Confirm & Activate"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
