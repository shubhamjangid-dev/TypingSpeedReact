import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserLoggedIn: false,
  userData: null,
  levelArray: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
      if (action.payload == null) state.isUserLoggedIn = false;
      else state.isUserLoggedIn = true;
    },
    setLevelArray: (state, action) => {
      state.levelArray = action.payload;
    },
  },
});

export const { setUserData, setLevelArray } = userSlice.actions;

export default userSlice;
