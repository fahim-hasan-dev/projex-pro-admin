"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateCategoryMutation } from "@/features/category/categoryApi";
import { CategoryItem } from "@/types/category";
import { Edit3, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryItem | null;
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  category,
}: EditCategoryModalProps) {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const [name, setName] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name || "");
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category?._id) return;
    if (!name.trim()) {
      toast.error("Property sub-type name cannot be empty");
      return;
    }

    try {
      const res = await updateCategory({
        id: category._id,
        data: { name: name.trim() },
      }).unwrap();

      if (res?.success || res?.statusCode === 200) {
        toast.success(res?.message || "Property sub-type updated successfully!");
        onClose();
      } else {
        toast.error(res?.message || "Failed to update property sub-type");
      }
    } catch (err: any) {
      console.error("Update Sub-Type Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to update property sub-type");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[440px] bg-white rounded-2xl p-6 border border-gray-100 shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#8E25E3]" />
            Edit Property Sub-Type
          </DialogTitle>
          <p className="text-xs text-gray-500 font-normal mt-0.5">
            Modify the display name for this property sub-type
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <Label htmlFor="editSubTypeName" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Sub-Type Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="editSubTypeName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Townhouse, Office Space"
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
              disabled={isLoading}
              className="h-11 px-6 rounded-xl bg-[#8E25E3] hover:bg-[#7b1ed0] text-white font-semibold transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
