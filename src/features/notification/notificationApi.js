import { baseApi } from "../../utils/apiBaseQuery";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch notifications list with pagination
    getNotifications: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page);
        if (params?.limit) queryParams.append("limit", params.limit);
        const queryString = queryParams.toString();
        return {
          url: `/notification${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Notification"],
    }),

    // Get unread notification count
    getUnreadNotificationCount: builder.query({
      query: () => ({
        url: "/notification/unread-count",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
} = notificationApi;
