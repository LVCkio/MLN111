// src/redux/features/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

const getInitialMode = () => {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: getInitialMode() },
  reducers: {
    setTheme: (state, action) => {
      state.mode = action.payload === "dark" ? "dark" : "light";
    },
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

// ⬇️ selector PHẢI phòng thủ khi state.theme chưa có (lần đầu HMR / chưa đăng ký)
export const selectThemeMode = (state) => state?.theme?.mode ?? "light";

export default themeSlice.reducer;
