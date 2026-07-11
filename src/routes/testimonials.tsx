import { createFileRoute } from "@tanstack/react-router";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { PageShell } from "@/components/portfolio/PageShell";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Testimonials — Asam Hussain" },
      {
        name: "description",
        content: "What founders and hiring managers say about working with Asam Hussain.",
      },
    ],
  }),
  component: () => (
    <PageShell>
      <Testimonials />
    </PageShell>
  ),
});
