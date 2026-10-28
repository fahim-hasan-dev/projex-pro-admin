"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import {
  PropertyPartner,
  StatItem,
  PartnerStatus,
  PlanType,
} from "@/components/property-managers/types";
import PropertyManagersHeader from "@/components/property-managers/PropertyManagersHeader";
import PropertyManagersStats from "@/components/property-managers/PropertyManagersStats";
import PropertyManagersFiltersBar from "@/components/property-managers/PropertyManagersFiltersBar";
import PropertyManagersTable from "@/components/property-managers/PropertyManagersTable";
import ViewPartnerModal from "@/components/property-managers/ViewPartnerModal";
import EditPartnerModal from "@/components/property-managers/EditPartnerModal";
import DeletePartnerModal from "@/components/property-managers/DeletePartnerModal";
import PaginationComponent from "@/components/ui/pagination-component";
import {
  useGetPropertyManagerQuery,
  useGetAllPropertiesQuery,
  useUpdatePartnerByAdminMutation,
  useDeleteUserMutation,
} from "@/features/user_management/userApi";

export default function PropertyManagersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Modals state
  const [viewPartner, setViewPartner] = useState<PropertyPartner | null>(null);
  const [editPartner, setEditPartner] = useState<PropertyPartner | null>(null);
  const [deletePartner, setDeletePartner] = useState<PropertyPartner | null>(null);

  // RTK Query API Hooks
  const isSubscriptionFilter = statusFilter === "Active Subscriptions" || activeCardId === "active-subscriptions";
  const { data: apiResponse, isLoading, isFetching } = useGetPropertyManagerQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    approvalStatus: statusFilter === "Pending" ? "pending,resubmitted" : undefined,
    status: statusFilter === "Active" ? "active" : statusFilter === "Suspended" ? "restricted" : undefined,
    subscribe: isSubscriptionFilter ? true : undefined,
  });

  // Query all property managers for accurate dynamic card counts
  const { data: allManagersCountResponse } = useGetPropertyManagerQuery({
    limit: 100,
  });

  // Query properties for accurate property and unit counts
  const { data: propertiesResponse } = useGetAllPropertiesQuery(undefined);

  const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerByAdminMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const rawUsers: any[] = apiResponse?.data?.users || [];
  const meta = apiResponse?.data?.meta;

  const allManagersList: any[] = allManagersCountResponse?.data?.users || [];
  const propertiesList: any[] = propertiesResponse?.data?.properties || [];

  // Build property count per manager map
  const propertyCountMap: Record<string, number> = {};
  propertiesList.forEach((p: any) => {
    const uid = typeof p.user === "object" ? p.user?._id : p.user;
    if (uid) {
      propertyCountMap[String(uid)] = (propertyCountMap[String(uid)] || 0) + 1;
    }
  });

  // Transform raw backend users into PropertyPartner items
  const partners: PropertyPartner[] = rawUsers.map((user) => {
    const profile = user.profile || {};
    const companyName =
      profile.companyName ||
      profile.legalBusinessName ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.userName ||
      user.email;
    const contactName =
      profile.contactFullName ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email;
    const contactEmail = profile.businessEmail || user.email || "";
    const contactPhone = profile.businessPhone || user.phone || user.contactNumber || "";

    const locParts = [profile.businessAddress, profile.city, profile.state].filter(Boolean);
    const location =
      locParts.length > 0
        ? profile.city && profile.state
          ? `${profile.city}, ${profile.state}`
          : locParts[0]
        : "Location not specified";

    const propertyCount = propertyCountMap[String(user._id)] ?? user.propertyCount ?? 0;

    // Resolve subscription plan
    const planObj = user.subscription?.plan;
    let planTitle = "Starter";
    if (typeof planObj === "object" && planObj?.title) {
      planTitle = planObj.title;
    } else if (user.subscribe) {
      planTitle = "PRO";
    }

    // Resolve display status
    let status: PartnerStatus = "Active";
    const rawAppStatus = (user.approvalStatus || profile.approvalStatus || "").toLowerCase();
    const rawUserStatus = (user.status || "active").toLowerCase();
    if (rawAppStatus === "pending" || rawAppStatus === "resubmitted") {
      status = "Pending";
    } else if (rawAppStatus === "rejected") {
      status = "Suspended";
    } else if (rawUserStatus === "restricted" || rawUserStatus === "deleted") {
      status = "Suspended";
    } else {
      status = "Active";
    }

    // Resolve payment type
    const paymentType = user.subscribe ? "Stripe Card / Auto" : "Invoice / Milestone";
    const shortId = `PL-${String(user._id).slice(-4).toUpperCase()}`;

    return {
      id: shortId,
      rawId: user._id,
      propertyName: companyName,
      location,
      contactName,
      contactEmail,
      contactPhone,
      noOfUnits: propertyCount,
      noOfProperties: propertyCount,
      plan: planTitle,
      status,
      paymentType,
      rawUser: user,
    };
  });

  // Client-side plan filter if selected
  const filteredPartners = partners.filter((p) => {
    if (planFilter === "All Plans") return true;
    return p.plan.toLowerCase().includes(planFilter.toLowerCase());
  });

  // Dynamic Stats for Top Cards
  const totalPartnersCount = allManagersCountResponse?.data?.meta?.total ?? allManagersList.length ?? meta?.total ?? partners.length;
  const totalPropertiesCount = propertiesResponse?.data?.totalProperties ?? propertiesList.length;
  const totalUnitsCount = propertiesList.reduce((acc: number, p: any) => acc + (p.totalUnits || 0), 0);
  const activeSubsCount = allManagersList.filter((u: any) => Boolean(u.subscribe)).length;
  const pendingCount = allManagersList.filter((u: any) => {
    const s = (u.approvalStatus || "").toLowerCase();
    return s === "pending" || s === "resubmitted";
  }).length;

  const dynamicStats: StatItem[] = [
    {
      id: "total-partners",
      title: "Total Partners",
      value: String(totalPartnersCount),
      textColor: "text-[#2563EB]",
    },
    {
      id: "total-properties",
      title: "Total Properties",
      subTitle: `Total Units: ${Number(totalUnitsCount).toLocaleString()}`,
      value: String(totalPropertiesCount),
      textColor: "text-blue-600",
    },
    {
      id: "active-subscriptions",
      title: "Active Subscriptions",
      subTitle: `MRR: $${(activeSubsCount * 2000).toLocaleString()}/mo.`,
      value: String(activeSubsCount),
      textColor: "text-emerald-600",
    },
    {
      id: "pending-approvals",
      title: "Pending Approvals",
      subTitle: "Awaiting Admin Review",
      value: String(pendingCount),
      textColor: "text-[#8E25E3]",
    },
  ];

  // Top Card Select Handler
  const handleSelectCard = (id: string) => {
    setActiveCardId(id);
    setCurrentPage(1);
    if (id === "total-partners" || id === "total-properties") {
      setStatusFilter("All Statuses");
      setPlanFilter("All Plans");
    } else if (id === "active-subscriptions") {
      setStatusFilter("Active Subscriptions");
    } else if (id === "pending-approvals") {
      setStatusFilter("Pending");
    }
  };

  // Delete Partner Action
  const handleDeleteConfirm = async () => {
    if (!deletePartner) return;
    try {
      await deleteUser(deletePartner.rawId).unwrap();
      toast.success(`Partner "${deletePartner.propertyName}" deleted successfully.`);
      setDeletePartner(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete partner account");
    }
  };

  // Edit Partner Save Action
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPartner) return;
    try {
      await updatePartner({
        id: editPartner.rawId,
        data: {
          status: editPartner.status === "Suspended" ? "restricted" : "active",
          approvalStatus:
            editPartner.status === "Pending"
              ? "pending"
              : editPartner.status === "Suspended"
              ? "rejected"
              : "approved",
        },
      }).unwrap();
      toast.success(`Updated status for ${editPartner.propertyName}`);
      setEditPartner(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update partner account");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PropertyManagersHeader />

      {/* Dynamic Stats Cards */}
      <PropertyManagersStats
        stats={dynamicStats}
        activeCardId={activeCardId}
        onSelectCard={handleSelectCard}
      />

      {/* Search and Filters Bar */}
      <PropertyManagersFiltersBar
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        planFilter={planFilter}
        setPlanFilter={(p) => {
          setPlanFilter(p);
          setCurrentPage(1);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(s) => {
          setStatusFilter(s);
          setCurrentPage(1);
        }}
        filteredCount={meta?.total ?? filteredPartners.length}
      />

      {/* Table Section */}
      {isLoading || isFetching ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#8E25E3]" />
          <p className="text-sm font-semibold text-gray-700">Loading Property Partners...</p>
        </div>
      ) : (
        <>
          <PropertyManagersTable
            partners={filteredPartners}
            setViewPartner={setViewPartner}
            setEditPartner={setEditPartner}
            setDeletePartner={setDeletePartner}
          />

          {/* Pagination & Count Info */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium px-1">
            <div>
              Showing {partners.length} of {meta?.total ?? partners.length} accounts
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
        </>
      )}

      {/* View Partner Details Modal */}
      <ViewPartnerModal
        partner={viewPartner}
        onClose={() => setViewPartner(null)}
      />

      {/* Edit Partner Modal */}
      <EditPartnerModal
        partner={editPartner}
        setPartner={setEditPartner}
        onSave={handleEditSave}
        onClose={() => setEditPartner(null)}
      />

      {/* Delete Partner Modal */}
      <DeletePartnerModal
        partner={deletePartner}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeletePartner(null)}
      />
    </div>
  );
}
