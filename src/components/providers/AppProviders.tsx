"use client";

import { type ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import ReduxProvider from "@/store/providers";
import ReactQueryProvider from "@/lib/react-query/provider";
import AppThemeProvider from "@/theme/ThemeProvider";

export default function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ReduxProvider>
        <ReactQueryProvider>
          <AppThemeProvider>{children}</AppThemeProvider>
        </ReactQueryProvider>
      </ReduxProvider>
    </AppRouterCacheProvider>
  );
}
