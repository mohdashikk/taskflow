import ProjectWorkspaceLayout from "@/features/projects/components/ProjectWorkspaceLayout";

export default function ProjectWorkspaceLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectWorkspaceLayout>{children}</ProjectWorkspaceLayout>;
}
