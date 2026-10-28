'use client';

import React from 'react';
import { Check, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { Plan } from './types';

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (plan: Plan) => void;
}

export default function PlanCard({ plan, onEdit, onDelete }: PlanCardProps) {
  const planType = (plan.planType || '').toLowerCase();
  const titleLower = (plan.title || '').toLowerCase();

  const isPro = planType === 'pro' || titleLower.includes('pro');
  const isPrime = planType === 'prime' || titleLower.includes('prime');
  const isEnterprise = planType === 'enterprise' || titleLower.includes('enterprise');

  // Price formatting
  const unitPrice =
    plan.unitPrice !== undefined && plan.unitPrice !== null
      ? plan.unitPrice
      : plan.price !== undefined && plan.price !== null
      ? plan.price
      : 0;

  const formattedUnitPrice = unitPrice === 0 ? '0.00' : Number(unitPrice).toFixed(2);

  // Defaults based on plan type if not provided
  const defaultTagline = isPro
    ? 'For property professionals ready to streamline operations'
    : isPrime
    ? 'For property managers starting out with core operational tools'
    : 'For enterprise portfolio leaders needing custom scale & SLA support';

  const defaultUnitRange = plan.maxUnits
    ? `Up to ${plan.maxUnits.toLocaleString()} Units`
    : isPro
    ? '1,000 - 15,000 Units'
    : isPrime
    ? 'Up to 1,000 Units'
    : '15,000+ Units';

  const defaultMinimumText = plan.minimumPrice
    ? `$ ${plan.minimumPrice.toLocaleString()} ${plan.paymentType === 'Yearly' ? 'yearly' : 'monthly'} min.`
    : isPro
    ? '$ 2,000 monthly min. | 1,000 - door minimum'
    : isPrime
    ? '$ 500 monthly min. | 250 - door minimum'
    : 'Custom monthly min. | Enterprise SLA';

  const defaultTargetAudience = isPro
    ? 'Best for owners and portfolio leaders who want complete visibility and accountability.'
    : isPrime
    ? 'Best for independent operators needing essential tracking & work orders.'
    : 'Best for large institutional portfolio leaders requiring dedicated infrastructure & API access.';

  const defaultFooterTagline = isPro
    ? 'Track Every Project . Verify Every Outcome'
    : isPrime
    ? 'Streamline Operations . Build Efficiency'
    : 'Empower Scale . Enterprise Security';

  const defaultCtaText = isPro
    ? 'Edit Pro Tier'
    : isPrime
    ? 'Edit Prime Tier'
    : isEnterprise
    ? 'Edit Enterprise Tier'
    : 'Edit Tier';

  const tagline = plan.description || plan.tagline || defaultTagline;
  const unitRange = plan.unitRange || defaultUnitRange;
  const minimumText = plan.minimumText || defaultMinimumText;
  const targetAudience = plan.targetAudience || defaultTargetAudience;
  const footerTagline = plan.footerTagline || defaultFooterTagline;
  const ctaText = plan.ctaText || defaultCtaText;
  const pricePerUnit = plan.pricePerUnit || (plan.paymentType === 'Yearly' ? 'per unit / year' : 'per unit / month');
  const featuresList = plan.features || plan.benefits || [];

  if (isPro) {
    // Featured Pro Card (Established Purple Gradient Theme)
    return (
      <div className="bg-gradient-to-b from-[#8E25E3] via-[#7b1fa2] to-[#5b1b95] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between relative border border-purple-400/40 h-full hover:shadow-lg transition-all">
        {/* Card Header & Admin Actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white font-bold text-[10px] tracking-wider uppercase border border-white/30">
              ✨ {plan.badgeText || 'MOST POPULAR'}
            </span>

            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => onEdit(plan)}
                title="Edit Plan"
                className="p-1 text-white/80 hover:text-white rounded transition-colors cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(plan)}
                title="Delete Plan"
                className="p-1 text-red-200 hover:text-red-100 rounded transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title & Tagline */}
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-medium italic tracking-tight text-white uppercase">
              {plan.title}
            </h3>
            <p className="text-xs text-purple-100 font-normal italic max-w-xs mx-auto">
              {tagline}
            </p>

            {/* Price */}
            <div className="pt-3 pb-1">
              <span className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
                ${formattedUnitPrice}
              </span>
              <p className="text-xs text-purple-200 font-medium mt-0.5">
                {pricePerUnit}
              </p>
            </div>

            {/* Unit Range & Minimums */}
            <div className="pt-1">
              <span className="inline-block px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-xs text-white font-semibold text-xs border border-white/20">
                {unitRange}
              </span>
            </div>
            <p className="text-[11px] text-purple-200/90 font-normal pt-1">
              {minimumText}
            </p>

            {/* Target Audience */}
            <p className="text-xs text-white/90 font-normal italic py-2.5 my-2 border-y border-white/20">
              {targetAudience}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-2 my-4">
            {featuresList.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-2 text-left">
                <Check className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                <span className="text-xs text-white font-normal leading-snug">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer & CTA */}
        <div className="pt-3 border-t border-white/20 text-center space-y-3">
          <p className="text-[11px] text-purple-100/90 italic font-medium">
            {footerTagline}
          </p>
          <button
            type="button"
            onClick={() => onEdit(plan)}
            className="w-full py-2.5 px-4 bg-white hover:bg-purple-50 text-[#8E25E3] font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // Standard Plan Card (PRIME, ENTERPRISE, custom)
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between h-full hover:border-purple-300 transition-all text-gray-900">
      {/* Card Header & Admin Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#8E25E3] font-semibold text-[11px] border border-purple-200">
            {plan.title} TIER
          </span>

          <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => onEdit(plan)}
              title="Edit Plan"
              className="p-1 text-gray-500 hover:text-gray-800 rounded transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(plan)}
              title="Delete Plan"
              className="p-1 text-red-500 hover:text-red-700 rounded transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="text-center space-y-1">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">
            {plan.title}
          </h3>
          <p className="text-xs text-gray-500 font-normal italic max-w-xs mx-auto">
            {tagline}
          </p>

          {/* Price */}
          <div className="pt-3 pb-1">
            <span className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              ${formattedUnitPrice}
            </span>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {pricePerUnit}
            </p>
          </div>

          {/* Unit Range & Minimums */}
          <div className="pt-1">
            <span className="inline-block px-3 py-0.5 rounded-full bg-purple-50 text-[#8E25E3] font-semibold text-xs border border-purple-200">
              {unitRange}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 font-normal pt-1">
            {minimumText}
          </p>

          {/* Target Audience */}
          <p className="text-xs text-gray-600 font-normal italic py-2.5 my-2 border-y border-gray-100">
            {targetAudience}
          </p>
        </div>

        {/* Features */}
        <div className="space-y-2 my-4">
          {featuresList.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-left">
              <Check className="w-3.5 h-3.5 text-[#8E25E3] shrink-0 mt-0.5" />
              <span className="text-xs text-gray-700 font-medium leading-snug">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer & CTA */}
      <div className="pt-3 border-t border-gray-100 text-center space-y-3">
        <p className="text-[11px] text-gray-500 italic font-medium">
          {footerTagline}
        </p>
        <button
          type="button"
          onClick={() => onEdit(plan)}
          className="w-full py-2.5 px-4 bg-[#8E25E3] hover:bg-[#781dc6] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{ctaText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
