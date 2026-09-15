"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, MapPin, Calendar as CalendarIcon, Key, Sliders, AlertTriangle, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ServiceRequestItem, JobStatus, ServiceCategory } from "@/types/serviceRequestStore";

interface JobRateModalProps {
  job: ServiceRequestItem | null;
  onClose: () => void;
  onSave: (updatedFields: {
    serviceCategory: ServiceCategory;
    issueTitle: string;
    serviceDate: string;
    basePay: number;
    additionalFee: number;
    contractor: string;
  }) => void;
  assignedContractor: string;
  setAssignedContractor: (contractor: string) => void;
  isSpecializedRateActive?: boolean;
  setIsSpecializedRateActive?: (active: boolean) => void;
  paymentType?: "Percentage" | "Flat Amount";
  setPaymentType?: (type: "Percentage" | "Flat Amount") => void;
  rateValue?: string;
  setRateValue?: (val: string) => void;
  selectedReason?: string;
  setSelectedReason?: (reason: string) => void;
}

export default function JobRateModal({
  job,
  onClose,
  onSave,
  assignedContractor,
  setAssignedContractor,
}: JobRateModalProps) {
  const [serviceCategory, setServiceCategory] = useState<ServiceCategory>("Plumbing");
  const [issueTitle, setIssueTitle] = useState<string>("");
  const [currentEta, setCurrentEta] = useState<string>("Jun 27, 2026");
  const [basePayInput, setBasePayInput] = useState<number>(250);
  const [additionalFeeInput, setAdditionalFeeInput] = useState<number>(0);

  useEffect(() => {
    if (job) {
      setServiceCategory(job.type || "Plumbing");
      setIssueTitle(job.issue || "");
      setCurrentEta(job.etaDate || "Jun 27, 2026");
      setBasePayInput(job.basePay || 250);
      setAdditionalFeeInput(job.additionalFee || 0);
      setAssignedContractor(job.contractor || "Unassigned");
    }
  }, [job]);

  const parsedEtaDate = useMemo(() => {
    if (!currentEta) return new Date();
    const d = new Date(currentEta);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [currentEta]);

  if (!job) return null;

  const totalPayout = basePayInput + additionalFeeInput;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      serviceCategory,
      issueTitle,
      serviceDate: currentEta,
      basePay: basePayInput,
      additionalFee: additionalFeeInput,
      contractor: assignedContractor,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-200/80 animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200/80">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Review Job #{job.id}</h2>

            <span className="px-2.5 py-0.5 bg-blue-100/90 text-[#2563EB] rounded-full text-xs font-semibold flex items-center gap-1">
              <Key className="w-3 h-3 text-[#2563EB]" />
              {job.status}
            </span>

            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${job.priority === "Critical"
                  ? "bg-red-100 text-red-600"
                  : job.priority === "High"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-600"
                }`}
            >
              {job.priority} Priority
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 border border-gray-200/80 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 custom-scrollbar">

          {/* Left Column: REQUEST REVIEW & EDIT */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">PROPERTY & REQUEST REVIEW</h3>

            {/* Reassignment Record if declined */}
            {job.declineReason && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs text-red-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-red-900">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Decline Reason from Previous Service Provider:</span>
                </div>
                <p className="font-normal leading-relaxed">{job.declineReason}</p>
              </div>
            )}

            {/* Property */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">PROPERTY & MANAGER</p>
              <h4 className="text-sm font-bold text-gray-900 mt-0.5">{job.property} ({job.unit || "N/A"})</h4>
              <p className="text-xs text-gray-500 font-normal mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{job.address}</span>
              </p>
              <p className="text-xs text-purple-700 font-semibold mt-1">Property Manager: {job.propertyManager}</p>
            </div>

            {/* Service Category & Issue Title */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                  SERVICE CATEGORY
                </label>
                <Select
                  value={serviceCategory}
                  onValueChange={(val) => setServiceCategory(val as ServiceCategory)}
                >
                  <SelectTrigger className="w-full bg-gray-100/70 border border-gray-200 rounded-lg h-9 py-5 px-3 text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#8E25E3]/40 cursor-pointer shadow-none">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg text-xs font-medium text-gray-800">
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="HVAC">HVAC</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Painting">Painting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                  SERVICE / ISSUE TITLE
                </label>
                <input
                  type="text"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  placeholder="Service Issue Title..."
                  className="w-full bg-gray-100/70 border border-gray-200 rounded-lg px-3 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8E25E3]/40"
                />
              </div>
            </div>

            {/* Service Date (ETA) Picker */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                SET SERVICE DATE
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full bg-gray-100/70 border border-gray-200 rounded-lg h-9 py-5 px-3 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E25E3]/40 flex items-center justify-between cursor-pointer hover:bg-gray-200/60 transition-colors"
                  >
                    <span>{currentEta || "Select Date"}</span>
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white border border-gray-200 shadow-xl rounded-2xl"
                  align="start"
                >
                  <CalendarUI
                    mode="single"
                    selected={parsedEtaDate}
                    onSelect={(date) => {
                      if (date) {
                        setCurrentEta(format(date, "MMM d, yyyy"));
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Right Column: PRICING & SERVICE PROVIDER ASSIGNMENT */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">PRICING & PROVIDER ASSIGNMENT</h3>

            {/* Assign Service Provider */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                SELECT SERVICE PROVIDER *
              </label>
              <Select
                value={assignedContractor}
                onValueChange={setAssignedContractor}
              >
                <SelectTrigger className="w-full bg-purple-50/60 border border-purple-300 py-5 rounded-lg h-9 px-3.5 text-xs font-bold text-purple-900 focus:ring-2 focus:ring-[#8E25E3]/40 cursor-pointer shadow-none">
                  <SelectValue placeholder="Select contractor" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg text-xs font-medium text-gray-800">
                  <SelectItem value="Unassigned">Unassigned (Leave in Queue)</SelectItem>
                  <SelectItem value="Mike Chen (John Smith Plumbing)">Mike Chen (John Smith Plumbing)</SelectItem>
                  <SelectItem value="Lisa Park (Apex Painters)">Lisa Park (Apex Painters)</SelectItem>
                  <SelectItem value="CoolAir Services (Lisa Park)">CoolAir Services (HVAC)</SelectItem>
                  <SelectItem value="Alex Kumar (CleanPro)">Alex Kumar (CleanPro)</SelectItem>
                  <SelectItem value="PowerTech Electric (Nina Patel)">PowerTech Electric (Nina Patel)</SelectItem>
                  <SelectItem value="Tom Wilson (Wilson Painting)">Tom Wilson (Wilson Painting)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Base Service Price */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                SERVICE PRICE (BASE PAY $)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">$</span>
                <input
                  type="number"
                  min={0}
                  value={basePayInput}
                  onChange={(e) => setBasePayInput(Number(e.target.value))}
                  className="w-full bg-gray-100/70 border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8E25E3]/40"
                />
              </div>
            </div>

            {/* Custom / Additional Fee */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                ADDITIONAL / CUSTOM FEE ($)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-600">$</span>
                <input
                  type="number"
                  min={0}
                  value={additionalFeeInput}
                  onChange={(e) => setAdditionalFeeInput(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-gray-100/70 border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#8E25E3]/40"
                />
              </div>
            </div>

            {/* Payout Summary */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 space-y-2 text-xs">
              <h5 className="text-[10px] font-bold text-[#6B1294] tracking-wider uppercase">PAYOUT SUMMARY FOR PROVIDER</h5>

              <div className="flex items-center justify-between text-gray-700 font-medium">
                <span>Main Base Price</span>
                <span className="font-bold text-gray-900">${basePayInput.toLocaleString()}</span>
              </div>

              {additionalFeeInput > 0 && (
                <div className="flex items-center justify-between text-[#8E25E3] font-medium">
                  <span>Additional Custom Fee</span>
                  <span className="font-bold">+${additionalFeeInput.toLocaleString()}</span>
                </div>
              )}

              <div className="border-t border-purple-200 pt-2 flex items-center justify-between font-bold text-sm text-[#6B1294]">
                <span>Total Payout</span>
                <span className="text-base font-medium">${totalPayout.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Submit/Cancel Buttons inside Form */}
          <div className="lg:col-span-2 pt-3 border-t border-gray-200/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl border border-gray-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#8E25E3] hover:bg-[#7b1bd1] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Save Job & Assign Provider
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
