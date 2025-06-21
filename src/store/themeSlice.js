import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'light', // light, dark, or system
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = themeSlice.actions;
export default themeSlice.reducer;
