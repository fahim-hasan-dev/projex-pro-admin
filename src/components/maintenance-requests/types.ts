export type PriorityLevel = "Critical" | "High" | "Medium" | "Low";
export type JobStatus = "In Progress" | "Pending" | "Assigned" | "Completed" | "Cancelled";
export type ServiceCategory = "Plumbing" | "Electrical" | "HVAC" | "Cleaning" | "Painting";
export type FilterTab = "All Requests" | "Pending" | "In Progress" | "Reassignment" | "Scheduled" | "Completed" | "Cancelled";

export type ServiceRequestItem = {
  id: string;
  date: string;
  property: string;
  address: string;
  issue: string;
  type: ServiceCategory;
  contractor: string;
  priority: PriorityLevel;
  status: JobStatus;
  basePay: number;
  rateBonus?: string;
  finalPayCalculated?: number;
  notes: string;
  etaDate: string;
  isSpecialized?: boolean;
};

export const initialRequestsList: ServiceRequestItem[] = [
  {
    id: "SR-1298",
    date: "Jun 24, 2026",
    property: "Maple Residences",
    address: "1201 Maple Ave, Unit 4B, Austin, TX",
    issue: "Leaking faucet in master bathroom",
    type: "Plumbing",
    contractor: "Mike Chen",
    priority: "High",
    status: "In Progress",
    basePay: 250,
    notes: "Tenant reports water pooling under the sink. Has been ongoing for 3 days.",
    etaDate: "Jun 27, 2026",
    isSpecialized: false,
  },
  {
    id: "SR-1297",
    date: "Jun 24, 2026",
    property: "Oak Heights",
    address: "412 Oak Street, Apt 12, Chicago, IL",
    issue: "Electrical outlet not working in kitchen",
    type: "Electrical",
    contractor: "Unassigned",
    priority: "Critical",
    status: "Pending",
    basePay: 180,
    notes: "Main breaker keeps tripping when microwave and toaster are used.",
    etaDate: "Jun 25, 2026",
    isSpecialized: false,
  },
  {
    id: "SR-1296",
    date: "Jun 23, 2026",
    property: "Sunrise Towers",
    address: "88 Ocean Drive, Suite 301, San Francisco, CA",
    issue: "Air conditioning not cooling properly",
    type: "HVAC",
    contractor: "Lisa Park",
    priority: "Medium",
    status: "In Progress",
    basePay: 320,
    notes: "AC compressor makes rattling noise during peak heat hours.",
    etaDate: "Jun 26, 2026",
    isSpecialized: false,
  },
  {
    id: "SR-1295",
    date: "Jun 23, 2026",
    property: "Greenview Apts",
    address: "105 Greenview Rd, Building B, Denver, CO",
    issue: "Deep cleaning required for move-in pr",
    type: "Cleaning",
    contractor: "Alex Kumar",
    priority: "Low",
    status: "Assigned",
    basePay: 350,
    notes: "Tenant move-in scheduled for next Monday. Requires full sanitization.",
    etaDate: "Jun 28, 2026",
    isSpecialized: false,
  },
  {
    id: "SR-1294",
    date: "Jun 22, 2026",
    property: "Harbor Point",
    address: "55 Harbor Way, Unit 10, Seattle, WA",
    issue: "Interior repainting of living room and h",
    type: "Painting",
    contractor: "Tom Wilson",
    priority: "Medium",
    status: "In Progress",
    basePay: 1200,
    rateBonus: "+$75",
    finalPayCalculated: 1275,
    notes: "Wall patching and dual-coat eggshell white paint.",
    etaDate: "Jun 29, 2026",
    isSpecialized: true,
  },
  {
    id: "SR-1293",
    date: "Jun 20, 2026",
    property: "Skyline Apts",
    address: "300 Skyline Blvd, Suite 400, Austin, TX",
    issue: "Water heater replacement needed",
    type: "Plumbing",
    contractor: "Mike Chen",
    priority: "High",
    status: "Completed",
    basePay: 890,
    rateBonus: "+15%",
    finalPayCalculated: 1023.5,
    notes: "Old 50-gallon tank replaced with new energy efficient unit.",
    etaDate: "Jun 21, 2026",
    isSpecialized: true,
  },
  {
    id: "SR-1292",
    date: "Jun 19, 2026",
    property: "Cedar Ridge",
    address: "742 Cedar Ave, Unit 5, Phoenix, AZ",
    issue: "Installing new ceiling fan in bedroom",
    type: "Electrical",
    contractor: "Nina Patel",
    priority: "Low",
    status: "Completed",
    basePay: 280,
    notes: "Fan fixture mounted and remote control configured.",
    etaDate: "Jun 20, 2026",
    isSpecialized: false,
  },
  {
    id: "SR-1291",
    date: "Jun 18, 2026",
    property: "Westpark Office",
    address: "1200 Westpark Dr, Floor 2, Miami, FL",
    issue: "Annual AC maintenance inspection",
    type: "HVAC",
    contractor: "Carlos Rivera",
    priority: "Low",
    status: "Cancelled",
    basePay: 420,
    notes: "Inspection rescheduled by building property manager.",
    etaDate: "Jun 18, 2026",
    isSpecialized: false,
  },
];
