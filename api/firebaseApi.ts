import { db } from "@/services/FirebaseConfig";
import { DataType } from "@/types/DataType";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { onValue, ref } from "firebase/database";

export const firebaseApi = createApi({
  reducerPath: "firebaseApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    getData: builder.query<DataType, void>({
      queryFn: () => {
        try {
          let values;
          const dataRef = ref(db, "data/");
          onValue(dataRef, (snapshot) => {
            values = snapshot.val();
            console.log("From function", values);
          });

          return { data: values };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const { useGetDataQuery } = firebaseApi;
