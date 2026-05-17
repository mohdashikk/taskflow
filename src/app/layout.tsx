import type { Metadata } from "next";
import ReduxProvider from "@/lib/redux/provider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import MuiThemeProvider from "@/design-system/MuiThemeProvider";
import Providers from "@/provider/Providers";

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "Task management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <AppRouterCacheProvider>
          <ReduxProvider>
           
            <Providers>
               <MuiThemeProvider>{children}</MuiThemeProvider>
            </Providers>
          </ReduxProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
