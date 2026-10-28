"use client";

import React from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PriorityLevel, ServiceCategory } from "./types";

interface CreateServiceRequestModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  newProperty: string;
  setNewProperty: (val: string) => void;
  newIssue: string;
  setNewIssue: (val: string) => void;
  newType: ServiceCategory;
  setNewType: (val: ServiceCategory) => void;
  newPriority: PriorityLevel;
  setNewPriority: (val: PriorityLevel) => void;
  newBasePay: number;
  setNewBasePay: (val: number) => void;
}

export default function CreateServiceRequestModal({
  show,
  onClose,
  onSubmit,
  newProperty,
  setNewProperty,
  newIssue,
  setNewIssue,
  newType,
  setNewType,
  newPriority,
  setNewPriority,
  newBasePay,
  setNewBasePay,
}: CreateServiceRequestModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h3 className="text-lg font-bold text-gray-900">Create Service Request</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-gray-700 font-bold mb-1">Property Name</label>
            <input
              type="text"
              placeholder="e.g. Maple Residences"
              value={newProperty}
              onChange={(e) => setNewProperty(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8E25E3]/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Issue Description</label>
            <input
              type="text"
              placeholder="e.g. Water leak in hallway"
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8E25E3]/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Service Category</label>
            <Select value={newType} onValueChange={(val) => setNewType(val as ServiceCategory)}>
              <SelectTrigger className="w-full bg-[#FFFFFF] border-[#E5E7EB] rounded-md h-11 text-sm font-medium text-gray-700 cursor-pointer">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 text-sm font-medium text-gray-800 shadow-md">
                <SelectItem value="Plumbing">Plumbing</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="HVAC">HVAC</SelectItem>
                <SelectItem value="Cleaning">Cleaning</SelectItem>
                <SelectItem value="Painting">Painting</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Priority Level</label>
            <Select value={newPriority} onValueChange={(val) => setNewPriority(val as PriorityLevel)}>
              <SelectTrigger className="w-full bg-[#FFFFFF] border-[#E5E7EB] rounded-md h-11 text-sm font-medium text-gray-700 cursor-pointer">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 text-sm font-medium text-gray-800 shadow-md">
                <SelectItem value="Critical">Critical</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-1">Estimated Base Pay ($)</label>
            <input
              type="number"
              placeholder="0"
              value={newBasePay === 0 ? "" : newBasePay}
              onChange={(e) => setNewBasePay(e.target.value === "" ? 0 : Number(e.target.value))}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8E25E3]/40 focus:outline-none text-sm"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold text-sm rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#8E25E3] hover:bg-[#7b1fd0] text-white font-semibold text-sm rounded-md shadow-xs cursor-pointer transition-colors"
          >
            Create Request
          </button>
        </div>
      </form>
    </div>
  );
}
