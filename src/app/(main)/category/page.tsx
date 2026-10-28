"use client";

import React, { useState, useMemo } from "react";
import { useGetAllCategoriesQuery } from "@/features/category/categoryApi";
import { CategoryItem } from "@/types/category";
import CategoryTable from "@/components/category/CategoryTable";
import CreateCategoryModal from "@/components/category/CreateCategoryModal";
import EditCategoryModal from "@/components/category/EditCategoryModal";
import DeleteCategoryModal from "@/components/category/DeleteCategoryModal";
import PaginationComponent from "@/components/ui/pagination-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  RefreshCw,
  Home,
  Building2,
  Layers,
  Sparkles,
  LayoutGrid,
} from "lucide-react";

export default function PropertyTypePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected parent property type filter: "all" | parentId
  const [selectedParentId, setSelectedParentId] = useState<string>("residential");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEditItem, setSelectedEditItem] = useState<CategoryItem | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<CategoryItem | null>(null);

  // 1. Fetch root categories (the 3 fixed parent types: Residential, Commercial, Mixed-use)
  const { data: rootData, isLoading: isLoadingRoots } = useGetAllCategoriesQuery({ limit: 10 });
  const rawRootCategories: CategoryItem[] = rootData?.data?.categories || [];

  // Filter root categories to ensure only valid parent types (parent is null)
  const rootCategories: CategoryItem[] = useMemo(() => {
    return rawRootCategories.filter((cat) => !cat.parent);
  }, [rawRootCategories]);

  // Find fixed parent items
  const residentialParent = rootCategories.find((c) => c.name.toLowerCase().includes("residential"));
  const commercialParent = rootCategories.find((c) => c.name.toLowerCase().includes("commercial"));
  const mixedUseParent = rootCategories.find((c) => c.name.toLowerCase().includes("mixed"));

  // 2. Fetch all categories & subcategories (parent=all)
  const {
    data: allData,
    isLoading: isLoadingAll,
    isFetching,
    refetch,
  } = useGetAllCategoriesQuery({ parent: "all", limit: 200 });

  const allItems: CategoryItem[] = allData?.data?.categories || [];

  // Helper to extract parent ID
  const getParentId = (item: CategoryItem): string => {
    if (!item.parent) return "";
    if (typeof item.parent === "object" && item.parent !== null && "_id" in item.parent) {
      return (item.parent as { _id: string })._id;
    }
    if (typeof item.parent === "string") {
      return item.parent;
    }
    return "";
  };

  // Only subcategories (items having a parent)
  const subTypes = useMemo(() => {
    return allItems.filter((item) => Boolean(item.parent));
  }, [allItems]);

  // Counts per parent
  const residentialCount = useMemo(() => {
    if (!residentialParent) return 0;
    return subTypes.filter((s) => getParentId(s) === residentialParent._id).length;
  }, [subTypes, residentialParent]);

  const commercialCount = useMemo(() => {
    if (!commercialParent) return 0;
    return subTypes.filter((s) => getParentId(s) === commercialParent._id).length;
  }, [subTypes, commercialParent]);

  const mixedUseCount = useMemo(() => {
    if (!mixedUseParent) return 0;
    return subTypes.filter((s) => getParentId(s) === mixedUseParent._id).length;
  }, [subTypes, mixedUseParent]);

  // Determine active parent ID:
  // Default to Residential if state is "residential" or if matching ID
  const activeParentId = useMemo(() => {
    if (selectedParentId === "all") return "all";
    if (selectedParentId === "residential" || (residentialParent && selectedParentId === residentialParent._id)) {
      return residentialParent?._id || "residential";
    }
    if (selectedParentId === "commercial" || (commercialParent && selectedParentId === commercialParent._id)) {
      return commercialParent?._id || "commercial";
    }
    if (selectedParentId === "mixed" || (mixedUseParent && selectedParentId === mixedUseParent._id)) {
      return mixedUseParent?._id || "mixed";
    }
    return residentialParent?._id || "all";
  }, [selectedParentId, residentialParent, commercialParent, mixedUseParent]);

  // Filtered sub-types
  const filteredSubTypes = useMemo(() => {
    return subTypes.filter((item) => {
      // Parent filter
      if (activeParentId !== "all") {
        const pId = getParentId(item);
        if (pId !== activeParentId) return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        return item.name.toLowerCase().includes(term);
      }

      return true;
    });
  }, [subTypes, activeParentId, searchTerm]);

  // Pagination slice
  const paginatedSubTypes = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSubTypes.slice(start, start + pageSize);
  }, [filteredSubTypes, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredSubTypes.length / pageSize) || 1;

  // Active parent name for subtitle
  const activeParentName = useMemo(() => {
    if (activeParentId === "all") return "All Property Types";
    if (residentialParent && activeParentId === residentialParent._id) return "Residential";
    if (commercialParent && activeParentId === commercialParent._id) return "Commercial";
    if (mixedUseParent && activeParentId === mixedUseParent._id) return "Mixed-use";
    return "Selected Property Type";
  }, [activeParentId, residentialParent, commercialParent, mixedUseParent]);

  // Handlers
  const handleOpenAddSubType = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (item: CategoryItem) => {
    setSelectedEditItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (item: CategoryItem) => {
    setSelectedDeleteItem(item);
    setIsDeleteModalOpen(true);
  };

  const isResidentialActive =
    activeParentId === residentialParent?._id || selectedParentId === "residential";
  const isCommercialActive =
    activeParentId === commercialParent?._id || selectedParentId === "commercial";
  const isMixedActive =
    activeParentId === mixedUseParent?._id || selectedParentId === "mixed";
  const isAllActive = activeParentId === "all";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Property Type Management
          </h1>
          <p className="text-sm text-gray-500">
            Manage fixed parent property types and customize their respective sub-types.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 px-3.5 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-[#8E25E3]" : "text-gray-500"}`} />
            <span className="text-xs font-semibold">Refresh</span>
          </Button>
          <Button
            onClick={handleOpenAddSubType}
            className="h-10 px-5 rounded-xl bg-[#8E25E3] hover:bg-[#7b1ed0] text-white text-xs font-semibold shadow-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Sub-Type
          </Button>
        </div>
      </div>

      {/* Property Type Selector Tabs (Matching User Provided Design) */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block">
          Property Type
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {/* Residential Tab */}
          <button
            type="button"
            onClick={() => {
              setSelectedParentId(residentialParent?._id || "residential");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              isResidentialActive
                ? "border-2 border-[#5B1B95] bg-[#F2E7FC] text-[#5B1B95] font-semibold shadow-xs"
                : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/80"
            }`}
          >
            <Home className={`w-4 h-4 ${isResidentialActive ? "text-[#5B1B95]" : "text-gray-500"}`} />
            <span>Residential</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isResidentialActive
                  ? "bg-[#5B1B95] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {residentialCount}
            </span>
          </button>

          {/* Commercial Tab */}
          <button
            type="button"
            onClick={() => {
              setSelectedParentId(commercialParent?._id || "commercial");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              isCommercialActive
                ? "border-2 border-[#5B1B95] bg-[#F2E7FC] text-[#5B1B95] font-semibold shadow-xs"
                : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/80"
            }`}
          >
            <Building2 className={`w-4 h-4 ${isCommercialActive ? "text-[#5B1B95]" : "text-gray-500"}`} />
            <span>Commercial</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isCommercialActive
                  ? "bg-[#5B1B95] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {commercialCount}
            </span>
          </button>

          {/* Mixed-use Tab */}
          <button
            type="button"
            onClick={() => {
              setSelectedParentId(mixedUseParent?._id || "mixed");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              isMixedActive
                ? "border-2 border-[#5B1B95] bg-[#F2E7FC] text-[#5B1B95] font-semibold shadow-xs"
                : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/80"
            }`}
          >
            <Layers className={`w-4 h-4 ${isMixedActive ? "text-[#5B1B95]" : "text-gray-500"}`} />
            <span>Mixed-use</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isMixedActive
                  ? "bg-[#5B1B95] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {mixedUseCount}
            </span>
          </button>

          {/* All Sub-Types Tab */}
          <button
            type="button"
            onClick={() => {
              setSelectedParentId("all");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer ${
              isAllActive
                ? "border-2 border-[#5B1B95] bg-[#F2E7FC] text-[#5B1B95] font-semibold shadow-xs"
                : "border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50/80"
            }`}
          >
            <LayoutGrid className={`w-4 h-4 ${isAllActive ? "text-[#5B1B95]" : "text-gray-500"}`} />
            <span>All Sub-Types</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                isAllActive
                  ? "bg-[#5B1B95] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {subTypes.length}
            </span>
          </button>
        </div>
      </div>

      {/* Controls & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            placeholder={`Search ${activeParentName} sub-types...`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 h-10 text-xs rounded-xl border-gray-200 focus:border-[#8E25E3] focus:ring-[#8E25E3]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Showing:</span>
          <span className="font-semibold text-[#8E25E3] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
            {activeParentName} ({filteredSubTypes.length})
          </span>
        </div>
      </div>

      {/* Main Sub-Types Table */}
      <CategoryTable
        categories={paginatedSubTypes}
        parentCategories={rootCategories}
        isLoading={isLoadingAll || isLoadingRoots}
        onEditCategory={handleOpenEdit}
        onDeleteCategory={handleOpenDelete}
        onAddNew={handleOpenAddSubType}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end pt-2">
          <PaginationComponent
            totalItems={filteredSubTypes.length}
            itemsPerPage={pageSize}
            initialPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Create Modal */}
      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        categories={rootCategories}
        initialParentId={
          activeParentId !== "all"
            ? activeParentId
            : residentialParent?._id || null
        }
      />

      {/* Edit Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEditItem(null);
        }}
        category={selectedEditItem}
      />

      {/* Delete Modal */}
      <DeleteCategoryModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDeleteItem(null);
        }}
        category={selectedDeleteItem}
      />
    </div>
  );
}