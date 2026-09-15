"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FilterTab } from "@/components/maintenance-requests/types";
import {
  JobStatus,
  PriorityLevel,
  ServiceCategory,
  ServiceRequestItem,
  getStoredRequests,
  subscribeToRequests,
  assignServiceRequest,
  createServiceRequest,
} from "@/types/serviceRequestStore";
import MaintenanceRequestsHeader from "@/components/maintenance-requests/MaintenanceRequestsHeader";
import MaintenanceRequestsStats from "@/components/maintenance-requests/MaintenanceRequestsStats";
import MaintenanceRequestsFilterBar from "@/components/maintenance-requests/MaintenanceRequestsFilterBar";
import MaintenanceRequestsTable from "@/components/maintenance-requests/MaintenanceRequestsTable";
import JobRateModal from "@/components/maintenance-requests/JobRateModal";
import ViewRequestDetailsModal from "@/components/maintenance-requests/ViewRequestDetailsModal";
import CreateServiceRequestModal from "@/components/maintenance-requests/CreateServiceRequestModal";

export default function MaintenanceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequestItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("All Requests");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [selectedJobForAssign, setSelectedJobForAssign] = useState<ServiceRequestItem | null>(null);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<ServiceRequestItem | null>(null);
  const [assignedContractor, setAssignedContractor] = useState<string>("");

  // New Request Modal State
  const [showNewRequestModal, setShowNewRequestModal] = useState<boolean>(false);
  const [newProperty, setNewProperty] = useState("");
  const [newIssue, setNewIssue] = useState("");
  const [newType, setNewType] = useState<ServiceCategory>("Plumbing");
  const [newPriority, setNewPriority] = useState<PriorityLevel>("Medium");
  const [newBasePay, setNewBasePay] = useState<number>(200);

  useEffect(() => {
    setRequests(getStoredRequests());
    const unsubscribe = subscribeToRequests((updated) => {
      setRequests(updated);
    });
    return () => unsubscribe();
  }, []);

  // Open Job Modal Handler
  const handleOpenJobModal = (job: ServiceRequestItem) => {
    setSelectedJobForAssign(job);
    setAssignedContractor(job.contractor || "Unassigned");
  };

  // Open Details Modal Handler
  const handleOpenDetailsModal = (job: ServiceRequestItem) => {
    setSelectedJobForDetails(job);
  };

  // Save Assignment & Review Handler
  const handleSaveJobAssignment = (updatedFields: {
    serviceCategory: ServiceCategory;
    issueTitle: string;
    serviceDate: string;
    basePay: number;
    additionalFee: number;
    contractor: string;
  }) => {
    if (!selectedJobForAssign) return;

    assignServiceRequest(selectedJobForAssign.id, updatedFields);
    toast.success(`Job ${selectedJobForAssign.id} updated & assigned to ${updatedFields.contractor}!`);
    setSelectedJobForAssign(null);
  };

  // Super Admin Create New Request
  const handleCreateNewRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProperty || !newIssue) {
      toast.error("Please fill in property and issue details");
      return;
    }

    const created = createServiceRequest({
      property: newProperty,
      address: `${newProperty}, Unit 1A`,
      issue: newIssue,
      type: newType,
      priority: newPriority,
      basePay: newBasePay,
      notes: "Submitted via Super Admin dashboard.",
    });

    toast.success(`New service request ${created.id} created!`);
    setShowNewRequestModal(false);
    setNewProperty("");
    setNewIssue("");
  };

  // Filtering
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.contractor.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTab = true;
    if (activeTab === "Pending") matchesTab = r.status === "Pending";
    else if (activeTab === "In Progress") matchesTab = r.status === "In Progress" || r.status === "Accepted" || r.status === "Assigned";
    else if (activeTab === "Reassignment") matchesTab = r.status === "Reassignment Requested" || !!r.declineReason;
    else if (activeTab === "Scheduled") matchesTab = r.status === "Assigned";
    else if (activeTab === "Completed") matchesTab = r.status === "Completed";
    else if (activeTab === "Cancelled") matchesTab = r.status === "Cancelled";

    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <MaintenanceRequestsHeader onOpenNewRequest={() => setShowNewRequestModal(true)} />

      {/* Stats Cards */}
      <MaintenanceRequestsStats requests={requests as any} />

      {/* Filter Tabs & Search Bar */}
      <MaintenanceRequestsFilterBar
        activeTab={activeTab as FilterTab}
        setActiveTab={setActiveTab as any}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        requests={requests as any}
      />

      {/* Table */}
      <MaintenanceRequestsTable
        requests={filteredRequests}
        handleOpenJobModal={handleOpenJobModal}
        handleOpenDetailsModal={handleOpenDetailsModal}
      />

      {/* Job & Provider Assignment Modal */}
      <JobRateModal
        job={selectedJobForAssign}
        onClose={() => setSelectedJobForAssign(null)}
        onSave={handleSaveJobAssignment}
        assignedContractor={assignedContractor}
        setAssignedContractor={setAssignedContractor}
      />

      {/* Comprehensive View Details Modal */}
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
