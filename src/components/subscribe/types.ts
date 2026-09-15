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
  planPrices: PlanPrice[];
  benefits: string[];
  participantCount: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageBody {
  title: 'prime' | 'pro' | 'enterprise' | 'free' | 'basic' | 'premium';
  type: 'month' | 'year' | 'free';
  planType: 'free' | 'paid';
  price: number;
  pricePerUnit?: string;
  unitRange?: string;
  minimumText?: string;
  targetAudience?: string;
  tagline?: string;
  footerTagline?: string;
  productId: string;
  platform: 'apple' | 'google';
  benefits: string[];
  participantCount: number;
}

export const initialPlans: Plan[] = [];