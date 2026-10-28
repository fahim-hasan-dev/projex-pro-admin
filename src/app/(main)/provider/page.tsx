"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { FilterTab, ProviderApplicantItem, ApplicantStatus, ProviderDocumentItem } from "@/components/provider-applicants/types";
import ProviderApplicantsHeader from "@/components/provider-applicants/ProviderApplicantsHeader";
import ProviderApplicantsFilterBar from "@/components/provider-applicants/ProviderApplicantsFilterBar";
import ProviderApplicantsList from "@/components/provider-applicants/ProviderApplicantsList";
import RejectProviderModal from "@/components/provider-applicants/RejectProviderModal";
import DocumentViewerModal from "@/components/provider-applicants/DocumentViewerModal";
import PaginationComponent from "@/components/ui/pagination-component";
import {
  useGetServiceProviderQuery,
  useApproveRejectUserByAdminMutation,
} from "@/features/user_management/userApi";

export default function ProviderApplicantsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Modal States
  const [targetRejectProvider, setTargetRejectProvider] = useState<{ id: string; name: string } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ title: string; url: string } | null>(null);

  // Backend status mapping
  const backendApprovalStatus =
    activeTab === "Pending"
      ? "pending,resubmitted"
      : activeTab === "Approved"
      ? "approved"
      : activeTab === "Rejected"
      ? "rejected"
      : activeTab === "Action Required"
      ? "pending,resubmitted"
      : undefined;

  // Main Paginated API Hook
  const { data: apiResponse, isLoading, isFetching } = useGetServiceProviderQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    approvalStatus: backendApprovalStatus,
  });

  // Query all service providers to dynamically calculate global tab counts
  const { data: countResponse } = useGetServiceProviderQuery({
    limit: 100,
  });

  const [approveRejectUser, { isLoading: isSubmitting }] = useApproveRejectUserByAdminMutation();

  const allRawUsers: any[] = apiResponse?.data?.users || [];
  const meta = apiResponse?.data?.meta;

  const allProvidersList: any[] = countResponse?.data?.users || [];

  // Calculate Tab Counts accurately from database
  const counts = {
    all: countResponse?.data?.meta?.total ?? allProvidersList.length,
    approved: allProvidersList.filter((u: any) => {
      const s = (u.approvalStatus || u.profile?.approvalStatus || "").toLowerCase();
      return s === "approved";
    }).length,
    pending: allProvidersList.filter((u: any) => {
      const s = (u.approvalStatus || u.profile?.approvalStatus || "").toLowerCase();
      return s === "pending" || s === "resubmitted" || (!s && u.role === "service_provider");
    }).length,
    actionRequired: allProvidersList.filter((u: any) => {
      const s = (u.approvalStatus || u.profile?.approvalStatus || "").toLowerCase();
      return s === "pending" || s === "resubmitted" || s === "under review" || !s;
    }).length,
    rejected: allProvidersList.filter((u: any) => {
      const s = (u.approvalStatus || u.profile?.approvalStatus || "").toLowerCase();
      return s === "rejected";
    }).length,
  };

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Map API response users to ProviderApplicantItem
  const applicants: ProviderApplicantItem[] = allRawUsers.map((user) => {
    const profile = user.profile || {};
    const image = user?.image
    const companyName = profile.companyName || "";
    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.userName ||
      user.username ||
      companyName ||
      user.email;

    const rawStatus = (user.approvalStatus || profile.approvalStatus || user.status || "pending").toLowerCase();
    let status: ApplicantStatus = "Pending";
    if (rawStatus === "approved") status = "Approved";
    else if (rawStatus === "rejected") status = "Rejected";
    else status = "Pending";

    const skills: string[] = Array.isArray(profile.skills) ? profile.skills : [];
    const trade = skills.length > 0 ? skills.join(", ") : "Service Provider";

    const personalAddress = [profile.streetAddress, profile.city, profile.state, profile.zipCode]
      .filter(Boolean)
      .join(", ");

    const officeAddress = [profile.officeAddress, profile.officeCity, profile.officeState, profile.officeZipCode]
      .filter(Boolean)
      .join(", ");

    const documents: ProviderDocumentItem[] = [];
    if (profile.governmentId) {
      documents.push({ title: "Government ID", url: profile.governmentId });
    }
    if (profile.proofOfInsurance) {
      documents.push({ title: "Proof of Insurance", url: profile.proofOfInsurance });
    }
    if (profile.insurance) {
      documents.push({ title: "Insurance Document", url: profile.insurance });
    }
    if (typeof profile.licenses === "string" && profile.licenses) {
      documents.push({ title: "Trade / Business License", url: profile.licenses });
    } else if (Array.isArray(profile.licenses)) {
      profile.licenses.forEach((lic: any, idx: number) => {
        if (typeof lic === "string" && lic) {
          documents.push({ title: `License ${idx + 1}`, url: lic });
        } else if (lic?.url) {
          documents.push({ title: lic.title || `License ${idx + 1}`, url: lic.url });
        }
      });
    }
    if (Array.isArray(profile.documents)) {
      profile.documents.forEach((docPath: string, idx: number) => {
        if (docPath) {
          documents.push({ title: `Document ${idx + 1}`, url: docPath });
        }
      });
    }

    const appliedDate = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      : "N/A";

    const avatarChar = (companyName || name || "P").charAt(0).toUpperCase();

    return {
      id: user._id,
      image,
      avatarChar,
      avatarBg: "bg-purple-100",
      avatarColor: "text-[#8E25E3]",
      name,
      companyName,
      trade,
      skills,
      experienceYears: profile.yearsInBusiness || 0,
      email: user.email || "N/A",
      phone: user.contactNumber || user.phone || profile.officePhone || "",
      appliedDate,
      status,
      rawStatus,
      aboutText: profile.bio || "No bio summary provided.",
      taxId: profile.taxId || "",
      rejectionReason: user.rejectionReason || profile.rejectionReason || "",
      personalAddress,
      officeAddress,
      documents,
    };
  });

  // Handle Approve Action -> Body: { "approvalStatus": "approved" }
  const handleApprove = async (id: string, name: string) => {
    try {
      const res = await approveRejectUser({
        id,
        data: {
          approvalStatus: "approved",
        },
      }).unwrap();

      toast.success(res?.message || `${name} approved successfully!`);
    } catch (err: any) {
      console.error("Approve Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to approve service provider");
    }
  };

  // Open Reject Modal
  const handleOpenRejectModal = (id: string, name: string) => {
    setTargetRejectProvider({ id, name });
  };

  // Confirm Reject Action -> Body: { "approvalStatus": "rejected", "rejectionReason": reason }
  const handleRejectConfirm = async (reason: string) => {
    if (!targetRejectProvider) return;

    try {
      const res = await approveRejectUser({
        id: targetRejectProvider.id,
        data: {
          approvalStatus: "rejected",
          rejectionReason: reason,
        },
      }).unwrap();

      toast.error(res?.message || `${targetRejectProvider.name} application rejected.`);
      setTargetRejectProvider(null);
    } catch (err: any) {
      console.error("Reject Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to reject service provider");
    }
  };

  // View Document in Modal
  const handleViewDocument = (title: string, url: string) => {
    setSelectedDocument({ title, url });
  };

  const toggleExpand = (id: string) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  // Filter List based on activeTab
  const filteredApplicants = applicants.filter((item) => {
    if (activeTab === "Pending") return item.status === "Pending";
    if (activeTab === "Approved") return item.status === "Approved";
    if (activeTab === "Rejected") return item.status === "Rejected";
    if (activeTab === "Action Required") return item.status === "Pending" || item.status === "Under Review";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProviderApplicantsHeader pendingCount={counts.pending} />

      {/* Filter Tabs & Search Bar */}
      <ProviderApplicantsFilterBar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        counts={counts}
      />

      {/* Cards List or Loading */}
      {isLoading || isFetching ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#8E25E3]" />
          <p className="text-sm font-semibold text-gray-700">Loading Service Providers...</p>
        </div>
      ) : (
        <>
          <ProviderApplicantsList
            applicants={filteredApplicants}
            expandedCardId={expandedCardId}
            toggleExpand={toggleExpand}
            handleApprove={handleApprove}
            handleOpenRejectModal={handleOpenRejectModal}
            handleViewDocument={handleViewDocument}
            isActionLoading={isSubmitting}
          />

          {/* Pagination Component & Info */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium px-1">
            <div>
              Showing {filteredApplicants.length} of {meta?.total ?? filteredApplicants.length} providers
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

      {/* Reject Modal */}
      <RejectProviderModal
        isOpen={Boolean(targetRejectProvider)}
        onClose={() => setTargetRejectProvider(null)}
        onConfirm={handleRejectConfirm}
        providerName={targetRejectProvider?.name || ""}
        isSubmitting={isSubmitting}
      />

      {/* Document Viewer Modal inside Dashboard */}
      <DocumentViewerModal
        isOpen={Boolean(selectedDocument)}
        onClose={() => setSelectedDocument(null)}
        title={selectedDocument?.title || ""}
        url={selectedDocument?.url || ""}
      />
    </div>
  );
}
