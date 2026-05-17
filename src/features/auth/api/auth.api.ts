import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const authApi = {
  signUp: async (
    email: string,
    password: string
  ) => {
    const { data, error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  signIn: async (
    email: string,
    password: string
  ) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  signOut: async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },
};