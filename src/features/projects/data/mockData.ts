export type ProjectStatus = "active" | "planning" | "completed" | "archived";

export interface ProjectStatusRow {
  id: string;
  name: string;
  color: string;
  position: number;
  is_default: boolean;
  created_at: string;
}

/**
 * Raw row shape from the `projects` Supabase table.
 * Only the columns required by the current UI are selected.
 */
export interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
}

/**
 * Domain model consumed by the UI (ProjectCard).
 * `tasksDone` / `tasksTotal` are static placeholders until task
 * management is implemented in a later phase.
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  dueDate: string;
  tasksDone: number;
  tasksTotal: number;
  created_at: string;
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: "Active",
  planning: "Planning",
  completed: "Completed",
  archived: "Archived",
};

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  active: "#2563eb",
  planning: "#f59e0b",
  completed: "#10b981",
  archived: "#64748b",
};

const STATUS_SET: ReadonlySet<ProjectStatus> = new Set<ProjectStatus>([
  "active",
  "planning",
  "completed",
  "archived",
]);

const normalizeStatus = (value: string): ProjectStatus =>
  STATUS_SET.has(value as ProjectStatus) ? (value as ProjectStatus) : "planning";

const formatDueDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const toProject = (row: ProjectRow): Project => ({
  id: row.id,
  name: row.title,
  description: row.description ?? "",
  status: normalizeStatus(row.status),
  dueDate: row.due_date ? formatDueDate(row.due_date) : "—",
  tasksDone: 0,
  tasksTotal: 0,
  created_at: row.created_at,
});
