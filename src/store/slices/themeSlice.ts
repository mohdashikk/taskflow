import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { ThemeMode } from "@/theme/theme";

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (
      state,
      action: PayloadAction<ThemeMode>
    ) => {
      state.mode = action.payload;
    },
    toggleTheme: (state) => {
      state.mode =
        state.mode === "light"
          ? "dark"
          : "light";
    },
  },
});

export const {
  setThemeMode,
  toggleTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
