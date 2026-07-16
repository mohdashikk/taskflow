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
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      {!isAuthScreen && <Header />}
      <Box sx={{ display: "flex", flexGrow: 1 }}>
        {!isAuthScreen && <Sidebar />}
        <Box component="main" sx={{ flexGrow: 1, p: 3, minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
