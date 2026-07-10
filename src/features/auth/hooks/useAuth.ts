"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase/client";

export const useAuth = () => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!supabase) {
        throw new Error(
          "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
        );
      }

      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    },
    retry: false,
  });

  useEffect(() => {
    if (!supabase) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (
          event === "SIGNED_IN" ||
          event === "SIGNED_OUT" ||
          event === "TOKEN_REFRESHED" ||
          event === "USER_UPDATED"
        ) {
          queryClient.invalidateQueries({
            queryKey: ["currentUser"],
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
  };
};
