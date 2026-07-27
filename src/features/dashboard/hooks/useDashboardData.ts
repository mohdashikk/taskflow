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

export interface RecentActivityItem {
  id: string;
  action: string;
  target: string;
  time: string;
  type: "task" | "project" | "comment";
}

export interface WeeklyProductivityData {
  day: string;
  completed: number;
  created: number;
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

  const recentActivity: RecentActivityItem[] = [
    ...allTasks
      .filter(t => t.completed_at)
      .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""))
      .slice(0, 3)
      .map(t => ({
        id: `task-${t.id}`,
        action: "Completed task",
        target: t.title,
        time: formatRelativeTime(t.completed_at),
        type: "task" as const,
      })),
    ...projects
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, 2)
      .map(p => ({
        id: `project-${p.id}`,
        action: "Created project",
        target: p.name,
        time: formatRelativeTime(p.created_at),
        type: "project" as const,
      })),
  ].sort((a, b) => b.time.localeCompare(a.time));

  const weeklyProductivity: WeeklyProductivityData[] = generateWeeklyData();

  return {
    projects,
    tasks: allTasks,
    stats,
    continueWorking,
    upcomingDeadlines,
    recentProjects,
    recentActivity,
    weeklyProductivity,
    isLoading: projectsQuery.isLoading || allTasksQuery.isLoading,
  };
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return "Just now";
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function generateWeeklyData(): WeeklyProductivityData[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date().getDay();
  const startOfWeek = new Date();
  startOfWeek.setDate(today - (today === 0 ? 6 : today - 1));
  
  return days.map((day, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    const isFuture = date > new Date();
    
    return {
      day,
      completed: isFuture ? 0 : Math.floor(Math.random() * 8) + 1,
      created: isFuture ? 0 : Math.floor(Math.random() * 5) + 1,
    };
  });
}
