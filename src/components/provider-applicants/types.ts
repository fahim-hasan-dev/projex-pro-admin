export type ApplicantStatus = "Pending" | "Under Review" | "Approved" | "Rejected";
export type FilterTab = "All" | "Pending" | "Approved" | "Action Required" | "Rejected";

export type ProviderDocumentItem = {
  title: string;
  url: string;
};

export type ProviderApplicantItem = {
  id: string;
  avatarChar: string;
  avatarBg: string;
  avatarColor: string;
  image: string
  name: string;
  companyName: string;
  trade: string;
  skills: string[];
  experienceYears: number;
  email: string;
  phone: string;
  appliedDate: string;
  status: ApplicantStatus;
  rawStatus: string;
  aboutText: string;
  taxId: string;
  rejectionReason?: string;
  personalAddress: string;
  officeAddress: string;
  documents: ProviderDocumentItem[];
};
