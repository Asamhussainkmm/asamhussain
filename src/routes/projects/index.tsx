import { createFileRoute } from "@tanstack/react-router";
import { Projects } from "@/components/portfolio/Projects";
import { PageShell } from "@/components/portfolio/PageShell";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Asam Hussain" },
      {
        name: "description",
        content: "Selected projects and case studies by Asam Hussain, Senior Full-Stack Engineer.",
      },
    ],
  }),
  component: () => (
    <PageShell>
      <Projects />
    </PageShell>
  ),
});
