import { supabase } from "@/lib/supabase/client";
import type { ProjectRow } from "../data/mockData";

export const fetchUserProjects = async (
  userId: string,
): Promise<ProjectRow[]> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, status, due_date, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};

export interface CreateProjectInput {
  title: string;
  description: string;
  status: string;
  due_date: string | null;
  user_id: string;
}

export const createProject = async (
  input: CreateProjectInput,
): Promise<ProjectRow> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const payload: Record<string, unknown> = {
    title: input.title,
    description: input.description,
    status: input.status,
    user_id: input.user_id,
  };
  if (input.due_date) {
    payload.due_date = input.due_date;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select("id, title, description, status, due_date, created_at")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Failed to create project.");
  }

  return data as ProjectRow;
};
