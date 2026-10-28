'use client';

import React, { useEffect, useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreatePlanPayload } from './types';

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (plan: CreatePlanPayload) => void;
  isLoading?: boolean;
}

const initialForm = {
  title: 'PRIME',
  planType: 'prime' as 'prime' | 'pro' | 'enterprise',
  description: '',
  unitPrice: '1.00',
  minimumPrice: '500',
  maxUnits: '1000',
  duration: '1 month' as '1 month' | '3 months' | '6 months' | '1 year',
  paymentType: 'Monthly' as 'Monthly' | 'Yearly',
  features: [] as string[],
  currentFeature: '',
};

export default function AddModal({ isOpen, onClose, onAdd, isLoading = false }: AddModalProps) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePlanTypeChange = (planType: 'prime' | 'pro' | 'enterprise') => {
    let defaultTitle = 'PRIME';
    let defaultDesc = 'For property managers starting out with core operational tools';
    let defaultUnit = '1.00';
    let defaultMin = '500';
    let defaultMax = '1000';

    if (planType === 'pro') {
      defaultTitle = 'ProjexPro Pro';
      defaultDesc = 'For property professionals ready to streamline operations';
      defaultUnit = '2.00';
      defaultMin = '2000';
      defaultMax = '15000';
    } else if (planType === 'enterprise') {
      defaultTitle = 'ENTERPRISE';
      defaultDesc = 'For enterprise portfolio leaders needing custom scale & SLA support';
      defaultUnit = '3.50';
      defaultMin = '3500';
      defaultMax = '50000';
    }

    setForm((prev) => ({
      ...prev,
      planType,
      title: defaultTitle,
      description: defaultDesc,
      unitPrice: defaultUnit,
      minimumPrice: defaultMin,
      maxUnits: defaultMax,
    }));
  };

  const addFeature = () => {
    if (form.currentFeature.trim()) {
      setForm((prev) => ({
        ...prev,
        features: [...prev.features, prev.currentFeature.trim()],
        currentFeature: '',
      }));
      setErrors((prev) => ({ ...prev, features: '' }));
    }
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }
    const numUnitPrice = parseFloat(form.unitPrice);
    if (isNaN(numUnitPrice) || numUnitPrice < 0) {
      newErrors.unitPrice = 'Valid unit price is required';
    }
    const numMinPrice = parseFloat(form.minimumPrice);
    if (isNaN(numMinPrice) || numMinPrice < 0) {
      newErrors.minimumPrice = 'Valid minimum price is required';
    }
    if (form.features.length === 0) {
      newErrors.features = 'Please add at least one feature';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAdd({
      title: form.title.trim(),
      description: form.description.trim(),
      planType: form.planType,
      unitPrice: numUnitPrice,
      minimumPrice: numMinPrice,
      price: numMinPrice,
      duration: form.duration,
      paymentType: form.paymentType,
      maxUnits: form.maxUnits ? parseInt(form.maxUnits) : null,
      features: form.features,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-200 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 ease-out custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create a New Subscription Plan</h2>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Set up a dynamic pricing tier backed by live Stripe catalog
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Type Selector */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Plan Type *
            </label>
            <Select
              value={form.planType}
              onValueChange={(val) => handlePlanTypeChange(val as 'prime' | 'pro' | 'enterprise')}
            >
              <SelectTrigger className="w-full h-[44px] px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] transition-all cursor-pointer">
                <SelectValue placeholder="Select Plan Type" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-lg border border-gray-200 shadow-lg z-[60]">
                <SelectItem value="prime">Prime (Entry Tier)</SelectItem>
                <SelectItem value="pro">Pro (Most Popular)</SelectItem>
                <SelectItem value="enterprise">Enterprise (Institutional)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Plan Display Title *
            </label>
            <input
              type="text"
              placeholder="e.g. PRIME or ProjexPro Pro"
              value={form.title}
              onChange={(e) => {
                setForm((p) => ({ ...p, title: e.target.value }));
                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, title: '' }));
              }}
              className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] focus:outline-none transition-all ${
                errors.title ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 font-semibold">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Plan Description *
            </label>
            <textarea
              rows={2}
              placeholder="Short description of this tier..."
              value={form.description}
              onChange={(e) => {
                setForm((p) => ({ ...p, description: e.target.value }));
                if (e.target.value.trim()) setErrors((prev) => ({ ...prev, description: '' }));
              }}
              className={`w-full px-4 py-2 bg-white border rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] focus:outline-none transition-all ${
                errors.description ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1 font-semibold">{errors.description}</p>
            )}
          </div>

          {/* Pricing Grid: Unit Price & Minimum Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Unit Price ($/unit) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 1.00"
                value={form.unitPrice}
                onChange={(e) => {
                  setForm((p) => ({ ...p, unitPrice: e.target.value }));
                  if (e.target.value) setErrors((prev) => ({ ...prev, unitPrice: '' }));
                }}
                className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] focus:outline-none transition-all ${
                  errors.unitPrice ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                }`}
              />
              {errors.unitPrice && (
                <p className="text-red-500 text-xs mt-1 font-semibold">{errors.unitPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Minimum Monthly Charge ($) *
              </label>
              <input
                type="number"
                step="1"
                min="0"
                placeholder="e.g. 500"
                value={form.minimumPrice}
                onChange={(e) => {
                  setForm((p) => ({ ...p, minimumPrice: e.target.value }));
                  if (e.target.value) setErrors((prev) => ({ ...prev, minimumPrice: '' }));
                }}
                className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] focus:outline-none transition-all ${
                  errors.minimumPrice ? 'border-red-500 bg-red-50/20' : 'border-gray-300'
                }`}
              />
              {errors.minimumPrice && (
                <p className="text-red-500 text-xs mt-1 font-semibold">{errors.minimumPrice}</p>
              )}
            </div>
          </div>

          {/* Unit Limit & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Maximum Unit Threshold
              </label>
              <input
                type="number"
                placeholder="e.g. 1000 (or leave blank for unlimited)"
                value={form.maxUnits}
                onChange={(e) => setForm((p) => ({ ...p, maxUnits: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Billing Cycle & Duration *
              </label>
              <Select
                value={form.duration}
                onValueChange={(val) =>
                  setForm((p) => ({
                    ...p,
                    duration: val as any,
                    paymentType: val === '1 year' ? 'Yearly' : 'Monthly',
                  }))
                }
              >
                <SelectTrigger className="w-full h-[44px] px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] transition-all cursor-pointer">
                  <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-lg border border-gray-200 shadow-lg z-[60]">
                  <SelectItem value="1 month">1 Month (Monthly)</SelectItem>
                  <SelectItem value="3 months">3 Months</SelectItem>
                  <SelectItem value="6 months">6 Months</SelectItem>
                  <SelectItem value="1 year">1 Year (Yearly)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Features / Benefits */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Plan Features *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Work Order & Ticket Management..."
                value={form.currentFeature}
                onChange={(e) => setForm((p) => ({ ...p, currentFeature: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2.5 bg-[#8E25E3] hover:bg-[#781dc6] text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
            {errors.features && (
              <p className="text-red-500 text-xs mb-2 font-semibold">{errors.features}</p>
            )}

            {form.features.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-lg custom-scrollbar">
                {form.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 bg-white rounded-md border border-gray-200 text-xs font-medium text-gray-800"
                  >
                    <span>{feature}</span>
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="text-gray-400 hover:text-red-600 p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-[#8E25E3] hover:bg-[#781dc6] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors flex items-center gap-2 disabled:opacity-60"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? 'Creating Plan...' : 'Create Plan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
