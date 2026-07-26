"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AUTH_ROUTES = ["/", "/login", "/register"];

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const theme = useTheme();
  const isAuthScreen = AUTH_ROUTES.includes(pathname);
  const isProjectScreen = pathname.startsWith("/projects/");
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.paper",
       backgroundImage: isDark
         ? `
           radial-gradient(at 0% 0%, rgba(113, 90, 248, 0.06) 0px, transparent 50%),
           radial-gradient(at 100% 0%, rgba(113, 90, 248, 0.04) 0px, transparent 50%),
           radial-gradient(at 100% 100%, rgba(113, 90, 248, 0.03) 0px, transparent 50%),
           radial-gradient(at 0% 100%, rgba(113, 90, 248, 0.02) 0px, transparent 50%)
         `
         : "none",
         position: "relative",
       }}
     >
       {isDark && (
         <Box
           sx={{
             position: "absolute",
             inset: 0,
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23715AF8' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
             pointerEvents: "none",
             zIndex: 0,
           }}
         />
       )}
       {!isAuthScreen && <Sidebar />}
       <Box
         sx={{
           display: "flex",
           flexDirection: "column",
           flexGrow: 1,
           minWidth: 0,
           position: "relative",
           zIndex: 1,
           transition: "margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1)",
         }}
       >
         {!isAuthScreen && <Header />}
         <Box
           component="main"
           sx={{
             flexGrow: 1,
             p: { xs: 2.5, sm: 3, md: 4 },
             minWidth: 0,
             width: "100%",
             ...(isProjectScreen ? {} : { maxWidth: 1440, mx: "auto" }),
           }}
         >
           {children}
         </Box>
       </Box>
     </Box>
  );
}