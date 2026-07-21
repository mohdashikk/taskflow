"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AUTH_ROUTES = ["/", "/login", "/register"];

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isAuthScreen = AUTH_ROUTES.includes(pathname);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {!isAuthScreen && <Sidebar />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
          transition: "margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {!isAuthScreen && <Header />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            minWidth: 0,
            maxWidth: 1440,
            mx: "auto",
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
