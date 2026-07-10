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
    <main className="min-h-screen w-full flex flex-col">
      <header className="flex items-center justify-end px-6 py-4 sm:px-8">
        <ThemeSwitcher />
      </header>
      <section className="flex min-h-[calc(100vh-64px)] items-center justify-center px-6 py-10 sm:px-8">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </section>
    </main>
  );
}
