"use client";

import React, { useState } from "react";
import { CategoryItem } from "@/types/category";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  FolderTree,
  Plus,
  Calendar,
  Layers,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Tag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryTableProps {
  categories: CategoryItem[];
  isLoading: boolean;
  onViewSubcategories: (category: CategoryItem) => void;
  onAddSubcategory: (parentId: string) => void;
  onEditCategory: (category: CategoryItem) => void;
  onDeleteCategory: (category: CategoryItem) => void;
}

export default function CategoryTable({
  categories,
  isLoading,
  onViewSubcategories,
  onAddSubcategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryTableProps) {
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
            <tr className="border-b border-[#E5E7EB] bg-gray-50/50 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">Category Name</th>
              <th className="py-4 px-5 text-center">Subcategories</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-xs font-medium text-gray-800">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-gray-500 font-medium">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Tag className="w-8 h-8 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-700">No categories found</p>
                    <p className="text-xs text-gray-400">Get started by creating a new main category.</p>
                  </div>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-purple-50/30 transition-colors group">
                  {/* Category Name */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-[#8E25E3] flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-[#8E25E3] group-hover:text-white transition-colors duration-200">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#8E25E3] transition-colors">
                          {cat.name}
                        </p>
                        <span className="text-[11px] text-gray-400 font-normal">
                          Main Category
                        </span>
                      </div>
                    </div>
                  </td>



                  {/* Status */}
                 


                  {/* Subcategories View Button */}
                  <td className="py-4 px-5 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewSubcategories(cat)}
                      className="h-8 text-xs font-semibold text-[#8E25E3] border-purple-200 hover:bg-purple-50 hover:border-[#8E25E3] rounded-xl transition-all"
                    >
                      <FolderTree className="w-3.5 h-3.5 mr-1.5" />
                      View Subcategories
                      <ChevronRight className="w-3.5 h-3.5 ml-1 opacity-70" />
                    </Button>
                  </td>

                  {/* Actions Dropdown / Quick Buttons */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onAddSubcategory(cat._id)}
                        className="h-8 px-2.5 text-xs text-[#8E25E3] hover:bg-purple-50 rounded-lg flex items-center gap-1"
                        title="Add Subcategory"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Subcategory</span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:bg-gray-100">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white rounded-xl shadow-lg border border-gray-100 p-1">
                          <DropdownMenuItem
                            onClick={() => onViewSubcategories(cat)}
                            className="cursor-pointer text-xs font-medium text-gray-700 py-2 rounded-lg hover:bg-purple-50 hover:text-[#8E25E3]"
                          >
                            <FolderTree className="w-4 h-4 mr-2 text-[#8E25E3]" />
                            View Subcategories
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onAddSubcategory(cat._id)}
                            className="cursor-pointer text-xs font-medium text-gray-700 py-2 rounded-lg hover:bg-purple-50 hover:text-[#8E25E3]"
                          >
                            <Plus className="w-4 h-4 mr-2 text-[#8E25E3]" />
                            Add Subcategory
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-100 my-1" />
                          <DropdownMenuItem
                            onClick={() => onEditCategory(cat)}
                            className="cursor-pointer text-xs font-medium text-gray-700 py-2 rounded-lg hover:bg-purple-50 hover:text-[#8E25E3]"
                          >
                            <Edit className="w-4 h-4 mr-2 text-blue-600" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteCategory(cat)}
                            className="cursor-pointer text-xs font-medium text-red-600 py-2 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                            Delete Category
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
