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
import {
  useGetServiceProviderQuery,
  useApproveRejectUserByAdminMutation,
} from "@/features/user_management/userApi";

export default function ProviderApplicantsPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  // Modal States
  const [targetRejectProvider, setTargetRejectProvider] = useState<{ id: string; name: string } | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ title: string; url: string } | null>(null);

  // API Hooks
  const { data: apiResponse, isLoading } = useGetServiceProviderQuery({
    search: searchQuery,
  });

  const [approveRejectUser, { isLoading: isSubmitting }] = useApproveRejectUserByAdminMutation();

  const allRawUsers: any[] = apiResponse?.data?.users || [];

  console.log("all raw users", allRawUsers)

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

  // Calculate Tab Counts
  const counts = {
    all: applicants.length,
    approved: applicants.filter((a) => a.status === "Approved").length,
    pending: applicants.filter((a) => a.status === "Pending").length,
    actionRequired: applicants.filter((a) => a.status === "Pending" || a.status === "Under Review").length,
    rejected: applicants.filter((a) => a.status === "Rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <ProviderApplicantsHeader pendingCount={counts.pending} />

      {/* Filter Tabs & Search Bar */}
      <ProviderApplicantsFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        counts={counts}
      />

      {/* Cards List or Loading */}
      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#8E25E3]" />
          <p className="text-sm font-semibold text-gray-700">Loading Service Providers...</p>
        </div>
      ) : (
        <ProviderApplicantsList
          applicants={filteredApplicants}
          expandedCardId={expandedCardId}
          toggleExpand={toggleExpand}
          handleApprove={handleApprove}
          handleOpenRejectModal={handleOpenRejectModal}
          handleViewDocument={handleViewDocument}
          isActionLoading={isSubmitting}
        />
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
