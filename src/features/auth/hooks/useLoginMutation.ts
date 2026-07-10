"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { loginWithEmail, type LoginPayload } from "../api/auth";

type Props = {
  email: string;
  password: string;
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) =>
      loginWithEmail(payload),
    onMutate: () => {
      setIsSubmitting(true);
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries();

      if (result.session) {
        toast.success("Signed in successfully");
      } else {
        toast.success(
          "Check your email to confirm your account"
        );
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign in";
      toast.error(message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  return { ...mutation, isSubmitting };
};
