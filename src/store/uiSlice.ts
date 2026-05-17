import { createSlice } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  themeMode: 'light' | 'dark';
}

const initialState: UIState = {
  sidebarOpen: true,
  themeMode: 'dark',
};

const uiSlice = createSlice({
  name: 'ui',

  initialState,

  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    toggleTheme: (state) => {
      state.themeMode =
        state.themeMode === 'dark' ? 'light' : 'dark';
    },
  },
});

export const { toggleSidebar, toggleTheme } = uiSlice.actions;

export default uiSlice.reducer;