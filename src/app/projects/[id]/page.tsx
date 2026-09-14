import { redirect } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectRedirect({ params }: PageProps) {
  const { id } = await params;
  redirect(`/projects/${id}/overview`);
}
