import { baseApi } from "../../utils/apiBaseQuery";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPropertyManager: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                queryParams.append("role", "property_manager");
                if (params?.page) queryParams.append("page", params.page);
                if (params?.limit) queryParams.append("limit", params.limit);
                if (params?.search) queryParams.append("searchTerm", params.search);
                if (params?.approvalStatus && params?.approvalStatus !== "all" && params?.approvalStatus !== "All Statuses") {
                    queryParams.append("approvalStatus", params.approvalStatus.toLowerCase());
                }
                if (params?.status && params?.status !== "all" && params?.status !== "All Statuses") {
                    queryParams.append("status", params.status.toLowerCase());
                }
                if (params?.subscribe !== undefined && params?.subscribe !== null) {
                    queryParams.append("subscribe", params.subscribe);
                }
                const queryString = queryParams.toString();
                return {
                    url: `/user${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["user"],
        }),

        getSingleUser: builder.query({
            query: (id) => ({
                url: `/user/${id}`,
                method: "GET",
            }),
            providesTags: ["user"],
        }),

        getServiceProvider: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                queryParams.append("role", "service_provider");
                if (params?.page) queryParams.append("page", params.page);
                if (params?.limit) queryParams.append("limit", params.limit);
                if (params?.search) queryParams.append("searchTerm", params.search);
                if (params?.approvalStatus && params?.approvalStatus !== "all") {
                    queryParams.append("approvalStatus", params.approvalStatus);
                }
                const queryString = queryParams.toString();
                return {
                    url: `/user${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["user"],
        }),

        approveRejectUserByAdmin: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/property-managers/${id}/approval`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["user"],
        }),

        updatePartnerByAdmin: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/property-managers/${id}/approval`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["user"],
        }),

        getAllProperties: builder.query({
            query: () => ({
                url: "/property?limit=100",
                method: "GET",
            }),
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["user"],
        }),
    }),
});

export const requestApi = userApi;
export const reqestApi = userApi;

export const {
    useGetPropertyManagerQuery,
    useGetSingleUserQuery,
    useGetServiceProviderQuery,
    useGetAllPropertiesQuery,
    useApproveRejectUserByAdminMutation,
    useUpdatePartnerByAdminMutation,
    useDeleteUserMutation,
} = userApi;





