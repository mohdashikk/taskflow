"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { updateProfile, type UpdateProfilePayload } from "@/features/auth/api/auth";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      updateProfile(payload),
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  return { ...mutation, isSubmitting };
};
