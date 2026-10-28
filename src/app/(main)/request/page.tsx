"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FilterTab,
  PriorityLevel,
  ServiceCategory,
} from "@/components/maintenance-requests/types";
import {
  useGetAllServicesRequestQuery,
  useAssignServiceProvideByAdminMutation,
} from "@/features/request/requestApi";
import MaintenanceRequestsHeader from "@/components/maintenance-requests/MaintenanceRequestsHeader";
import MaintenanceRequestsStats from "@/components/maintenance-requests/MaintenanceRequestsStats";
import MaintenanceRequestsFilterBar from "@/components/maintenance-requests/MaintenanceRequestsFilterBar";
import MaintenanceRequestsTable from "@/components/maintenance-requests/MaintenanceRequestsTable";
import JobRateModal from "@/components/maintenance-requests/JobRateModal";
import ViewRequestDetailsModal from "@/components/maintenance-requests/ViewRequestDetailsModal";
import CreateServiceRequestModal from "@/components/maintenance-requests/CreateServiceRequestModal";
import PaginationComponent from "@/components/ui/pagination-component";
import { Loader2 } from "lucide-react";

export default function MaintenanceRequestsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<FilterTab>("All Requests");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedJobForAssign, setSelectedJobForAssign] = useState<any | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<any | null>(null);
  const [assignedContractor, setAssignedContractor] = useState<string>("");

  // Assign mutation
  const [assignProvider] = useAssignServiceProvideByAdminMutation();

  // Create Request Modal State
  const [showNewRequestModal, setShowNewRequestModal] = useState<boolean>(false);
  const [newProperty, setNewProperty] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newType, setNewType] = useState<ServiceCategory>("Plumbing");
  const [newPriority, setNewPriority] = useState<PriorityLevel>("Medium");
  const [newBasePay, setNewBasePay] = useState<number>(200);

  // Backend Status Mapping
  const backendStatus =
    activeTab === "Pending"
      ? "Pending"
      : activeTab === "Assigned"
      ? "Assigned"
      : activeTab === "In Progress"
      ? "In Progress,Accepted,Pending Approval"
      : activeTab === "Completed"
      ? "Completed"
      : activeTab === "Rejected"
      ? "Rejected,Declined"
      : activeTab === "Cancelled"
      ? "Cancelled"
      : undefined;

  // Main paginated query via API: GET /service-request
  const { data: apiResponse, isLoading, isFetching, refetch } = useGetAllServicesRequestQuery({
    page: currentPage,
    limit: 10,
    search: searchQuery,
    status: backendStatus,
  });

  // Query all service requests to dynamically calculate global stats & tab counts
  const { data: allRequestsResponse } = useGetAllServicesRequestQuery({
    limit: 1000,
  });

  const rawRequests = apiResponse?.data?.requests || [];
  const meta = apiResponse?.data?.meta;

  const allRawRequests = allRequestsResponse?.data?.requests || [];

  const mapRequestItem = (req: any) => {
    const pmUser = req.user || {};
    const prop = req.property || {};
    const cat = prop.category || {};
    const provider = req.assignedProvider || {};

    return {
      _id: req._id,
      id: req.requestNo || req._id,
      date: req.createdAt
        ? new Date(req.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      propertyManager: pmUser.firstName ? `${pmUser.firstName} ${pmUser.lastName || ""}`.trim() : "N/A",
      property: prop.name || prop.title || "Property",
      address: prop.address || "",
      issue: req.issueTitle || req.description || "Service Issue",
      type: cat.name || "Plumbing",
      contractor: provider.firstName
        ? `${provider.firstName} ${provider.lastName || ""}`.trim()
        : "Unassigned",
      contractorPhone: provider.phone || provider.contactNumber || "",
      priority: req.priority || "Medium",
      status: req.status || "Pending",
      basePay: req.basePayment || 0,
      additionalFee: req.specializedRate?.isActive ? (req.specializedRate?.value || 0) : 0,
      notes: req.description || "",
      etaDate: req.eta ? new Date(req.eta).toLocaleDateString() : "Pending",
      tenantName: req.tenantName || "",
      tenantPhone: req.tenantPhone || "",
      declineReason: req.rejectionReason || req.declineReason || "",
      isSpecialized: Boolean(req.specializedRate?.isActive),
      rateBonus: req.specializedRate?.value || 0,
      specializedRate: req.specializedRate,
      extraWorkRequests: [],
      raw: req,
    };
  };

  const requests = rawRequests.map(mapRequestItem);
  const allRequests = allRawRequests.map(mapRequestItem);

  // Client side search fallback if needed
  const filteredRequests = requests.filter((r: any) => {
    if (!searchQuery) return true;
    return (
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contractor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Open Job Modal Handler
  const handleOpenJobModal = (job: any) => {
    const status = job.status || job.raw?.status;
    const canAssign = status === "Pending" || status === "Rejected" || status === "Declined";
    if (!canAssign) {
      toast.error(`Cannot assign provider. Request is currently "${status}". Only Pending or Rejected requests can be assigned.`);
      return;
    }
    setSelectedJobForAssign(job);
    setAssignedContractor(job.contractor || "Unassigned");
  };

  // Open Details Modal Handler (triggers single request API in modal)
  const handleOpenDetailsModal = (job: any) => {
    setSelectedJobForDetails(job);
  };

  // Save Assignment Handler
  const handleSaveJobAssignment = async (updatedFields: any) => {
    if (!selectedJobForAssign) return;

    const status = selectedJobForAssign.status || selectedJobForAssign.raw?.status;
    const canAssign = status === "Pending" || status === "Rejected" || status === "Declined";
    if (!canAssign) {
      toast.error(`Cannot assign provider. Request is in "${status}" status.`);
      setSelectedJobForAssign(null);
      return;
    }

    try {
      const targetId = selectedJobForAssign._id || selectedJobForAssign.id;
      const res = await assignProvider({
        id: targetId,
        data: updatedFields,
      }).unwrap();

      toast.success(res?.message || `Job updated & assigned successfully!`);
      setSelectedJobForAssign(null);
      refetch();
    } catch (err: any) {
      console.error("Assign Provider Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to assign provider");
    }
  };

  // Super Admin Create New Request Handler
  const handleCreateNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProperty || !newIssue) {
      toast.error("Please fill in property and issue details");
      return;
    }
    toast.success("Service request modal submitted!");
    setShowNewRequestModal(false);
    setNewProperty("");
    setNewIssue("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <MaintenanceRequestsHeader onOpenNewRequest={() => setShowNewRequestModal(true)} />

      {/* Stats Cards */}
      <MaintenanceRequestsStats requests={allRequests.length > 0 ? allRequests : requests} />

      {/* Filter Tabs & Search Bar */}
      <MaintenanceRequestsFilterBar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        requests={allRequests.length > 0 ? allRequests : requests}
      />

      {/* Table */}
      {isLoading || isFetching ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#8E25E3]" />
          <p className="text-sm font-semibold text-gray-700">Loading Service Requests via API...</p>
        </div>
      ) : (
        <>
          <MaintenanceRequestsTable
            requests={filteredRequests}
            handleOpenJobModal={handleOpenJobModal}
            handleOpenDetailsModal={handleOpenDetailsModal}
          />

          {/* Pagination & Count Info */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium px-1">
            <div>
              Showing {filteredRequests.length} of {meta?.total ?? filteredRequests.length} service requests
            </div>
            {meta && meta.total > 10 && (
              <PaginationComponent
                totalItems={meta.total}
                itemsPerPage={meta.limit || 10}
                initialPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </>
      )}

      {/* Job & Provider Assignment Modal */}
      <JobRateModal
        job={selectedJobForAssign}
        onClose={() => setSelectedJobForAssign(null)}
        onSave={handleSaveJobAssignment}
        assignedContractor={assignedContractor}
        setAssignedContractor={setAssignedContractor}
      />

      {/* Comprehensive View Details Modal (fetches GET /service-request/:id) */}
      <ViewRequestDetailsModal
        job={selectedJobForDetails}
        onClose={() => setSelectedJobForDetails(null)}
        onOpenAssignModal={handleOpenJobModal}
      />

      {/* Create New Service Request Modal */}
      <CreateServiceRequestModal
        show={showNewRequestModal}
        onClose={() => setShowNewRequestModal(false)}
        onSubmit={handleCreateNewRequest}
        newProperty={newProperty}
        setNewProperty={setNewProperty}
        newIssue={newIssue}
        setNewIssue={setNewIssue}
        newType={newType}
        setNewType={setNewType}
        newPriority={newPriority}
        setNewPriority={setNewPriority}
        newBasePay={newBasePay}
        setNewBasePay={setNewBasePay}
      />
    </div>
  );
}
