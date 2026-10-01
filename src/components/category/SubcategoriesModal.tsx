"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllCategoriesQuery } from "@/features/category/categoryApi";
import { CategoryItem } from "@/types/category";
import { FolderTree, Plus, Search, Edit2, Trash2, Loader2, Tag, Calendar, CheckCircle2, AlertCircle } from "lucide-react";

interface SubcategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentCategory: CategoryItem | null;
  onAddSubcategory: (parentId: string) => void;
  onEditItem: (item: CategoryItem) => void;
  onDeleteItem: (item: CategoryItem) => void;
}

export default function SubcategoriesModal({
  isOpen,
  onClose,
  parentCategory,
  onAddSubcategory,
  onEditItem,
  onDeleteItem,
}: SubcategoriesModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const parentId = parentCategory?._id || "";

  // Query subcategories using GET /category?parent=PARENT_ID
  const { data, isLoading, isFetching, refetch } = useGetAllCategoriesQuery(
    { parent: parentId },
    { skip: !isOpen || !parentId }
  );

  const subcategories: CategoryItem[] = data?.data?.categories || [];

  const filteredSubcategories = subcategories.filter((sub) =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] bg-white rounded-2xl p-6 border border-gray-100 shadow-2xl flex flex-col overflow-hidden">
        <DialogHeader className="pb-4 border-b border-gray-100 flex-none">
          <div className="flex items-center justify-between pr-6">
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#8E25E3]" />
                Subcategories
              </DialogTitle>
              <p className="text-xs text-gray-500 mt-1">
                Parent Category: <span className="font-semibold text-[#8E25E3]">{parentCategory?.name}</span>{" "}
              </p>
            </div>
            {parentCategory && (
              <Button
                onClick={() => onAddSubcategory(parentCategory._id)}
                className="bg-[#8E25E3] hover:bg-[#7b1ed0] text-white text-xs font-semibold px-3.5 h-9 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add Subcategory
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Search Bar & Stats */}
        <div className="pt-4 pb-2 flex items-center justify-between gap-3 flex-none">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 text-xs rounded-xl border-gray-200 focus:border-[#8E25E3] focus:ring-[#8E25E3]"
            />
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-2 rounded-xl">
            Total: {subcategories.length}
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-1 py-2">
          {isLoading || isFetching ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
              <Loader2 className="w-7 h-7 animate-spin text-[#8E25E3]" />
              <p className="text-xs font-medium">Loading subcategories via API...</p>
              <span className="text-[10px] text-gray-400 font-mono">GET /category?parent={parentId}</span>
            </div>
          ) : filteredSubcategories.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50/50">
              <div className="w-12 h-12 bg-purple-50 text-[#8E25E3] rounded-full flex items-center justify-center mx-auto mb-3">
                <Tag className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-800">No Subcategories Found</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                {searchTerm
                  ? `No subcategory matches "${searchTerm}"`
                  : `There are no subcategories created under "${parentCategory?.name}" yet.`}
              </p>
              {parentCategory && !searchTerm && (
                <Button
                  onClick={() => onAddSubcategory(parentCategory._id)}
                  variant="outline"
                  className="mt-4 text-xs font-semibold text-[#8E25E3] border-[#8E25E3]/30 hover:bg-purple-50 rounded-xl"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Create First Subcategory
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredSubcategories.map((sub) => (
                <div
                  key={sub._id}
                  className="p-3.5 rounded-xl border border-gray-100 bg-white hover:border-purple-200 hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#8E25E3] flex items-center justify-center font-bold text-xs shrink-0">
                      <FolderTree className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-[#8E25E3] transition-colors">
                        {sub.name}
                      </h4>
                     
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditItem(sub)}
                      className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-[#8E25E3] hover:bg-purple-50"
                      title="Edit Subcategory"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDeleteItem(sub)}
                      className="h-8 w-8 p-0 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50"
                      title="Delete Subcategory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
