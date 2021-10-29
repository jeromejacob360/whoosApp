import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

export const authSlice = createSlice({
  name: "Where does this name show up?",
  initialState,
  reducers: {
    SIGN_IN_USER: (_, action) => {
      return { user: action.payload };
    },
    SIGN_OUT_USER: () => {
      return { user: null };
    },
  },
});

// Action creators are generated for each case reducer function
export const { SIGN_IN_USER, SIGN_OUT_USER } = authSlice.actions;

export default authSlice.reducer;
