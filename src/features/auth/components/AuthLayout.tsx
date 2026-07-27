"use client";

import type { ReactNode } from "react";
import ThemeSwitcher from "./ThemeSwitcher";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({
  children,
}: AuthLayoutProps) {
  return (
    <main
      className="min-h-screen w-full flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #F7F8FA 0%, #E8ECF1 100%)",
      }}
    >
      <header
        className="flex items-center justify-end px-6 py-4 sm:px-8"
        style={{ height: 72 }}
      >
        <ThemeSwitcher />
      </header>
      <section
        className="flex items-center justify-center px-6 py-10 sm:px-8"
        style={{
          minHeight: "calc(100vh - 72px)",
        }}
      >
        <div className="w-full max-w-[420px]">{children}</div>
      </section>
    </main>
  );
}
