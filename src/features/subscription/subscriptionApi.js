import { baseApi } from "../../utils/apiBaseQuery";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get all plans (with optional paymentType query: Monthly/Yearly)
    getAllPlans: builder.query({
      query: (paymentType) => {
        return {
          url: `/plan${paymentType ? `?paymentType=${paymentType}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Plan"],
    }),

    // 2. Get single plan details
    getSinglePlan: builder.query({
      query: (id) => ({
        url: `/plan/${id}`,
        method: "GET",
      }),
      providesTags: ["Plan"],
    }),

    // 3. Create a new plan
    createPlan: builder.mutation({
      query: (data) => ({
        url: "/plan",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Plan"],
    }),

    // 4. Update an existing plan
    updatePlan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/plan/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Plan"],
    }),

    // 5. Delete a plan
    deletePlan: builder.mutation({
      query: (id) => ({
        url: `/plan/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plan"],
    }),

    // 6. Get all subscription list (with pagination, status filter)
    getAllSubscriptions: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        if (params?.status && params?.status !== "All" && params?.status !== "all") {
          queryParams.append("status", params.status);
        }
        if (params?.search) {
          queryParams.append("searchTerm", params.search);
        }
        const queryString = queryParams.toString();
        return {
          url: `/subscription${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Subscription"],
    }),

    // 7. Get Enterprise plan requests
    getEnterpriseRequests: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        if (params?.status) queryParams.append("status", params.status);
        const queryString = queryParams.toString();
        return {
          url: `/subscription/enterprise/requests${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Subscription"],
    }),

    // 8. Approve Enterprise request
    approveEnterpriseRequest: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subscription/enterprise/approve/${id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscription"],
    }),

    // 9. Reject Enterprise request
    rejectEnterpriseRequest: builder.mutation({
      query: (id) => ({
        url: `/subscription/enterprise/reject/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetAllPlansQuery,
  useGetSinglePlanQuery,
  useCreatePlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
  useGetAllSubscriptionsQuery,
  useGetEnterpriseRequestsQuery,
  useApproveEnterpriseRequestMutation,
  useRejectEnterpriseRequestMutation,
} = subscriptionApi;
