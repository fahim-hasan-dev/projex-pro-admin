"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCategoryMutation } from "@/features/category/categoryApi";
import { CategoryItem } from "@/types/category";
import { Loader2, PlusCircle, Home, Building2, Layers } from "lucide-react";
import toast from "react-hot-toast";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[]; // Fixed parent property types: Residential, Commercial, Mixed-use
  initialParentId?: string | null;
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
  categories,
  initialParentId = null,
}: CreateCategoryModalProps) {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const [name, setName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string>(initialParentId || "");

  useEffect(() => {
    if (isOpen) {
      setSelectedParentId(initialParentId || (categories.length > 0 ? categories[0]._id : ""));
      setName("");
    }
  }, [isOpen, initialParentId, categories]);

  const getParentIcon = (catName: string) => {
    const lower = catName.toLowerCase();
    if (lower.includes("commercial")) return <Building2 className="w-4 h-4 text-blue-600" />;
    if (lower.includes("mixed")) return <Layers className="w-4 h-4 text-purple-600" />;
    return <Home className="w-4 h-4 text-emerald-600" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a property sub-type name");
      return;
    }

    if (!selectedParentId) {
      toast.error("Please select a parent property type");
      return;
    }

    const payload = {
      name: name.trim(),
      parent: selectedParentId,
    };

    try {
      const res = await createCategory(payload).unwrap();
      if (res?.success || res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success(res?.message || "Property Sub-Type created successfully!");
        onClose();
        setName("");
      } else {
        toast.error(res?.message || "Failed to create property sub-type");
      }
    } catch (err: any) {
      console.error("Create Sub-Type Error:", err);
      toast.error(err?.data?.message || err?.message || "Something went wrong while creating property sub-type");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 border border-gray-100 shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#8E25E3]" />
            Add New Property Sub-Type
          </DialogTitle>
          <p className="text-xs text-gray-500 font-normal mt-0.5">
            Add a new child property type under one of the 3 fixed parent categories
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Parent Property Type Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Parent Property Type <span className="text-red-500">*</span>
            </Label>
            {categories.length === 0 ? (
              <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                Loading parent property types...
              </p>
            ) : (
              <Select
                value={selectedParentId}
                onValueChange={(val) => setSelectedParentId(val)}
              >
                <SelectTrigger className="w-full h-11 py-2.5 rounded-xl border-gray-200 text-sm font-medium focus:ring-[#8E25E3]">
                  <SelectValue placeholder="Choose parent property type..." />
                </SelectTrigger>
                <SelectContent className="bg-white rounded-xl shadow-lg border border-gray-100">
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        {getParentIcon(cat.name)}
                        <span className="font-semibold text-gray-800">{cat.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Sub-Type Name Input */}
          <div className="space-y-1.5">
            <Label htmlFor="subTypeName" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Property Sub-Type Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subTypeName"
              placeholder="e.g., Townhouse, Penthouse, Retail Plaza, Studio..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-xl border-gray-200 text-sm focus:border-[#8E25E3] focus:ring-[#8E25E3]"
              required
            />
          </div>

          <DialogFooter className="pt-4 border-t border-gray-100 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-5 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || categories.length === 0}
              className="h-11 px-6 rounded-xl bg-[#8E25E3] hover:bg-[#7b1ed0] text-white font-semibold transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Add Sub-Type"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
