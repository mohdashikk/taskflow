"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "./theme";
import { useAppSelector } from "@/lib/redux/hooks";

export default function MuiThemeProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const theme = getTheme(themeMode);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />{children} 
    </ThemeProvider>
  );
}
