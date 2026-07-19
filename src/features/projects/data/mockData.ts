export type ProjectStatus = "active" | "planning" | "completed" | "archived";

export interface Project {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  status: ProjectStatus;
  progress: number;
  tasksDone: number;
  tasksTotal: number;
  dueDate: string;
}

const palette = [
  "#2563eb",
  "#7c3aed",
  "#0ea5e9",
  "#f59e0b",
  "#ef4444",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
];

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

export const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Website Revamp",
    description:
      "Redesign the marketing website with a fresh design system, improved performance, and better conversion flows.",
    icon: "🌐",
    color: palette[0],
    status: "active",
    progress: 72,
    tasksDone: 18,
    tasksTotal: 25,
    dueDate: "Jul 30, 2026",
  },
  {
    id: "p2",
    name: "Mobile App Launch",
    description:
      "Ship the cross-platform mobile app to the App Store and Google Play with onboarding and payments.",
    icon: "📱",
    color: palette[1],
    status: "active",
    progress: 45,
    tasksDone: 11,
    tasksTotal: 24,
    dueDate: "Aug 14, 2026",
  },
  {
    id: "p3",
    name: "Q3 Marketing Plan",
    description:
      "Define the quarterly marketing strategy, channel mix, and campaign calendar for the next quarter.",
    icon: "📈",
    color: palette[2],
    status: "planning",
    progress: 30,
    tasksDone: 6,
    tasksTotal: 20,
    dueDate: "Sep 01, 2026",
  },
  {
    id: "p4",
    name: "Mobile App Redesign",
    description:
      "Plan the next-generation mobile experience with a new navigation model and component refresh.",
    icon: "📱",
    color: palette[6],
    status: "planning",
    progress: 12,
    tasksDone: 3,
    tasksTotal: 28,
    dueDate: "Oct 10, 2026",
  },
  {
    id: "p5",
    name: "Customer Portal",
    description:
      "Self-service portal where customers manage subscriptions, invoices, and support tickets.",
    icon: "🛠️",
    color: palette[3],
    status: "active",
    progress: 58,
    tasksDone: 14,
    tasksTotal: 24,
    dueDate: "Aug 05, 2026",
  },
  {
    id: "p6",
    name: "Brand Refresh",
    description:
      "Updated logo, typography, and color palette applied across all product surfaces and documents.",
    icon: "🎨",
    color: palette[4],
    status: "completed",
    progress: 100,
    tasksDone: 22,
    tasksTotal: 22,
    dueDate: "Jun 30, 2026",
  },
  {
    id: "p7",
    name: "Data Migration",
    description:
      "Move legacy customer data into the new warehouse with validation and rollback safeguards.",
    icon: "🗄️",
    color: palette[5],
    status: "archived",
    progress: 100,
    tasksDone: 30,
    tasksTotal: 30,
    dueDate: "May 15, 2026",
  },
];
