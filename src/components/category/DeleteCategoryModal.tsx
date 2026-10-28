"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteCategoryMutation } from "@/features/category/categoryApi";
import { CategoryItem } from "@/types/category";
import { AlertTriangle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryItem | null;
}

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
}: DeleteCategoryModalProps) {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

  const isSubcategory = Boolean(category?.parent);

  const handleDelete = async () => {
    if (!category?._id) return;

    try {
      const res = await deleteCategory(category._id).unwrap();

      if (res?.success || res?.statusCode === 200) {
        toast.success(res?.message || "Property Sub-Type deleted successfully!");
        onClose();
      } else {
        toast.error(res?.message || "Failed to delete item");
      }
    } catch (err: any) {
      console.error("Delete Category Error:", err);
      toast.error(err?.data?.message || err?.message || "Failed to delete item");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] bg-white rounded-2xl p-6 border border-gray-100 shadow-xl">
        <DialogHeader className="pb-3 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Delete Property Sub-Type
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-3 text-sm text-gray-600">
          <p>
            Are you sure you want to delete{" "}
            <span className="font-bold text-gray-900">"{category?.name}"</span>?
          </p>
          <p className="text-xs text-gray-500 bg-red-50/70 p-3 rounded-xl border border-red-100 leading-relaxed">
            ⚠️ Warning: This action will permanently remove this property sub-type.
          </p>
        </div>

        <DialogFooter className="pt-3 border-t border-gray-100 flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 px-5 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="h-11 px-6 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
