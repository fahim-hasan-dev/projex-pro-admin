"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { FilterTab } from "@/components/maintenance-requests/types";
import {
  PriorityLevel,
  ServiceCategory,
} from "@/types/serviceRequestStore";
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

  // Fetch Service Requests via API: GET /service-request
  const { data: apiResponse, isLoading, isFetching, refetch } = useGetAllServicesRequestQuery({
    page: currentPage,
    limit: 10,
    search: searchQuery,
    status: activeTab,
  });

  const rawRequests = apiResponse?.data?.requests || [];
  const meta = apiResponse?.data?.meta;

  // Map API response items to table item structure
  const requests = rawRequests.map((req: any) => {
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
      property: prop.name || "Unknown Property",
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
      additionalFee: 0,
      notes: req.description || "",
      etaDate: req.eta ? new Date(req.eta).toLocaleDateString() : "Pending",
      tenantName: req.tenantName || "",
      tenantPhone: req.tenantPhone || "",
      extraWorkRequests: [],
      raw: req,
    };
  });

  // Client side search filtering fallback
  const filteredRequests = requests.filter((r: any) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contractor.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === "Pending") matchesTab = r.status === "Pending";
    else if (activeTab === "In Progress")
      matchesTab = r.status === "In Progress" || r.status === "Accepted" || r.status === "Assigned";
    else if (activeTab === "Reassignment")
      matchesTab = r.status === "Reassignment Requested";
    else if (activeTab === "Scheduled") matchesTab = r.status === "Assigned";
    else if (activeTab === "Completed") matchesTab = r.status === "Completed";
    else if (activeTab === "Cancelled") matchesTab = r.status === "Cancelled";

    return matchesSearch && matchesTab;
  });

  // Open Job Modal Handler
  const handleOpenJobModal = (job: any) => {
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
      <MaintenanceRequestsStats requests={requests} />

      {/* Filter Tabs & Search Bar */}
      <MaintenanceRequestsFilterBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        requests={requests}
      />

      {/* Table */}
      {isLoading || isFetching ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6B1294]" />
          <p className="text-sm font-semibold text-gray-700">Loading Service Requests via API...</p>
          <span className="text-xs font-mono text-gray-400">GET /service-request</span>
        </div>
      ) : (
        <MaintenanceRequestsTable
          requests={filteredRequests}
          handleOpenJobModal={handleOpenJobModal}
          handleOpenDetailsModal={handleOpenDetailsModal}
        />
      )}

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <div className="flex justify-end pt-2">
          <PaginationComponent
            totalItems={meta.total}
            itemsPerPage={meta.limit}
            initialPage={meta.page}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
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
