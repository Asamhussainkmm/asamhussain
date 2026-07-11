import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/portfolio/Contact";
import { PageShell } from "@/components/portfolio/PageShell";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Asam Hussain" },
      {
        name: "description",
        content: "Get in touch with Asam Hussain for remote senior full-stack engineering roles.",
      },
      { property: "og:url", content: `${SITE_URL}/contact` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
  }),
  component: () => (
    <PageShell>
      <Contact />
    </PageShell>
  ),
});
