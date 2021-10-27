import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import chatReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    authState: authReducer,
    chatState: chatReducer,
  },
});
