import { createFileRoute } from "@tanstack/react-router";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { PageShell } from "@/components/portfolio/PageShell";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Asam Hussain" },
      {
        name: "description",
        content: "What founders and hiring managers say about working with Asam Hussain.",
      },
      { property: "og:url", content: `${SITE_URL}/testimonials` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/testimonials` }],
  }),
  component: () => (
    <PageShell>
      <Testimonials />
    </PageShell>
  ),
});
