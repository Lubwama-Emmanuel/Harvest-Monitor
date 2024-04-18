import { db } from "@/services/FirebaseConfig";
import { DataType } from "@/types/DataType";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { get, onValue, ref } from "firebase/database";

export const firebaseApi = createApi({
  reducerPath: "firebaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  //   keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getData: builder.query<DataType, void>({
      queryFn: async () => {
        try {
          let values;
          const dataRef = ref(db, "newData/log/");
          const snapshot = await get(dataRef);
          if (snapshot.exists()) {
            return { data: snapshot.val() };
          } else {
            return { error: { status: "404", statusText: "No data found" } };
          }
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useGetDataQuery } = firebaseApi;
