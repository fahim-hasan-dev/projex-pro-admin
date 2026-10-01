import { baseApi } from "../../utils/apiBaseQuery";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/admin-login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),


    // Forgot Password Email
    forgotEmail: builder.mutation({
      query: (forgotEmail) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: forgotEmail,
      }), 
      invalidatesTags: ["Auth"],
    }),

    // OTP Verification (Handles both signup & forgot password OTP verification)
    otpCheck: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Resend OTP
    resendOTP: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Reset Password
    resetPassword: builder.mutation({
      query: ({ token, newPassword, confirmPassword }) => ({
        url: `/auth/reset-password${token ? `?token=${token}` : ""}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: token } : {}),
        },
        body: {
          newPassword,
          confirmPassword,
        },
      }),
      invalidatesTags: ["Auth"],
    }),

  }),
});

// Export hooks
export const {
  useLoginMutation,
  useForgotEmailMutation,
  useOtpCheckMutation,
  useResendOTPMutation,
  useResetPasswordMutation,
} = authApi;

