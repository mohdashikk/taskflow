"use client";

import ReduxProvider from "@/store/providers";
import ReactQueryProvider from "@/lib/react-query/provider";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        {children}
      </ReactQueryProvider>
    </ReduxProvider>
  );
}