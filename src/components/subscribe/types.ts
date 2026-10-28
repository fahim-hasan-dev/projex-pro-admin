export interface PlanPrice {
  type: string;
  price: number;
  priceId?: string;
  productId?: string;
  _id?: string;
}

export interface Plan {
  _id: string;
  title: string;
  description?: string;
  planType?: 'prime' | 'pro' | 'enterprise' | string;
  unitPrice?: number;
  minimumPrice?: number;
  price?: number;
  duration?: '1 month' | '3 months' | '6 months' | '1 year' | string;
  paymentType?: 'Monthly' | 'Yearly' | string;
  maxUnits?: number | null;
  features?: string[];
  productId?: string;
  priceId?: string;
  status?: 'Active' | 'Delete' | string;
  tagline?: string;
  pricePerUnit?: string;
  unitRange?: string;
  minimumText?: string;
  targetAudience?: string;
  footerTagline?: string;
  isPopular?: boolean;
  badgeText?: string;
  ctaText?: string;
  bgGradient?: string;
  planPrices?: PlanPrice[];
  benefits?: string[];
  participantCount?: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePlanPayload {
  title: string;
  description: string;
  planType: 'prime' | 'pro' | 'enterprise';
  unitPrice: number;
  minimumPrice: number;
  price?: number;
  duration: '1 month' | '3 months' | '6 months' | '1 year';
  paymentType: 'Monthly' | 'Yearly';
  maxUnits?: number | null;
  features: string[];
}

export interface PackageBody {
  title: string;
  type: 'month' | 'year' | 'free';
  planType: 'prime' | 'pro' | 'enterprise' | 'free' | 'paid';
  price: number;
  unitPrice?: number;
  minimumPrice?: number;
  duration?: '1 month' | '3 months' | '6 months' | '1 year';
  paymentType?: 'Monthly' | 'Yearly';
  maxUnits?: number;
  description?: string;
  pricePerUnit?: string;
  unitRange?: string;
  minimumText?: string;
  targetAudience?: string;
  tagline?: string;
  footerTagline?: string;
  productId?: string;
  platform?: 'apple' | 'google';
  benefits: string[];
  features?: string[];
  participantCount?: number;
}