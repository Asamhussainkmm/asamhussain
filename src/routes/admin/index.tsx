import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { useProjects } from "@/lib/projects";
import { useTestimonialsList } from "@/lib/testimonials";
import { useMessages } from "@/lib/messages";
import { usePageViewStats } from "@/lib/analytics";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data: projects } = useProjects();
  const { data: testimonials } = useTestimonialsList();
  const { data: messages } = useMessages();
  const { data: stats } = usePageViewStats();
  const unread = messages?.filter((m) => !m.read).length ?? 0;

  const cards = [
    { label: "Projects", value: projects?.length ?? 0, to: "/admin/projects" },
    { label: "Testimonials", value: testimonials?.length ?? 0, to: "/admin/testimonials" },
    { label: "Unread messages", value: unread, to: "/admin/messages" },
    { label: "Page views (7d)", value: stats?.last7Days ?? 0, to: "/admin/analytics" },
  ];

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Everything here writes straight to Firestore — the live site picks it up immediately.
      </p>
      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors"
          >
            <div className="text-3xl font-bold text-foreground">{c.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
