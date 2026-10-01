"use client";

import React, { useState, useEffect, useMemo } from "react";
import { X, MapPin, Calendar as CalendarIcon, Sliders } from "lucide-react";
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
import {
  useAllAssignServiceProvideQuery,
  useGetSingleServicesRequestQuery,
} from "@/features/request/requestApi";
import toast from "react-hot-toast";

interface JobRateModalProps {
  job: any | null;
  onClose: () => void;
  onSave: (updatedFields: any) => void;
  assignedContractor?: string;
  setAssignedContractor?: (contractor: string) => void;
}

const PREDEFINED_REASONS = [
  "Certified Electrician",
  "Licensed Plumber",
  "Emergency Service",
  "After Hours",
  "Hazardous Materials",
  "Specialized Equipment",
];

export default function JobRateModal({
  job,
  onClose,
  onSave,
}: JobRateModalProps) {
  // Fetch approved service providers via API: GET /user?role=service_provider&approvalStatus=approved
  const { data: providersResponse, isLoading: isLoadingProviders } = useAllAssignServiceProvideQuery(undefined);
  const providersList = providersResponse?.data?.users || [];

  // Fetch single job request data to guarantee fresh assigned data from GET /service-request/:id
  const targetId = job?._id || job?.id || "";
  const { data: singleJobResponse } = useGetSingleServicesRequestQuery(targetId, {
    skip: !targetId,
  });

  const activeJob = singleJobResponse?.data || job?.raw || job;

  // Form states
  const [selectedProviderId, setSelectedProviderId] = useState<string>("");
  const [basePayInput, setBasePayInput] = useState<number>(250);
  const [scheduledDate, setScheduledDate] = useState<string>("Jun 27, 2026");
  const [statusInput, setStatusInput] = useState<string>("Pending");

  // Specialized Job Rate fields
  const [isSpecializedActive, setIsSpecializedActive] = useState<boolean>(false);
  const [paymentType, setPaymentType] = useState<"Percentage" | "Flat Amount">("Flat Amount");
  const [rateValue, setRateValue] = useState<string>("");
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReasonInput, setCustomReasonInput] = useState<string>("");

  useEffect(() => {
    if (activeJob) {
      // 1. Base Pay initialization
      const base =
        activeJob.basePayment !== undefined && activeJob.basePayment !== null
          ? Number(activeJob.basePayment)
          : activeJob.basePay !== undefined && activeJob.basePay !== null
          ? Number(activeJob.basePay)
          : 250;
      setBasePayInput(base);

      // 2. Scheduled Date (ETA) initialization & formatting
      const rawEta = activeJob.eta || activeJob.etaDate;
      if (rawEta) {
        const d = new Date(rawEta);
        if (!isNaN(d.getTime())) {
          setScheduledDate(format(d, "MMM d, yyyy"));
        } else {
          setScheduledDate(rawEta);
        }
      } else {
        setScheduledDate("Jun 27, 2026");
      }

      // 3. Status
      setStatusInput(activeJob.status || "Pending");

      // 4. Assigned Provider ID pre-selection
      const providerObj = activeJob.assignedProvider;
      if (providerObj && typeof providerObj === "object") {
        setSelectedProviderId(providerObj._id || "");
      } else if (typeof providerObj === "string") {
        setSelectedProviderId(providerObj);
      } else {
        setSelectedProviderId("");
      }

      // 5. Specialized Job Rate pre-population
      const specialized = activeJob.specializedRate || {};
      setIsSpecializedActive(Boolean(specialized.isActive));
      setPaymentType(specialized.paymentType || "Flat Amount");
      setRateValue(
        specialized.value !== undefined && specialized.value !== null && specialized.value !== 0
          ? String(specialized.value)
          : ""
      );

      const reasonVal = specialized.reason || "";
      if (PREDEFINED_REASONS.includes(reasonVal)) {
        setSelectedReason(reasonVal);
        setCustomReasonInput("");
      } else {
        setSelectedReason("");
        setCustomReasonInput(reasonVal);
      }
    }
  }, [activeJob]);

  const parsedScheduledDate = useMemo(() => {
    if (!scheduledDate) return new Date();
    const d = new Date(scheduledDate);
    return isNaN(d.getTime()) ? new Date() : d;
  }, [scheduledDate]);

  if (!job) return null;

  // Calculation for Specialized Job Rate
  const numericVal = parseFloat(rateValue) || 0;
  let specializedAddon = 0;
  if (isSpecializedActive && numericVal > 0) {
    if (paymentType === "Percentage") {
      specializedAddon = (basePayInput * numericVal) / 100;
    } else {
      specializedAddon = numericVal;
    }
  }

  const finalPayout = basePayInput + specializedAddon;

  const handleChipClick = (reason: string) => {
    if (selectedReason === reason) {
      setSelectedReason("");
    } else {
      setSelectedReason(reason);
      setCustomReasonInput("");
    }
  };

  const activeReason = selectedReason || customReasonInput;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProviderId) {
      toast.error("Please select a service provider");
      return;
    }

    const payload = {
      assignedProvider: selectedProviderId,
      basePayment: Number(basePayInput),
      specializedRate: {
        isActive: isSpecializedActive,
        paymentType,
        value: numericVal,
        reason: activeReason || "Standard rate",
      },
      eta: scheduledDate,
    };

    onSave(payload);
  };

  const propertyObj = typeof activeJob.property === "object" ? activeJob.property : null;
  const propertyName = propertyObj?.name || activeJob.property || "Property Name";
  const propertyAddress = propertyObj?.address || activeJob.address || "1201 Maple Ave, Unit 4B, Austin, TX";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-5">
      <div className="bg-[#F8F9FA] rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-gray-200/80 animate-in fade-in zoom-in-95 duration-150">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              {activeJob.requestNo || activeJob.id || activeJob._id}
            </h2>

            <span className="px-3 py-1 bg-purple-100 text-[#8E25E3] rounded-full text-xs font-bold flex items-center gap-1">
              🔑 {activeJob.status || "In Progress"}
            </span>

            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
              {activeJob.priority || "High"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body Grid */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 custom-scrollbar">

          {/* LEFT COLUMN: JOB DETAILS */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">JOB DETAILS</h3>

            {/* PROPERTY */}
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block">PROPERTY</span>
              <h4 className="text-sm font-bold text-gray-900">{propertyName}</h4>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{propertyAddress}</span>
              </p>
            </div>

            {/* SERVICE TYPE & SUBMITTED DATE */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-0.5">SERVICE TYPE</span>
                <p className="text-xs font-bold text-blue-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  {propertyObj?.category?.name || activeJob.type || "Plumbing"}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-0.5">SUBMITTED</span>
                <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                  {activeJob.createdAt ? new Date(activeJob.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : activeJob.date || "Jun 24, 2026"}
                </p>
              </div>
            </div>

            {/* REPORTED ISSUE */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-0.5">REPORTED ISSUE</span>
              <p className="text-xs font-bold text-gray-900 leading-snug">
                {activeJob.issueTitle || activeJob.issue || "Service Issue"}
              </p>
            </div>

            {/* NOTES / DESCRIPTION */}
            <div>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1">NOTES</span>
              <div className="bg-gray-100/70 border border-gray-200/80 rounded-2xl p-3.5 text-xs text-gray-700 leading-relaxed font-normal">
                {activeJob.description || activeJob.notes || "Tenant reports service issue required at property site."}
              </div>
            </div>

            {/* SCHEDULED DATE */}
            <div className="grid grid-cols-1 gap-3 pt-1">
              <div className="w-full">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase block mb-1">
                  SCHEDULED DATE
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full bg-white border border-gray-200 rounded-lg py-3 px-3 text-xs font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8E25E3] flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors h-10"
                    >
                      <span>{scheduledDate || "Select Date"}</span>
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-white border border-gray-200 shadow-xl rounded-lg"
                    align="start"
                  >
                    <CalendarUI
                      mode="single"
                      selected={parsedScheduledDate}
                      onSelect={(date) => {
                        if (date) {
                          setScheduledDate(format(date, "MMM d, yyyy"));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SPECIALIZED JOB PRICING */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 tracking-wider uppercase">SPECIALIZED JOB PRICING</h3>

            {/* ASSIGN CONTRACTOR */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                ASSIGN CONTRACTOR <span className="text-red-500">*</span>
              </label>
              <Select
                value={selectedProviderId}
                onValueChange={(val) => setSelectedProviderId(val)}
              >
                <SelectTrigger className="w-full bg-white border border-gray-200 rounded-xl py-5 px-3.5 text-xs font-medium text-gray-800 focus:ring-[#8E25E3]">
                  <SelectValue
                    placeholder={
                      isLoadingProviders
                        ? "Loading approved providers..."
                        : providersList.length === 0
                        ? "No approved providers found"
                        : "Select contractor"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg text-xs font-medium text-gray-800">
                  {providersList.map((user: any) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* BASE PAYMENT */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                BASE PAYMENT
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500">$</span>
                <input
                  type="number"
                  min={0}
                  value={basePayInput}
                  onChange={(e) => setBasePayInput(Number(e.target.value))}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-xs font-bold text-gray-900 focus:border-[#8E25E3] focus:ring-[#8E25E3]"
                />
              </div>
            </div>

            {/* SPECIALIZED JOB RATE CARD BOX */}
            <div
              className={`rounded-2xl border transition-all duration-200 ${
                isSpecializedActive
                  ? "bg-purple-50/20 border-2 border-[#8E25E3] p-4 space-y-3.5 shadow-sm"
                  : "bg-white border-gray-200 p-4 space-y-1"
              }`}
            >
              {/* Toggle Header Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isSpecializedActive ? "bg-[#8E25E3] text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">
                      Specialized Job Rate
                    </h4>
                    <p className="text-[11px] text-gray-500 font-normal">
                      {isSpecializedActive ? "Active — additional pay applied" : "Off — standard rate only"}
                    </p>
                  </div>
                </div>

                {/* Switch Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsSpecializedActive(!isSpecializedActive)}
                  className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer ${
                    isSpecializedActive ? "bg-[#8E25E3] justify-end" : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* Expanded Options when Active */}
              {isSpecializedActive && (
                <div className="space-y-3.5 pt-2 border-t border-purple-100">
                  {/* PAYMENT TYPE Tab Toggle */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block mb-1.5">
                      PAYMENT TYPE
                    </span>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/90 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setPaymentType("Percentage")}
                        className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          paymentType === "Percentage"
                            ? "bg-[#8E25E3] text-white shadow-xs"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <span>%</span> Percentage
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentType("Flat Amount")}
                        className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          paymentType === "Flat Amount"
                            ? "bg-[#8E25E3] text-white shadow-xs"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        <span>#</span> Flat Amount
                      </button>
                    </div>
                  </div>

                  {/* VALUE INPUT */}
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block mb-1">
                      VALUE ({paymentType === "Percentage" ? "0–100%" : "$"})
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder={paymentType === "Percentage" ? "e.g. 15" : "e.g. 100"}
                      value={rateValue}
                      onChange={(e) => setRateValue(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:border-[#8E25E3] focus:ring-[#8E25E3]"
                    />
                  </div>

                  {/* REASON (optional) CHIPS */}
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase block mb-1.5">
                      REASON <span className="text-gray-400 font-normal">(optional)</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {PREDEFINED_REASONS.map((r) => {
                        const isSelected = selectedReason === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => handleChipClick(r)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? "bg-purple-100 text-[#8E25E3] border border-[#8E25E3]"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent"
                            }`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      placeholder="Or type a custom reason..."
                      value={customReasonInput}
                      onChange={(e) => {
                        setCustomReasonInput(e.target.value);
                        setSelectedReason("");
                      }}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium text-gray-800 focus:border-[#8E25E3] focus:ring-[#8E25E3]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* PAYOUT SUMMARY BOX */}
            <div className="bg-white border border-gray-200/90 rounded-2xl p-4 space-y-2.5 shadow-xs">
              <h5 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                PAYOUT SUMMARY
              </h5>

              <div className="flex items-center justify-between text-xs text-gray-700">
                <span>Base Payment</span>
                <span className="font-bold text-gray-900">${basePayInput.toLocaleString()}</span>
              </div>

              {isSpecializedActive && (
                <div className="flex items-center justify-between text-xs text-[#8E25E3]">
                  <span>
                    Specialized Rate ({paymentType === "Percentage" ? `+${numericVal}%` : `Flat`})
                  </span>
                  <span className="font-bold">+${specializedAddon.toLocaleString()}</span>
                </div>
              )}

              <p className="text-[11px] text-gray-400 italic">
                {isSpecializedActive && numericVal > 0
                  ? `Specialized add-on calculated`
                  : "Enter a value above"}
              </p>

              <div className="border-t border-gray-100 pt-2.5 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900">Final Payout</span>
                <span className="text-lg font-black text-gray-900">
                  ${finalPayout.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* MODAL FOOTER BUTTONS */}
          <div className="lg:col-span-2 pt-3 border-t border-gray-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded-xl border border-gray-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#8E25E3] hover:bg-[#7b1ed0] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Save & Assign
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
