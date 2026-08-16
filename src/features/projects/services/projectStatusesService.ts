import { supabase } from "@/lib/supabase/client";
import type { ProjectStatusRow } from "../data/mockData";

const DEFAULT_STATUSES = [
  { name: "To Do", color: "#64748b", position: 0, is_default: true },
  { name: "In Progress", color: "#f59e0b", position: 1, is_default: false },
  { name: "Done", color: "#10b981", position: 2, is_default: false },
] as const;

export const fetchProjectStatuses = async (
  projectId?: string,
): Promise<ProjectStatusRow[]> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  let query = supabase
    .from("project_statuses")
    .select("id, name, color, position, is_default, created_at")
    .order("position", { ascending: true });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (!error && projectId && (!data || data.length === 0)) {
    console.warn(
      `[fetchProjectStatuses] WARNING: project_statuses table returned 0 rows for projectId="${projectId}". ` +
      `Verify that project_statuses.project_id exactly matches projects.id (case-sensitive UUID), ` +
      `and that RLS policies allow SELECT on project_statuses.`
    );
  }

  if (error) {
    console.error("[fetchProjectStatuses] Supabase error:", {
      code: (error as { code?: string }).code,
      message: (error as { message?: string }).message,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
      projectId,
    });
    throw error;
  }

  return data ?? [];
};

export const createDefaultStatuses = async (projectId: string): Promise<ProjectStatusRow[]> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const rows = DEFAULT_STATUSES.map((s) => ({
    project_id: projectId,
    name: s.name,
    color: s.color,
    position: s.position,
    is_default: s.is_default,
  }));

  const { data, error } = await supabase
    .from("project_statuses")
    .insert(rows)
    .select("id, name, color, position, is_default, created_at");

  if (error) {
    console.error("[createDefaultStatuses] Supabase insert error:", {
      code: (error as { code?: string }).code,
      message: (error as { message?: string }).message,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
      projectId,
    });
    throw error;
  }

  return data ?? [];
};

export const deleteProjectStatus = async (statusId: string): Promise<void> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const { error } = await supabase.from("project_statuses").delete().eq("id", statusId);

  if (error) {
    console.error("[deleteProjectStatus] Supabase delete error:", {
      code: (error as { code?: string }).code,
      message: (error as { message?: string }).message,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
      statusId,
    });
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to delete board.";
    throw new Error(message);
  }
};

export const createProjectStatus = async (
  projectId: string,
  name: string,
  color: string,
): Promise<ProjectStatusRow> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const { data: existing } = await supabase
    .from("project_statuses")
    .select("position")
    .eq("project_id", projectId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextPosition = (existing?.position ?? -1) + 1;

  const { data, error } = await supabase
    .from("project_statuses")
    .insert({
      project_id: projectId,
      name: name.trim(),
      color: color.trim(),
      position: nextPosition,
      is_default: false,
    })
    .select("id, name, color, position, is_default, created_at")
    .single();

  if (error) {
    console.error("[createProjectStatus] Supabase insert error:", {
      code: (error as { code?: string }).code,
      message: (error as { message?: string }).message,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
      projectId,
      name,
    });
    throw error;
  }

  if (!data) {
    throw new Error("Failed to create project status.");
  }

  return data as ProjectStatusRow;
};
