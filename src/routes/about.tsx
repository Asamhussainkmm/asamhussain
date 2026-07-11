import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/portfolio/About";
import { PageShell } from "@/components/portfolio/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Asam Hussain" },
      {
        name: "description",
        content: "About Asam Hussain, Senior Full-Stack Engineer with 5+ years shipping production products end-to-end.",
      },
    ],
  }),
  component: () => (
    <PageShell>
      <About />
    </PageShell>
  ),
});
