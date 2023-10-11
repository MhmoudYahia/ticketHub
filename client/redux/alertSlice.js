// alertSlice.js

import { createSlice } from "@reduxjs/toolkit";

const alertSlice = createSlice({
  name: "alert",
  initialState: {
    showAlert: false,
    alertInfo: {
      severity: "",
      title: "",
      message: "",
    },
  },
  reducers: {
    setShowAlert: (state, action) => {
      state.showAlert = action.payload;
    },
    setAlertInfo: (state, action) => {
      state.alertInfo = action.payload;
    },
  },
});

export const { setShowAlert, setAlertInfo } = alertSlice.actions;

export default alertSlice.reducer;
