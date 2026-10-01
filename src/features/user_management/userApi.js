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
    }),
});

export const requestApi = userApi;
export const reqestApi = userApi;

export const {
    useGetPropertyManagerQuery,
    useGetServiceProviderQuery,
    useApproveRejectUserByAdminMutation,
} = userApi;



