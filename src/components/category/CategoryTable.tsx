"use client";

import React from "react";
import { CategoryItem } from "@/types/category";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Home,
  Building2,
  Layers,
  Tag,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryTableProps {
  categories: CategoryItem[];
  parentCategories: CategoryItem[];
  isLoading: boolean;
  onEditCategory: (category: CategoryItem) => void;
  onDeleteCategory: (category: CategoryItem) => void;
  onAddNew: () => void;
}

export default function CategoryTable({
  categories,
  parentCategories,
  isLoading,
  onEditCategory,
  onDeleteCategory,
  onAddNew,
}: CategoryTableProps) {
  const getParentInfo = (item: CategoryItem) => {
    let parentName = "";
    if (typeof item.parent === "object" && item.parent !== null && "name" in item.parent) {
      parentName = (item.parent as { name: string }).name;
    } else if (typeof item.parent === "string") {
      const found = parentCategories.find((p) => p._id === item.parent);
      parentName = found ? found.name : "";
    }

    const lower = parentName.toLowerCase();
    if (lower.includes("commercial")) {
      return {
        name: parentName || "Commercial",
        icon: <Building2 className="w-3.5 h-3.5 text-blue-600" />,
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
      };
    }
    if (lower.includes("mixed")) {
      return {
        name: parentName || "Mixed-use",
        icon: <Layers className="w-3.5 h-3.5 text-purple-600" />,
        badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
      };
    }
    return {
      name: parentName || "Residential",
      icon: <Home className="w-3.5 h-3.5 text-emerald-600" />,
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
        {[1, 2, 3, 4, 5].map((idx) => (
          <div key={idx} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-48 rounded" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-gray-50/60 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6 w-16 text-center">#</th>
              <th className="py-4 px-6">Sub-Type Name</th>
              <th className="py-4 px-6">Parent Property Type</th>
              <th className="py-4 px-6">Created Date</th>
              <th className="py-4 px-6 text-center">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs font-medium text-gray-800">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-14 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#8E25E3] flex items-center justify-center">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">No Property Sub-Types Found</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        No sub-types exist under this property type yet.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={onAddNew}
                      className="mt-2 bg-[#8E25E3] hover:bg-[#7b1ed0] text-white text-xs font-semibold rounded-xl px-4 h-9 shadow-xs"
                    >
                      + Add First Sub-Type
                    </Button>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat, idx) => {
                const parentInfo = getParentInfo(cat);
                return (
                  <tr key={cat._id} className="hover:bg-purple-50/20 transition-colors group">
                    {/* Index */}
                    <td className="py-4 px-6 text-center text-gray-400 font-semibold text-xs">
                      {idx + 1}
                    </td>

                    {/* Sub-Type Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-100/60 text-[#8E25E3] flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-[#8E25E3] group-hover:text-white transition-colors duration-200">
                          <Tag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#8E25E3] transition-colors">
                            {cat.name}
                          </p>
                          <span className="text-[11px] text-gray-400 font-normal">
                            Property Sub-Type
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Parent Property Type Badge */}
                    <td className="py-4 px-6">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${parentInfo.badgeClass}`}
                      >
                        {parentInfo.icon}
                        <span>{parentInfo.name}</span>
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-6 text-gray-500">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(cat.createdAt)}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEditCategory(cat)}
                          className="h-8 px-2.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg flex items-center gap-1 transition-colors"
                          title="Edit Sub-Type"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteCategory(cat)}
                          className="h-8 px-2.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg flex items-center gap-1 transition-colors"
                          title="Delete Sub-Type"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
