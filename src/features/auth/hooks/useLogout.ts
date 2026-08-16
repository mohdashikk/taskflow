"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useCallback(async () => {
    try {
      await supabase?.auth.signOut();
    } catch {
      // ignore auth errors during logout
    } finally {
      try {
        localStorage.clear();
      } catch {
        // ignore localStorage errors
      }
      queryClient.clear();
      router.replace("/");
    }
  }, [router, queryClient]);
};
