import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    visible: false,
    message: "",
  },
  reducers: {
    showNotification: (state, action) => {
      state.visible = true;
      state.message = action.payload;
    },
    hideNotification: (state) => {
      state.visible = false;
      state.message = "";
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
