import { createApi } from "@reduxjs/toolkit/query/react";
import { PAYMENT_API } from "../../Api";
// import baseQuery from "./baseQuery";
const PaymentApi = createApi({
  reducerPath: "Payment",
  // baseQuery,
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    getPayment: builder.query({
      query: ({ params, searchParams }) => {
        if (searchParams) {
          return {
            url: PAYMENT_API + "/search/" + searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: PAYMENT_API,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["Payment"],
    }),
    getPaymentById: builder.query({
      query: (id) => {
        return {
          url: `${PAYMENT_API}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["Payment"],
    }),
    addPayment: builder.mutation({
      query: (payload) => ({
        url: PAYMENT_API,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["Payment"],
    }),
    updatePayment: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${PAYMENT_API}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["Payment"],
    }),
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `${PAYMENT_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetPaymentQuery,
  useGetPaymentByIdQuery,
  useAddPaymentMutation,
  useUpdatePaymentMutation,
  useDeletePaymentMutation,
} = PaymentApi;

export default PaymentApi;
