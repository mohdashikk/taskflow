"use client";

import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

import { authApi } from "../api/auth.api";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      fullName,
      email,
      password,
    }: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      return authApi.signUp(fullName, email, password);
    },

    onSuccess: () => {
      router.push("/login");
    },
  });
}
