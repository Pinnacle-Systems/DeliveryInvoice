import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PAYOUT_API} from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const PayOutApi = createApi({
  reducerPath: "PayOut",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["PayOut"],
  endpoints: (builder) => ({
    getPayOut: builder.query({
      query: ({params, searchParams}) => {
        if(searchParams){
          return {
            url: PAYOUT_API +"/search/"+searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: PAYOUT_API,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["PayOut"],
    }),
    getPayOutById: builder.query({
      query: ({id, advanceAdjustmentId}) => {
        return {
          url: `${PAYOUT_API}/${id}/${advanceAdjustmentId ? advanceAdjustmentId : null}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["PayOut"],
    }),
    addPayOut: builder.mutation({
      query: (payload) => ({
        url: PAYOUT_API,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["PayOut"],
    }),
    updatePayOut: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${PAYOUT_API}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["PayOut"],
    }),
    deletePayOut: builder.mutation({
      query: (id) => ({
        url: `${PAYOUT_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PayOut"],
    }),
  }),
});

export const {
  useGetPayOutQuery,
  useGetPayOutByIdQuery,
  useAddPayOutMutation,
  useUpdatePayOutMutation,
  useDeletePayOutMutation,
} = PayOutApi;

export default PayOutApi;
