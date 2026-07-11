import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/portfolio/Contact";
import { PageShell } from "@/components/portfolio/PageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Asam Hussain" },
      {
        name: "description",
        content: "Get in touch with Asam Hussain for remote senior full-stack engineering roles.",
      },
    ],
  }),
  component: () => (
    <PageShell>
      <Contact />
    </PageShell>
  ),
});
