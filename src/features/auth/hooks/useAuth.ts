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
        return null;
      }

      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        return data.user ?? null;
      } catch (e) {
        return null;
      }
    },
    retry: false,
  });

  useEffect(() => {
    if (!supabase) return;

    let subscription: { unsubscribe: () => void } | null = null;

    try {
      const { data } = supabase.auth.onAuthStateChange(
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

      subscription = data.subscription;
    } catch (e) {
      return;
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [queryClient]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    error,
  };
};
