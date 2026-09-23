import { supabase } from "@/lib/supabase/client";

export interface ProjectDocumentRow {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export async function fetchProjectDocuments(projectId: string, userId: string): Promise<ProjectDocumentRow[]> {
  const { data, error } = await supabase
    .from("project_documents")
    .select("id, project_id, user_id, title, content, created_at, updated_at")
    .eq("project_id", projectId)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ProjectDocumentRow[];
}
