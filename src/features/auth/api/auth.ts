import { supabase } from "@/lib/supabase/client";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  displayName: string;
  email: string;
  password: string;
};

export const loginWithEmail = async (payload: LoginPayload) => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) {
    throw error;
  }

  return data;
};

export type UpdateProfilePayload = {
  displayName?: string;
  email?: string;
  password?: string;
};

export const updateProfile = async (payload: UpdateProfilePayload) => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
    );
  }

  const updateData: Record<string, unknown> = {};

  if (payload.displayName !== undefined) {
    updateData.data = {
      display_name: payload.displayName,
    };
  }

  if (payload.email !== undefined) {
    updateData.email = payload.email;
  }

  if (payload.password !== undefined) {
    updateData.password = payload.password;
  }

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) {
    throw error;
  }

  return data;
};

export const registerWithEmail = async (payload: RegisterPayload) => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local."
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        display_name: payload.displayName,
      },
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

