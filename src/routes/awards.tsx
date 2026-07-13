import { createFileRoute } from "@tanstack/react-router";
import { Awards } from "@/components/portfolio/Awards";
import { PageShell } from "@/components/portfolio/PageShell";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "Awards & Certificates — Asam Hussain" },
      {
        name: "description",
        content: "Awards and certifications earned by Asam Hussain, Senior Full-Stack Engineer.",
      },
      { property: "og:url", content: `${SITE_URL}/awards` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/awards` }],
  }),
  component: () => (
    <PageShell>
      <Awards />
    </PageShell>
  ),
});
