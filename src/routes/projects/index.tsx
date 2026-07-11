import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "@/components/portfolio/Projects";
import { PageShell } from "@/components/portfolio/PageShell";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Asam Hussain" },
      {
        name: "description",
        content: "Selected projects and case studies by Asam Hussain, Senior Full-Stack Engineer.",
      },
      { property: "og:url", content: `${SITE_URL}/projects` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/projects` }],
  }),
  component: () => (
    <PageShell>
      <Projects />
    </PageShell>
  ),
});
