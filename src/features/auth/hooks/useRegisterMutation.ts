"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { registerWithEmail, type RegisterPayload } from "../api/auth";

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const mutation = useMutation({
    mutationFn: (payload: RegisterPayload) =>
      registerWithEmail(payload),
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: async (_result) => {
      await queryClient.invalidateQueries();
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  return { ...mutation, isSubmitting };
};
