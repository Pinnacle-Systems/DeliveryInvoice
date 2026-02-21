import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { PROCESS_API} from "../../Api";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const processMasterApi = createApi({
  reducerPath: "processMaster",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["processMaster"],
  endpoints: (builder) => ({
    getprocessMasteres: builder.query({
      query: ({params, searchParams}) => {
        if(searchParams){
          return {
            url: PROCESS_API +"/search/"+searchParams,
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            params
          };
        }
        return {
          url: PROCESS_API,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          params
        };
      },
      providesTags: ["processMaster"],
    }),
    getprocessMasterById: builder.query({
      query: (id) => {
        return {
          url: `${PROCESS_API}/${id}`,
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
      },
      providesTags: ["processMaster"],
    }),
    addprocessMaster: builder.mutation({
      query: (payload) => ({
        url: PROCESS_API,
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }),
      invalidatesTags: ["processMaster"],
    }),
    updateprocessMaster: builder.mutation({
      query: (payload) => {
        const { id, ...body } = payload;
        return {
          url: `${PROCESS_API}/${id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["processMaster"],
    }),
    deleteprocessMaster: builder.mutation({
      query: (id) => ({
        url: `${PROCESS_API}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["processMaster"],
    }),
  }),
});

export const {
  useGetprocessMasteresQuery,
  useGetprocessMasterByIdQuery,
  useAddprocessMasterMutation,
  useUpdateprocessMasterMutation,
  useDeleteprocessMasterMutation,
} = processMasterApi;

export default processMasterApi;
