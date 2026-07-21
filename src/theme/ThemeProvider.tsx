"use client";

import { useMemo, useEffect, type ReactNode } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { getTheme } from "./theme";
import { useAppSelector } from "@/store/hooks";

export default function AppThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const mode = useAppSelector((state) => state.theme.mode);

  const theme = useMemo(() => getTheme(mode), [mode]);

  useEffect(() => {
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
