"use client";

import { type ReactNode } from "react";
import Box from "@mui/material/Box";
import { useAuthTheme } from "../hooks/useAuthTheme";
import ThemeSwitcher from "./ThemeSwitcher";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  const colors = useAuthTheme();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <header
        className="flex items-center justify-end px-6 py-4 sm:px-8"
        style={{ height: 72, position: "relative", zIndex: 1 }}
      >
        <ThemeSwitcher />
      </header>
      <section
        className="flex items-center justify-center px-6 py-10 sm:px-8"
        style={{
          minHeight: "calc(100vh - 72px)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="w-full max-w-[420px]">{children}</div>
      </section>
    </Box>
  );
}
