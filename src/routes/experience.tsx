import { createFileRoute } from "@tanstack/react-router";
import { Experience } from "@/components/portfolio/Experience";
import { PageShell } from "@/components/portfolio/PageShell";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Asam Hussain" },
      {
        name: "description",
        content: "Work history and professional experience of Asam Hussain, Senior Full-Stack Engineer.",
      },
      { property: "og:url", content: `${SITE_URL}/experience` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/experience` }],
  }),
  component: () => (
    <PageShell>
      <Experience />
    </PageShell>
  ),
});
