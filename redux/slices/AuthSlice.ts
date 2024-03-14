import { createSlice } from "@reduxjs/toolkit";
import { type UserType } from "../../types/UserType";

interface InitialStateType {
  isLoggedIn: boolean;
  userDetails: UserType;
}

const initialState: InitialStateType = {
  isLoggedIn: false,
  userDetails: {
    userId: "",
    name: "",
    email: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.isLoggedIn = true;
      state.userDetails = action.payload;
    },
    clearUser: (state) => {
      state.isLoggedIn = false;
      state.userDetails = {
        userId: "",
        name: "",
        email: "",
      };
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
