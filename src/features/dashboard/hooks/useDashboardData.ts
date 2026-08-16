import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProjects } from "@/features/projects/hooks/useProjects";
import { fetchTasksByProject, type TaskRow } from "@/features/tasks/services/tasksService";
import type { Project } from "@/features/projects/data/mockData";

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
  title: string;
  dueDate: string;
  projectName: string;
  status: string;
}

export function useDashboardData() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;
  
  const projectsQuery = useProjects(userId);
  const projects = projectsQuery.data ?? [];

  const allTasksQuery = useQuery({
    queryKey: ["all-dashboard-tasks", userId],
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

  const stats: DashboardStats = {
    totalProjects: projects.length,
    openTasks: allTasks.filter(t => t.completed_at === null).length,
    dueToday: allTasks.filter(t => {
      if (!t.due_date) return false;
      const today = new Date().toISOString().split("T")[0];
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
      projectName: projects.find(p => p.id === t.project_id)?.name ?? "Unknown Project",
      priority: t.priority,
      dueDate: t.due_date,
      status: t.status_id,
    }));

  const upcomingDeadlines: UpcomingDeadline[] = allTasks
    .filter(t => t.due_date && t.completed_at === null)
    .sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""))
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      title: t.title,
      dueDate: t.due_date ?? "",
      projectName: projects.find(p => p.id === t.project_id)?.name ?? "Unknown Project",
      status: t.status_id,
    }));

  const recentProjects = [...projects]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5);

  return {
    projects,
    tasks: allTasks,
    stats,
    continueWorking,
    upcomingDeadlines,
    recentProjects,
    isLoading: projectsQuery.isLoading || allTasksQuery.isLoading,
  };
}
