import { supabase } from "@/lib/supabase/client";

export interface NewMilestone {
  title: string;
  due_date: string | null;
  status: "upcoming" | "in_progress" | "completed";
}

export interface MilestoneRow extends NewMilestone {
  id: string;
  project_id: string;
  user_id: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export async function fetchMilestones(projectId: string, userId: string): Promise<MilestoneRow[]> {
  if (!supabase) throw new Error("Supabase is not configured.");
  const { data, error } = await supabase
    .from("project_milestones")
    .select("id, project_id, user_id, title, description, due_date, status, position, created_at, updated_at")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as MilestoneRow[];
}

export async function createMilestones(projectId: string, userId: string, milestones: NewMilestone[]) {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const rows = milestones
    .filter((milestone) => milestone.title.trim())
    .map((milestone, position) => ({
      project_id: projectId,
      user_id: userId,
      title: milestone.title.trim(),
      due_date: milestone.due_date || null,
      status: milestone.status,
      position,
    }));

  if (!rows.length) return [];
  const { data, error } = await supabase.from("project_milestones").insert(rows).select();
  if (error) throw error;
  return data ?? [];
}

export async function replaceMilestones(projectId: string, userId: string, milestones: NewMilestone[]) {
  if (!supabase) throw new Error("Supabase is not configured.");

  const { error } = await supabase
    .from("project_milestones")
    .delete()
    .eq("project_id", projectId)
    .eq("user_id", userId);
  if (error) throw error;

  return createMilestones(projectId, userId, milestones);
}
