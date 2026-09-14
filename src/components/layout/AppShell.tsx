"use client";

import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import { useAuth } from "@/features/auth/hooks/useAuth";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AUTH_ROUTES = ["/", "/login", "/register"];

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const isAuthScreen = AUTH_ROUTES.includes(pathname) || !isAuthenticated || isLoading;
  const isProjectScreen = pathname.startsWith("/projects/");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        backgroundImage: "none",
        position: "relative",
      }}
    >
      {!isAuthScreen && (
        <>
          <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              flexShrink: 0,
              position: "sticky",
              top: 0,
              height: "100vh",
              alignSelf: "flex-start",
            }}
          >
            <Sidebar open={true} onClose={() => {}} permanent />
          </Box>
        </>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        {!isAuthScreen && <Header onMobileMenuToggle={handleDrawerToggle} />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4, xl: 5 },
            minWidth: 0,
            width: "100%",
            ...(isProjectScreen ? {} : { maxWidth: 1920, mx: "auto" }),
            ...(pathname === "/dashboard" ? { bgcolor: "background.default" } : {}),
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
