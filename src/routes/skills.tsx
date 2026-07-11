import { createFileRoute } from "@tanstack/react-router";
import { Skills } from "@/components/portfolio/Skills";
import { PageShell } from "@/components/portfolio/PageShell";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Asam Hussain" },
      {
        name: "description",
        content: "Technical skills and stack: React, Next.js, TypeScript, FastAPI, GCP, Firebase, and more.",
      },
      { property: "og:url", content: `${SITE_URL}/skills` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/skills` }],
  }),
  component: () => (
    <PageShell>
      <Skills />
    </PageShell>
  ),
});
