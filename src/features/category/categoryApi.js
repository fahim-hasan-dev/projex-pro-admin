import { baseApi } from "../../utils/apiBaseQuery";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get categories with pagination and optional parent query
    getAllCategories: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        if (params?.parent !== undefined && params?.parent !== null) {
          queryParams.append("parent", params.parent);
        }
        if (params?.search) queryParams.append("search", params.search);
        const queryString = queryParams.toString();
        return {
          url: `/category${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Category"],
    }),

    // Get subcategories by parent category ID
    getSubcategories: builder.query({
      query: (parentId) => ({
        url: `/category?parent=${parentId}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    // Create Category or Subcategory
    // Payload for category: { name: "Test", parent: null }
    // Payload for subcategory: { name: "Children Test", parent: "categoryId" }
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // Update Category or Subcategory by ID
    // Payload: { id: "categoryId", data: { name: "New Name" } }
    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // Legacy typo alias support
    updtateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),

    // Delete Category or Subcategory by ID
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

// Export hooks
export const {
  useGetAllCategoriesQuery,
  useGetSubcategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdtateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;

