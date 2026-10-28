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
import { Plan } from './types';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onSave: (updatedData: any) => void;
  isLoading?: boolean;
}

export default function EditModal({ isOpen, onClose, plan, onSave, isLoading = false }: EditModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    planType: 'prime' as 'prime' | 'pro' | 'enterprise',
    unitPrice: '',
    minimumPrice: '',
    maxUnits: '',
    duration: '1 month' as '1 month' | '3 months' | '6 months' | '1 year',
    paymentType: 'Monthly' as 'Monthly' | 'Yearly',
    features: [] as string[],
    currentFeature: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (plan) {
      const uPrice =
        plan.unitPrice !== undefined && plan.unitPrice !== null
          ? plan.unitPrice.toString()
          : plan.price !== undefined
          ? plan.price.toString()
          : '';

      const minPrice =
        plan.minimumPrice !== undefined && plan.minimumPrice !== null
          ? plan.minimumPrice.toString()
          : '';

      const mUnits = plan.maxUnits !== undefined && plan.maxUnits !== null ? plan.maxUnits.toString() : '';

      const feats = plan.features || plan.benefits || [];

      setFormData({
        title: plan.title || '',
        description: plan.description || plan.tagline || '',
        planType: (plan.planType as any) || (plan.title.toLowerCase().includes('pro') ? 'pro' : plan.title.toLowerCase().includes('enterprise') ? 'enterprise' : 'prime'),
        unitPrice: uPrice,
        minimumPrice: minPrice,
        maxUnits: mUnits,
        duration: (plan.duration as any) || '1 month',
        paymentType: (plan.paymentType as any) || 'Monthly',
        features: Array.isArray(feats) ? [...feats] : [],
        currentFeature: '',
      });
      setErrors({});
    }
  }, [plan]);

  if (!isOpen || !plan) return null;

  const addFeature = () => {
    if (formData.currentFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, prev.currentFeature.trim()],
        currentFeature: '',
      }));
      setErrors((prev) => ({ ...prev, features: '' }));
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Plan title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    const numUnitPrice = parseFloat(formData.unitPrice);
    if (isNaN(numUnitPrice) || numUnitPrice < 0) {
      newErrors.unitPrice = 'Valid unit price is required';
    }
    const numMinPrice = parseFloat(formData.minimumPrice);
    if (isNaN(numMinPrice) || numMinPrice < 0) {
      newErrors.minimumPrice = 'Valid minimum price is required';
    }
    if (formData.features.length === 0) {
      newErrors.features = 'Please add at least one feature';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      _id: plan._id,
      title: formData.title.trim(),
      description: formData.description.trim(),
      planType: formData.planType,
      unitPrice: numUnitPrice,
      minimumPrice: numMinPrice,
      price: numMinPrice,
      duration: formData.duration,
      paymentType: formData.paymentType,
      maxUnits: formData.maxUnits ? parseInt(formData.maxUnits) : null,
      features: formData.features,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-200 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 ease-out custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Subscription Plan</h2>
            <p className="text-xs text-gray-500 font-normal mt-0.5">
              Update pricing parameters and features for &quot;{plan.title}&quot;
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

        <form onSubmit={handleSave} className="space-y-4">
          {/* Plan Type Selector */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Plan Type
            </label>
            <Select
              value={formData.planType}
              onValueChange={(val) =>
                setFormData((p) => ({ ...p, planType: val as 'prime' | 'pro' | 'enterprise' }))
              }
            >
              <SelectTrigger className="w-full h-[44px] px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] transition-all cursor-pointer">
                <SelectValue placeholder="Select Plan Type" />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-lg border border-gray-200 shadow-lg z-[60]">
                <SelectItem value="prime">Prime</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Plan Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setFormData((p) => ({ ...p, title: e.target.value }));
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
              Description *
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => {
                setFormData((p) => ({ ...p, description: e.target.value }));
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

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Unit Price ($/unit) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, unitPrice: e.target.value }));
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
                value={formData.minimumPrice}
                onChange={(e) => {
                  setFormData((p) => ({ ...p, minimumPrice: e.target.value }));
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
                placeholder="e.g. 1000 (blank for unlimited)"
                value={formData.maxUnits}
                onChange={(e) => setFormData((p) => ({ ...p, maxUnits: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#8E25E3]/30 focus:border-[#8E25E3] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
                Billing Cycle *
              </label>
              <Select
                value={formData.duration}
                onValueChange={(val) =>
                  setFormData((p) => ({
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

          {/* Features */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">
              Plan Features *
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a feature..."
                value={formData.currentFeature}
                onChange={(e) => setFormData((p) => ({ ...p, currentFeature: e.target.value }))}
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

            {formData.features.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-gray-50 border border-gray-200 rounded-lg custom-scrollbar">
                {formData.features.map((feature, idx) => (
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
              <span>{isLoading ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}