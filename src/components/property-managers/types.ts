export type PlanType = "Enterprise" | "Professional" | "Starter" | "PRIME" | "PRO" | "Free" | string;
export type PartnerStatus = "Active" | "Pending" | "Suspended" | "Rejected" | string;
export type PaymentType = "Invoice" | "Due upon Receipt" | "Milestone Payment" | "Stripe Card" | "Direct Card" | string;

export type PropertyPartner = {
  id: string;
  rawId: string;
  propertyName: string;
  location: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  noOfUnits: number;
  noOfProperties?: number;
  plan: PlanType;
  status: PartnerStatus;
  paymentType: PaymentType;
  rawUser?: any;
};

export type StatItem = {
  id: string;
  title: string;
  subTitle?: string;
  value: string;
  textColor: string;
};
