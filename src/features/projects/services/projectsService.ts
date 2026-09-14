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
    .select("id, title, description, status, due_date, created_at, start_date")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  const projects = data ?? [];
  if (projects.length === 0) return [];

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select("project_id, completed_at")
    .eq("user_id", userId)
    .in("project_id", projects.map((project) => project.id));
  if (tasksError) throw tasksError;

  return projects.map((project) => ({
    ...project,
    tasks_total: tasks?.filter((task) => task.project_id === project.id).length ?? 0,
    tasks_done: tasks?.filter((task) => task.project_id === project.id && task.completed_at !== null).length ?? 0,
  }));
};

export interface CreateProjectInput {
  title: string;
  description: string;
  status: string;
  due_date: string | null;
  user_id: string;
  start_date?: string | null;
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
  if (input.start_date) payload.start_date = input.start_date;

  const { data, error } = await supabase
    .from("projects")
    .insert(payload)
    .select("id, title, description, status, due_date, created_at, start_date")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Failed to create project.");
  }

  return data as ProjectRow;
};

export interface UpdateProjectInput {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  start_date?: string | null;
}

export const updateProject = async (
  input: UpdateProjectInput,
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
    start_date: input.start_date ?? null,
    due_date: input.due_date ?? null,
  };

  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", input.id)
    .select("id, title, description, status, due_date, created_at, start_date")
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Failed to update project.");
  }

  return data as ProjectRow;
};

export const fetchProject = async (
  id: string,
  userId: string,
): Promise<ProjectRow> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, status, due_date, created_at, start_date")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("Project not found.");
  }

  return data as ProjectRow;
};

export const deleteProject = async (id: string): Promise<void> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
};
