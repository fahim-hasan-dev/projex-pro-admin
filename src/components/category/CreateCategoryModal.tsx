"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCategoryMutation } from "@/features/category/categoryApi";
import { CategoryItem } from "@/types/category";
import { Loader2, PlusCircle, FolderTree, Tag } from "lucide-react";
import toast from "react-hot-toast";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  initialParentId?: string | null;
  initialType?: "category" | "subcategory";
}

export default function CreateCategoryModal({
  isOpen,
  onClose,
  categories,
  initialParentId = null,
  initialType = "category",
}: CreateCategoryModalProps) {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const [type, setType] = useState<"category" | "subcategory">(initialType);
  const [name, setName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string>(initialParentId || "");

  useEffect(() => {
    if (isOpen) {
      setType(initialParentId ? "subcategory" : initialType);
      setSelectedParentId(initialParentId || (categories.length > 0 ? categories[0]._id : ""));
      setName("");
    }
  }, [isOpen, initialParentId, initialType, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    if (type === "subcategory" && !selectedParentId) {
      toast.error("Please select a parent category for the subcategory");
      return;
    }

    const payload = {
      name: name.trim(),
      parent: type === "subcategory" ? selectedParentId : null,
    };

    try {
      const res = await createCategory(payload).unwrap();
      if (res?.success || res?.statusCode === 200 || res?.statusCode === 201) {
        toast.success(
          res?.message ||
          (type === "subcategory"
            ? "Subcategory created successfully!"
            : "Category created successfully!")
        );
        onClose();
        setName("");
      } else {
        toast.error(res?.message || "Failed to create category");
      }
    } catch (err: any) {
      console.error("Create Category Error:", err);
      toast.error(err?.data?.message || err?.message || "Something went wrong while creating category");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] bg-white rounded-xl p-6 border border-gray-100 shadow-xl">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#8E25E3]" />
            {type === "subcategory" ? "Add New Subcategory" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-[#16px] space-y-4 pt-4">
          {/* Category Type Toggle */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Category Type
            </Label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/80 rounded-lg">
              <button
                type="button"
                onClick={() => setType("category")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${type === "category"
                    ? "bg-white text-[#8E25E3] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <Tag className="w-3.5 h-3.5" />
                Root Category
              </button>
              <button
                type="button"
                onClick={() => setType("subcategory")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${type === "subcategory"
                    ? "bg-white text-[#8E25E3] shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                  }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                Subcategory
              </button>
            </div>
          </div>

          {/* If Subcategory: Select Parent Category */}
          {type === "subcategory" && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Select Parent Category <span className="text-red-500">*</span>
              </Label>
              {categories.length === 0 ? (
                <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  No root categories available. Please create a parent category first.
                </p>
              ) : (
                <Select
                  value={selectedParentId}
                  onValueChange={(val) => setSelectedParentId(val)}
                >
                  <SelectTrigger className="w-full h-11 py-5 rounded-lg border-gray-200 text-sm font-medium focus:ring-[#8E25E3]">
                    <SelectValue placeholder="Choose a parent category..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white rounded-lg shadow-lg border border-gray-100">
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id} className="cursor-pointer">
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Name Input */}
          <div className="space-y-1.5">
            <Label htmlFor="catName" className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              {type === "subcategory" ? "Subcategory Name" : "Category Name"} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="catName"
              placeholder={type === "subcategory" ? "e.g., Roofing Repairs" : "e.g., Residential"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-lg border-gray-200 text-sm focus:border-[#8E25E3] focus:ring-[#8E25E3]"
              required
            />
          </div>



          <DialogFooter className="pt-4 border-t border-gray-100 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 px-5 rounded-lg border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || (type === "subcategory" && categories.length === 0)}
              className="h-11 px-6 rounded-lg bg-[#8E25E3] hover:bg-[#7b1ed0] text-white font-semibold transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                `Create ${type === "subcategory" ? "Subcategory" : "Category"}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
