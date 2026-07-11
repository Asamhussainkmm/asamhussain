import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/portfolio/Experience";
import { PageShell } from "@/components/portfolio/PageShell";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Asam Hussain" },
      {
        name: "description",
        content: "Work history and professional experience of Asam Hussain, Senior Full-Stack Engineer.",
      },
    ],
  }),
  component: () => (
    <PageShell>
      <Experience />
    </PageShell>
  ),
});
