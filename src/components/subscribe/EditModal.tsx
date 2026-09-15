'use client';

import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Plan, PlanPrice } from './types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onSave: (plan: Plan) => void;
  isLoading?: boolean;
}

export default function EditModal({ isOpen, onClose, plan, onSave, isLoading = false }: EditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    unitRange: '',
    minimumText: '',
    targetAudience: '',
    footerTagline: '',
    participantCount: '',
    benefits: [] as string[],
    currentBenefit: '',
    planPrices: [] as PlanPrice[],
    currentPriceType: 'month' as 'free' | 'month' | 'year',
    currentPrice: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (plan) {
      const monthPriceObj = plan.planPrices.find(p => p.type === 'month') || plan.planPrices[0];
      setFormData({
        title: plan.title || '',
        tagline: plan.tagline || '',
        unitRange: plan.unitRange || '',
        minimumText: plan.minimumText || '',
        targetAudience: plan.targetAudience || '',
        footerTagline: plan.footerTagline || '',
        participantCount: (plan.participantCount || 1000).toString(),
        benefits: plan.benefits || [],
        currentBenefit: '',
        planPrices: plan.planPrices || [],
        currentPriceType: 'month',
        currentPrice: monthPriceObj ? monthPriceObj.price.toString() : '',
      });
      setErrors({});
    }
  }, [plan]);

  if (!isOpen || !plan) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Plan title is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update monthly price if set in inputs
    const updatedPrices = [...formData.planPrices];
    if (formData.currentPrice && parseFloat(formData.currentPrice) >= 0) {
      const monthIndex = updatedPrices.findIndex(p => p.type === 'month');
      if (monthIndex >= 0) {
        updatedPrices[monthIndex] = {
          ...updatedPrices[monthIndex],
          price: parseFloat(formData.currentPrice),
        };
      } else {
        updatedPrices.push({
          type: 'month',
          price: parseFloat(formData.currentPrice),
        });
      }
    }

    onSave({
      ...plan,
      title: formData.title.trim(),
      tagline: formData.tagline.trim(),
      unitRange: formData.unitRange.trim(),
      minimumText: formData.minimumText.trim(),
      targetAudience: formData.targetAudience.trim(),
      footerTagline: formData.footerTagline.trim(),
      participantCount: parseInt(formData.participantCount) || 1000,
      benefits: formData.benefits,
      planPrices: updatedPrices,
    });
  };

  const addBenefit = () => {
    if (formData.currentBenefit.trim()) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, prev.currentBenefit.trim()],
        currentBenefit: '',
      }));
    }
  };

  const removeBenefit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 ease-out">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5 border-b border-gray-200 pb-3.5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Plan Tier</h2>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Update details, pricing, and features for {plan.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer p-1.5 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-left">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Plan Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. PRIME, PRO, ENTERPRISE"
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] outline-none transition-all"
            />
            {errors.title && <p className="text-red-500 text-[11px] mt-1 font-semibold">{errors.title}</p>}
          </div>

          {/* Subtitle / Tagline */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Tagline / Subtitle
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData((p) => ({ ...p, tagline: e.target.value }))}
              placeholder="e.g. For property professionals ready to streamline operations"
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] outline-none transition-all"
            />
          </div>

          {/* Price per unit & Unit range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Price per unit ($/mo)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.currentPrice}
                onChange={(e) => setFormData((p) => ({ ...p, currentPrice: e.target.value }))}
                placeholder="2.00"
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Unit Bounds / Range
              </label>
              <input
                type="text"
                value={formData.unitRange}
                onChange={(e) => setFormData((p) => ({ ...p, unitRange: e.target.value }))}
                placeholder="1,000 - 15,000 Units"
                className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] outline-none transition-all"
              />
            </div>
          </div>

          {/* Minimums Text */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Minimum Requirement Text
            </label>
            <input
              type="text"
              value={formData.minimumText}
              onChange={(e) => setFormData((p) => ({ ...p, minimumText: e.target.value }))}
              placeholder="$ 2,000 monthly min. | 1,000 - door minimum"
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] outline-none transition-all"
            />
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Target Audience Description
            </label>
            <textarea
              rows={2}
              value={formData.targetAudience}
              onChange={(e) => setFormData((p) => ({ ...p, targetAudience: e.target.value }))}
              placeholder="Best for owners and portfolio leaders who want complete visibility..."
              className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] outline-none transition-all resize-none"
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Checklist Features & Benefits
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a plan benefit..."
                value={formData.currentBenefit}
                onChange={(e) => setFormData((p) => ({ ...p, currentBenefit: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
                className="flex-1 px-3.5 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] outline-none transition-all"
              />
              <button
                type="button"
                onClick={addBenefit}
                className="px-3 py-2 bg-[#8E25E3] hover:bg-[#781dc6] text-white font-semibold rounded-lg transition-colors flex items-center justify-center cursor-pointer text-xs"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-between px-3 py-1.5 bg-purple-50/70 border border-purple-100 rounded-lg">
                  <span className="text-xs font-medium text-gray-800">{benefit}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="p-1 text-red-500 hover:text-red-700 rounded-md cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 bg-[#8E25E3] hover:bg-[#781dc6] text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isLoading ? 'Saving...' : 'Save Plan Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}