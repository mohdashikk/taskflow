import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { fetchTasksByProject, type TaskRow } from "@/features/tasks/services/tasksService";

export interface DashboardStats {
  totalProjects: number;
  openTasks: number;
  dueToday: number;
  completedTasks: number;
}

export interface ContinueWorkingItem {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  priority: string;
  dueDate: string | null;
  status: string;
}

export interface UpcomingDeadline {
  id: string;
  projectId: string;
  title: string;
  dueDate: string;
  projectName: string;
  status: string;
}

export interface DashboardActivity {
  id: string;
  action: string;
  target: string;
  time: string;
  type: "task" | "project" | "comment" | "update";
}

export function useDashboardData() {
  const { user } = useAuth();
  const userId = user?.id;
  
  const projectsQuery = useProjects(userId);
  const projects = projectsQuery.data ?? [];

  const allTasksQuery = useQuery({
    queryKey: ["all-dashboard-tasks", userId, projects.map(p => p.id)],
    queryFn: async (): Promise<TaskRow[]> => {
      if (!userId || projects.length === 0) return [];
      
      const taskPromises = projects.map(project => 
        fetchTasksByProject(project.id, userId)
      );
      
      const results = await Promise.all(taskPromises);
      return results.flat();
    },
    enabled: Boolean(userId && projects.length > 0),
    staleTime: 30_000,
  });

  const allTasks = allTasksQuery.data ?? [];
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const projectNames = new Map(projects.map(project => [project.id, project.name]));

  const stats: DashboardStats = {
    totalProjects: projects.length,
    openTasks: allTasks.filter(t => t.completed_at === null).length,
    dueToday: allTasks.filter(t => {
      if (!t.due_date) return false;
      return t.due_date === today && t.completed_at === null;
    }).length,
    completedTasks: allTasks.filter(t => t.completed_at !== null).length,
  };

  const continueWorking: ContinueWorkingItem[] = allTasks
    .filter(t => t.completed_at === null)
    .sort((a, b) => {
      if (a.due_date && !b.due_date) return -1;
      if (!a.due_date && b.due_date) return 1;
      if (a.due_date && b.due_date) return a.due_date.localeCompare(b.due_date);
      return b.created_at.localeCompare(a.created_at);
    })
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      title: t.title,
      projectId: t.project_id,
      projectName: projectNames.get(t.project_id) ?? "Unknown Project",
      priority: t.priority,
      dueDate: t.due_date,
      status: t.status_id,
    }));

  const todayTasks = allTasks
    .filter(t => t.due_date === today && t.completed_at === null)
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      title: t.title,
      projectId: t.project_id,
      projectName: projectNames.get(t.project_id) ?? "Unknown Project",
      priority: t.priority,
      dueDate: t.due_date,
      completed: false,
    }));

  const upcomingDeadlines: UpcomingDeadline[] = allTasks
    .filter(t => t.due_date && t.completed_at === null)
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""))
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      title: t.title,
      dueDate: t.due_date ?? "",
      projectId: t.project_id,
      projectName: projectNames.get(t.project_id) ?? "Unknown Project",
      status: t.status_id,
    }));

  const recentProjects = [...projects]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  const taskCount = allTasks.length;
  const completedCount = stats.completedTasks;
  const goals = [
    {
      id: "task-completion",
      title: "Tasks completed",
      progress: taskCount ? Math.round((completedCount / taskCount) * 100) : 0,
      target: `${completedCount} of ${taskCount}`,
    },
    {
      id: "projects-completed",
      title: "Projects completed",
      progress: projects.length ? Math.round((projects.filter(p => p.status === "completed").length / projects.length) * 100) : 0,
      target: `${projects.filter(p => p.status === "completed").length} of ${projects.length}`,
    },
  ];

  const activity: DashboardActivity[] = [
    ...allTasks.map(task => ({
      id: `task-${task.id}`,
      action: task.completed_at ? "Completed task" : "Updated task",
      target: task.title,
      time: task.completed_at ?? task.updated_at,
      type: (task.completed_at ? "task" : "update") as DashboardActivity["type"],
    })),
    ...projects.map(project => ({
      id: `project-${project.id}`,
      action: "Created project",
      target: project.name,
      time: project.created_at,
      type: "project" as const,
    })),
  ]
    .sort((a, b) => b.time.localeCompare(a.time))
    .slice(0, 6)
    .map(item => ({
      ...item,
      time: new Date(item.time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

  return {
    projects,
    tasks: allTasks,
    stats,
    continueWorking,
    todayTasks,
    upcomingDeadlines,
    recentProjects,
    goals,
    activity,
    isLoading: projectsQuery.isLoading || allTasksQuery.isLoading,
    error: projectsQuery.error || allTasksQuery.error,
  };
}
