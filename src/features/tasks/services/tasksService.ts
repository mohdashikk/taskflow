import { supabase } from "@/lib/supabase/client";

export interface CreateTaskInput {
  project_id: string;
  user_id: string;
  title: string;
  status_id?: string | null;
  description?: string | null;
  priority: string;
  start_date?: string | null;
  due_date?: string | null;
}

export interface TaskRow {
  id: string;
  project_id: string;
  user_id: string;
  status_id: string;
  title: string;
  description: string | null;
  priority: string;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export const createTask = async (input: CreateTaskInput): Promise<TaskRow> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  let statusId = input.status_id?.trim() || "";

  if (!statusId) {
    const { data: defaultStatus } = await supabase
      .from("project_statuses")
      .select("id")
      .eq("project_id", input.project_id)
      .eq("is_default", true)
      .order("position", { ascending: true })
      .maybeSingle();

    statusId = defaultStatus?.id ?? "";

    if (!statusId) {
      const { data: firstStatus } = await supabase
        .from("project_statuses")
        .select("id")
        .eq("project_id", input.project_id)
        .order("position", { ascending: true })
        .limit(1)
        .maybeSingle();

      statusId = firstStatus?.id ?? "";
    }
  }

  if (!statusId) {
    const message =
      "No workflow status is configured for this project. Please add a status in project settings.";
    throw new Error(message);
  }

  const { data: statusExists } = await supabase
    .from("project_statuses")
    .select("id")
    .eq("id", statusId)
    .eq("project_id", input.project_id)
    .maybeSingle();

  if (!statusExists) {
    const message = `Invalid status selected. Status "${statusId}" does not belong to project "${input.project_id}".`;
    throw new Error(message);
  }

  const payload: Record<string, unknown> = {
    project_id: input.project_id,
    user_id: input.user_id,
    title: input.title,
    status_id: statusId,
    priority: input.priority,
    position: 0,
  };

  if (input.description !== undefined && input.description !== null) {
    payload.description = input.description;
  }
  if (input.start_date !== undefined && input.start_date !== null) {
    payload.start_date = input.start_date;
  }
  if (input.due_date !== undefined && input.due_date !== null) {
    payload.due_date = input.due_date;
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert(payload)
    .select(
      "id, project_id, user_id, status_id, title, description, priority, start_date, due_date, completed_at, position, created_at, updated_at",
    )
    .single();

  if (error) {
    console.error("[createTask] Supabase insert error:", {
      code: (error as { code?: string }).code,
      message: (error as { message?: string }).message,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
      payload,
    });
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to create task.";
    throw new Error(message);
  }

  if (!data) {
    throw new Error("Failed to create task.");
  }

  return data as TaskRow;
};

export const fetchTasksByProject = async (
  projectId: string,
  userId: string,
): Promise<TaskRow[]> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const { data, error } = await supabase
    .from("tasks")
    .select(
      "id, project_id, user_id, status_id, title, description, priority, start_date, due_date, completed_at, position, created_at, updated_at",
    )
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to load tasks.";
    throw new Error(message);
  }

  return data ?? [];
};

export const deleteTask = async (taskId: string): Promise<void> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.error("[deleteTask] Supabase delete error:", {
      code: (error as { code?: string }).code,
      message: (error as { message?: string }).message,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
      taskId,
    });
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to delete task.";
    throw new Error(message);
  }
};

export const updateTaskStatus = async (
  taskId: string,
  projectId: string,
  statusId: string,
): Promise<TaskRow> => {
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
    );
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({ status_id: statusId })
    .eq("id", taskId)
    .eq("project_id", projectId)
    .select(
      "id, project_id, user_id, status_id, title, description, priority, start_date, due_date, completed_at, position, created_at, updated_at",
    )
    .single();

  if (error) {
    console.error("[updateTaskStatus] Supabase update error:", {
      code: (error as { code?: string }).code,
      message: (error as { message?: string }).message,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
      taskId,
      projectId,
      statusId,
    });
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "Failed to update task status.";
    throw new Error(message);
  }

  if (!data) {
    throw new Error("Failed to update task status.");
  }

  return data as TaskRow;
};
