"use client";

import React, { useState } from "react";
import { useGetAllCategoriesQuery } from "@/features/category/categoryApi";
import { CategoryItem } from "@/types/category";
import CategoryTable from "@/components/category/CategoryTable";
import CreateCategoryModal from "@/components/category/CreateCategoryModal";
import EditCategoryModal from "@/components/category/EditCategoryModal";
import DeleteCategoryModal from "@/components/category/DeleteCategoryModal";
import SubcategoriesModal from "@/components/category/SubcategoriesModal";
import PaginationComponent from "@/components/ui/pagination-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    RefreshCw,
    FolderTree,
    Tag,
    Layers,
    Sparkles,
    ArrowRightLeft,
} from "lucide-react";

export default function CategoryPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createType, setCreateType] = useState<"category" | "subcategory">("category");
    const [createParentId, setCreateParentId] = useState<string | null>(null);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEditItem, setSelectedEditItem] = useState<CategoryItem | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDeleteItem, setSelectedDeleteItem] = useState<CategoryItem | null>(null);

    const [isSubcategoriesModalOpen, setIsSubcategoriesModalOpen] = useState(false);
    const [selectedParentCategory, setSelectedParentCategory] = useState<CategoryItem | null>(null);

    // Fetch root categories (parent: null / top-level categories)
    const { data, isLoading, isFetching, refetch } = useGetAllCategoriesQuery({
        page: currentPage,
        limit: 10,
        search: searchTerm,
    });

    const categories: CategoryItem[] = data?.data?.categories || [];
    const meta = data?.data?.meta;
    const totalCategories = data?.data?.totalCategories || meta?.total || categories.length;

    // Filters for client-side search if API search is simple
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Modal Triggers
    const handleOpenCreateCategory = () => {
        setCreateType("category");
        setCreateParentId(null);
        setIsCreateModalOpen(true);
    };

    const handleOpenCreateSubcategory = (parentId?: string) => {
        setCreateType("subcategory");
        setCreateParentId(parentId || null);
        setIsCreateModalOpen(true);
    };

    const handleOpenSubcategoriesModal = (category: CategoryItem) => {
        setSelectedParentCategory(category);
        setIsSubcategoriesModalOpen(true);
    };

    const handleOpenEdit = (item: CategoryItem) => {
        setSelectedEditItem(item);
        setIsEditModalOpen(true);
    };

    const handleOpenDelete = (item: CategoryItem) => {
        setSelectedDeleteItem(item);
        setIsDeleteModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ">
                <div className="space-y-1 relative z-10">
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Category & Subcategory Management
                    </h1>
                    <p className="text-gray-500">
                        Create, manage, and organize root service categories and subcategories seamlessly.
                    </p>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#8E25E3] flex items-center justify-center shrink-0">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500">Total Root Categories</p>
                        <h3 className="text-2xl font-black text-gray-900 mt-0.5">{totalCategories}</h3>
                    </div>
                </div>
            </div>

            {/* Controls & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <Input
                        placeholder="Search category by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 h-10 text-xs rounded-xl border-gray-200 focus:border-[#8E25E3] focus:ring-[#8E25E3]"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button
                        onClick={handleOpenCreateCategory}
                        className="h-10 px-4 rounded-xl bg-[#8E25E3] hover:bg-[#7b1ed0] text-white text-xs font-semibold shadow-xs"
                    >
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add Category
                    </Button>
                </div>
            </div>

            {/* Main Table */}
            <CategoryTable
                categories={filteredCategories}
                isLoading={isLoading}
                onViewSubcategories={handleOpenSubcategoriesModal}
                onAddSubcategory={(parentId) => handleOpenCreateSubcategory(parentId)}
                onEditCategory={handleOpenEdit}
                onDeleteCategory={handleOpenDelete}
            />

            {/* Pagination */}
            {meta && meta.totalPage > 1 && (
                <div className="flex justify-end pt-2">
                    <PaginationComponent
                        totalItems={meta.total}
                        itemsPerPage={meta.limit}
                        initialPage={meta.page}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}

            {/* Create Modal */}
            <CreateCategoryModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                categories={categories}
                initialParentId={createParentId}
                initialType={createType}
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

            {/* Subcategories View Modal */}
            <SubcategoriesModal
                isOpen={isSubcategoriesModalOpen}
                onClose={() => {
                    setIsSubcategoriesModalOpen(false);
                    setSelectedParentCategory(null);
                }}
                parentCategory={selectedParentCategory}
                onAddSubcategory={(parentId) => {
                    setIsSubcategoriesModalOpen(false);
                    handleOpenCreateSubcategory(parentId);
                }}
                onEditItem={(sub) => {
                    handleOpenEdit(sub);
                }}
                onDeleteItem={(sub) => {
                    handleOpenDelete(sub);
                }}
            />
        </div>
    );
}