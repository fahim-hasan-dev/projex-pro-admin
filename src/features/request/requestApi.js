import { baseApi } from "../../utils/apiBaseQuery";

export const requestApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllServicesRequest: builder.query({
            query: (params = {}) => {
                const queryParams = new URLSearchParams();
                if (params?.page) queryParams.append("page", params.page);
                if (params?.limit) queryParams.append("limit", params.limit);
                if (params?.status && params?.status !== "all" && params?.status !== "All Requests") {
                    queryParams.append("status", params.status);
                }
                if (params?.search) queryParams.append("search", params.search);
                const queryString = queryParams.toString();
                return {
                    url: `/service-request${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["request"],
        }),

        getSingleServicesRequest: builder.query({
            query: (id) => ({
                url: `/service-request/${id}`,
                method: "GET",
            }),
            providesTags: ["request"],
        }),

        assignServiceProvideByAdmin: builder.mutation({
            query: ({ data, id }) => ({
                url: `/service-request/assign/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["request"],
        }),


        allAssignServiceProvide: builder.query({
            query: () => {
                return {
                    url: `/user?role=service_provider&approvalStatus=approved`,
                    method: "GET",
                };
            },
            providesTags: ["request"],
        }),


    }),
});

export const reqestApi = requestApi;

export const {
    useGetAllServicesRequestQuery,
    useGetSingleServicesRequestQuery,
    useAllAssignServiceProvideQuery,
    useAssignServiceProvideByAdminMutation,
} = requestApi;


