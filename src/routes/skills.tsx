import { createFileRoute } from "@tanstack/react-router";
import { Skills } from "@/components/portfolio/Skills";
import { PageShell } from "@/components/portfolio/PageShell";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Asam Hussain" },
      {
        name: "description",
        content: "Technical skills and stack: React, Next.js, TypeScript, FastAPI, GCP, Firebase, and more.",
      },
    ],
  }),
  component: () => (
    <PageShell>
      <Skills />
    </PageShell>
  ),
});
