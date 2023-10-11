// store.js

import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";

const store = configureStore({
  reducer: rootReducer, // Use the rootReducer function here
});

export default store;
