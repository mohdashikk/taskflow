'use client';

import { useMutation } from '@tanstack/react-query';

import { useRouter } from 'next/navigation';

import { authApi } from '../api/auth.api';

import { useAppDispatch } from '@/lib/redux/hooks';

import { setUser } from '@/store/authSlice';

export function useLogin() {
  const router = useRouter();

  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return authApi.signIn(email, password);
    },

    onSuccess: (data) => {
      if (!data.user) return;

      dispatch(
        setUser({
          id: data.user.id,
          email: data.user.email!,
        })
      );

      router.push('/dashboard');
    },
  });
}