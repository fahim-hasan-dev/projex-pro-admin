export type PriorityLevel = "Critical" | "High" | "Medium" | "Low";

export type JobStatus =
  | "Pending"
  | "Assigned"
  | "Accepted"
  | "In Progress"
  | "Reassignment Requested"
  | "Declined"
  | "Completed"
  | "Cancelled";

export type ServiceCategory =
  | "Plumbing"
  | "Electrical"
  | "HVAC"
  | "Cleaning"
  | "Painting";

export interface ExtraWorkRequest {
  id: string; // e.g. "EW-01"
  parentRequestId: string; // e.g. "SR-1024"
  extraServiceName: string; // e.g. "AC Condenser Repair & Servicing"
  description: string;
  images: string[];
  additionalFee: number;
  requestedDate: string;
  requestedBy: string; // Service Provider name
  approvalStatus: "Pending Approval" | "Approved" | "Declined";
  workStatus?: "Not Started" | "Approved" | "In Progress" | "Completed";
  declineReason?: string;
  approvedDate?: string;
}

export interface ServiceRequestItem {
  id: string; // e.g. "SR-1024"
  date: string; // e.g. "Jun 24, 2026"
  propertyManager: string; // e.g. "Alex Johnson"
  property: string; // e.g. "Sunset Apartments"
  address: string;
  unit?: string;
  issue: string; // Main service description
  type: ServiceCategory;
  contractor: string; // Service Provider name or "Unassigned"
  contractorPhone?: string;
  priority: PriorityLevel;
  status: JobStatus;
  basePay: number; // Set by SA
  additionalFee?: number; // Custom/additional fee set by SA
  rateBonus?: string; // Bonus rate label e.g. "+$50" or "+15%"
  finalPayCalculated?: number;
  notes: string;
  etaDate: string;
  isSpecialized?: boolean;
  tenantName?: string;
  tenantPhone?: string;
  
  // Reassignment & decline tracking
  declineReason?: string;
  previousContractors?: { contractor: string; reason: string; date: string }[];
  
  // Parent-child relationship
  extraWorkRequests: ExtraWorkRequest[];
}

const STORAGE_KEY = "project_pro_service_requests_v2";

export const initialRequestsSeed: ServiceRequestItem[] = [
  {
    id: "SR-1024",
    date: "Jun 24, 2026",
    propertyManager: "Alex Johnson",
    property: "Sunset Apartments",
    address: "123 Sunset Blvd, Los Angeles, CA 90028",
    unit: "Unit 4B",
    issue: "Refrigerator Repair & Thermostat Check",
    type: "HVAC",
    contractor: "Mike Chen (John Smith Plumbing)",
    contractorPhone: "+1 (555) 310-4422",
    priority: "High",
    status: "In Progress",
    basePay: 250,
    additionalFee: 50,
    finalPayCalculated: 300,
    notes: "Refrigerator is leaking water and not maintaining freezing temperature.",
    etaDate: "Jun 27, 2026",
    tenantName: "Nichole Miller",
    tenantPhone: "+1 (555) 255-2552",
    extraWorkRequests: [
      {
        id: "EW-01",
        parentRequestId: "SR-1024",
        extraServiceName: "Air Conditioner Maintenance & Filter Clean",
        description: "While checking refrigerator, Property Manager requested AC repair as unit compressor is making loud noise.",
        images: ["/images/prop_1.png", "/images/prop_3.png"],
        additionalFee: 150,
        requestedDate: "Jun 25, 2026",
        requestedBy: "Mike Chen",
        approvalStatus: "Pending Approval",
        workStatus: "Not Started",
      },
    ],
  },
  {
    id: "SR-1025",
    date: "Jun 25, 2026",
    propertyManager: "Sarah Jenkins",
    property: "Oak Heights Condos",
    address: "412 Oak Street, Apt 12, Chicago, IL 60601",
    unit: "Apt 12",
    issue: "Electrical Outlet Short Circuit in Kitchen",
    type: "Electrical",
    contractor: "Unassigned",
    priority: "Critical",
    status: "Pending",
    basePay: 180,
    additionalFee: 0,
    notes: "Main breaker trips when microwave is plugged in. Requires immediate inspection.",
    etaDate: "Jun 26, 2026",
    tenantName: "David Miller",
    tenantPhone: "+1 (555) 888-1234",
    extraWorkRequests: [],
  },
  {
    id: "SR-1026",
    date: "Jun 24, 2026",
    propertyManager: "Alex Johnson",
    property: "Sunrise Towers",
    address: "88 Ocean Drive, Suite 301, San Francisco, CA 94105",
    unit: "Suite 301",
    issue: "Deep Cleaning & Sanitization After Move-Out",
    type: "Cleaning",
    contractor: "Alex Kumar (CleanPro)",
    contractorPhone: "+1 (555) 444-9988",
    priority: "Medium",
    status: "Assigned",
    basePay: 350,
    additionalFee: 25,
    finalPayCalculated: 375,
    notes: "Full move-out carpet cleaning and kitchen deep scrub before new tenant move-in.",
    etaDate: "Jun 28, 2026",
    tenantName: "Vacant",
    tenantPhone: "N/A",
    extraWorkRequests: [],
  },
  {
    id: "SR-1027",
    date: "Jun 23, 2026",
    propertyManager: "Marcus Vance",
    property: "Greenview Plaza",
    address: "105 Greenview Rd, Denver, CO 80201",
    unit: "Building B",
    issue: "Water Heater Tank Leaking in Basement",
    type: "Plumbing",
    contractor: "Unassigned",
    priority: "High",
    status: "Reassignment Requested",
    basePay: 400,
    additionalFee: 50,
    notes: "Urgent water heater inspection.",
    etaDate: "Jun 26, 2026",
    declineReason: "Schedule conflict — missing specialized high-pressure valve tools.",
    previousContractors: [
      {
        contractor: "Tom Wilson",
        reason: "Schedule conflict — missing specialized high-pressure valve tools.",
        date: "Jun 24, 2026",
      },
    ],
    extraWorkRequests: [],
  },
  {
    id: "SR-1028",
    date: "Jun 22, 2026",
    propertyManager: "Elena Rostova",
    property: "Harbor Point Towers",
    address: "55 Harbor Way, Unit 10, Seattle, WA 98101",
    unit: "Unit 10",
    issue: "Interior Wall Painting & Patchwork",
    type: "Painting",
    contractor: "Lisa Park (Apex Painters)",
    contractorPhone: "+1 (555) 777-2211",
    priority: "Medium",
    status: "In Progress",
    basePay: 1200,
    additionalFee: 100,
    finalPayCalculated: 1300,
    notes: "Living room accent wall dual coat and drywall crack patching.",
    etaDate: "Jun 29, 2026",
    extraWorkRequests: [
      {
        id: "EW-02",
        parentRequestId: "SR-1028",
        extraServiceName: "Baseboard Replacement & Trim Staining",
        description: "PM requested replacing water-damaged wooden baseboards around window frame.",
        images: ["/images/prop_4.png"],
        additionalFee: 220,
        requestedDate: "Jun 24, 2026",
        requestedBy: "Lisa Park",
        approvalStatus: "Approved",
        workStatus: "In Progress",
        approvedDate: "Jun 24, 2026",
      },
    ],
  },
];

export function getStoredRequests(): ServiceRequestItem[] {
  if (typeof window === "undefined") return initialRequestsSeed;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialRequestsSeed));
      return initialRequestsSeed;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading service requests store", err);
    return initialRequestsSeed;
  }
}

export function saveStoredRequests(requests: ServiceRequestItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new CustomEvent("service-requests-updated", { detail: requests }));
  } catch (err) {
    console.error("Error saving service requests store", err);
  }
}

export function subscribeToRequests(callback: (requests: ServiceRequestItem[]) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (e: Event) => {
    const customEvent = e as CustomEvent<ServiceRequestItem[]>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getStoredRequests());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || !e.key) {
      callback(getStoredRequests());
    }
  };

  window.addEventListener("service-requests-updated", handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener("service-requests-updated", handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

// Store Action Helpers
export function createServiceRequest(newReqData: Partial<ServiceRequestItem>): ServiceRequestItem {
  const current = getStoredRequests();
  const newId = `SR-${Math.floor(1029 + Math.random() * 9000)}`;
  const fullReq: ServiceRequestItem = {
    id: newId,
    date: newReqData.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    propertyManager: newReqData.propertyManager || "Alex Johnson",
    property: newReqData.property || "Property",
    address: newReqData.address || "Address",
    unit: newReqData.unit || "N/A",
    issue: newReqData.issue || "General Maintenance",
    type: newReqData.type || "Plumbing",
    contractor: "Unassigned",
    priority: newReqData.priority || "Medium",
    status: "Pending",
    basePay: newReqData.basePay || 200,
    additionalFee: 0,
    notes: newReqData.notes || "",
    etaDate: newReqData.etaDate || "Pending ETA",
    tenantName: newReqData.tenantName,
    tenantPhone: newReqData.tenantPhone,
    extraWorkRequests: [],
  };

  const updated = [fullReq, ...current];
  saveStoredRequests(updated);
  return fullReq;
}

export function assignServiceRequest(
  reqId: string,
  updatedFields: {
    serviceCategory?: ServiceCategory;
    issueTitle?: string;
    serviceDate?: string;
    basePay?: number;
    additionalFee?: number;
    contractor?: string;
  }
): void {
  const current = getStoredRequests();
  const updated = current.map((item) => {
    if (item.id === reqId) {
      const contractorName = updatedFields.contractor || item.contractor;
      const isAssigned = contractorName && contractorName !== "Unassigned";
      return {
        ...item,
        type: updatedFields.serviceCategory || item.type,
        issue: updatedFields.issueTitle || item.issue,
        etaDate: updatedFields.serviceDate || item.etaDate,
        basePay: updatedFields.basePay !== undefined ? updatedFields.basePay : item.basePay,
        additionalFee: updatedFields.additionalFee !== undefined ? updatedFields.additionalFee : item.additionalFee,
        finalPayCalculated: (updatedFields.basePay !== undefined ? updatedFields.basePay : item.basePay) + (updatedFields.additionalFee !== undefined ? updatedFields.additionalFee : (item.additionalFee || 0)),
        contractor: contractorName,
        status: (isAssigned ? "Assigned" : "Pending") as JobStatus,
      };
    }
    return item;
  });
  saveStoredRequests(updated);
}

export function acceptServiceRequest(reqId: string): void {
  const current = getStoredRequests();
  const updated = current.map((item) => {
    if (item.id === reqId) {
      return {
        ...item,
        status: "Accepted" as JobStatus,
      };
    }
    return item;
  });
  saveStoredRequests(updated);
}

export function declineServiceRequest(reqId: string, reason: string): void {
  const current = getStoredRequests();
  const updated = current.map((item) => {
    if (item.id === reqId) {
      const prevList = item.previousContractors || [];
      return {
        ...item,
        status: "Reassignment Requested" as JobStatus,
        contractor: "Unassigned",
        declineReason: reason,
        previousContractors: [
          ...prevList,
          {
            contractor: item.contractor,
            reason: reason,
            date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          },
        ],
      };
    }
    return item;
  });
  saveStoredRequests(updated);
}

export function createExtraWorkRequest(
  parentReqId: string,
  extraData: {
    extraServiceName: string;
    description: string;
    images: string[];
    additionalFee: number;
    requestedBy: string;
  }
): ExtraWorkRequest {
  const current = getStoredRequests();
  const newExtraId = `EW-0${Math.floor(1 + Math.random() * 99)}`;
  const newExtra: ExtraWorkRequest = {
    id: newExtraId,
    parentRequestId: parentReqId,
    extraServiceName: extraData.extraServiceName,
    description: extraData.description,
    images: extraData.images,
    additionalFee: extraData.additionalFee,
    requestedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    requestedBy: extraData.requestedBy,
    approvalStatus: "Pending Approval",
    workStatus: "Not Started",
  };

  const updated = current.map((item) => {
    if (item.id === parentReqId) {
      return {
        ...item,
        extraWorkRequests: [...(item.extraWorkRequests || []), newExtra],
      };
    }
    return item;
  });
  saveStoredRequests(updated);
  return newExtra;
}

export function approveExtraWorkRequest(parentReqId: string, extraWorkId: string): void {
  const current = getStoredRequests();
  const updated = current.map((item) => {
    if (item.id === parentReqId) {
      const updatedExtras = (item.extraWorkRequests || []).map((ew) => {
        if (ew.id === extraWorkId) {
          return {
            ...ew,
            approvalStatus: "Approved" as const,
            workStatus: "Approved" as const,
            approvedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          };
        }
        return ew;
      });
      return {
        ...item,
        extraWorkRequests: updatedExtras,
      };
    }
    return item;
  });
  saveStoredRequests(updated);
}

export function declineExtraWorkRequest(parentReqId: string, extraWorkId: string, reason?: string): void {
  const current = getStoredRequests();
  const updated = current.map((item) => {
    if (item.id === parentReqId) {
      const updatedExtras = (item.extraWorkRequests || []).map((ew) => {
        if (ew.id === extraWorkId) {
          return {
            ...ew,
            approvalStatus: "Declined" as const,
            workStatus: "Not Started" as const,
            declineReason: reason || "Declined by Property Manager",
          };
        }
        return ew;
      });
      return {
        ...item,
        extraWorkRequests: updatedExtras,
      };
    }
    return item;
  });
  saveStoredRequests(updated);
}

export function startExtraWorkRequest(parentReqId: string, extraWorkId: string): void {
  const current = getStoredRequests();
  const updated = current.map((item) => {
    if (item.id === parentReqId) {
      const updatedExtras = (item.extraWorkRequests || []).map((ew) => {
        if (ew.id === extraWorkId) {
          return {
            ...ew,
            workStatus: "In Progress" as const,
          };
        }
        return ew;
      });
      return {
        ...item,
        extraWorkRequests: updatedExtras,
      };
    }
    return item;
  });
  saveStoredRequests(updated);
}
