import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useAuthUser, signOutUser } from "@/lib/auth";

const navItems = [
  { to: "/admin", label: "Dashboard" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/content", label: "Content" },
  { to: "/admin/analytics", label: "Analytics" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-muted-foreground text-sm">
        Loading…
      </div>
    );
  }

  if (!user) {
    navigate({ to: "/admin/login" });
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground grid md:grid-cols-[220px_1fr]">
      <aside className="border-r border-border p-6 space-y-8">
        <Link to="/admin" className="font-semibold tracking-tight block">
          asam<span className="text-primary">.</span> admin
        </Link>
        <nav className="flex flex-col gap-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/admin" }}
              className="rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-card transition-colors [&.active]:bg-card [&.active]:text-foreground"
              activeProps={{ className: "active" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="pt-4 border-t border-border space-y-2">
          <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          <button
            onClick={() => signOutUser()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
          <Link to="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
            View site →
          </Link>
        </div>
      </aside>
      <main className="p-6 md:p-10 max-w-4xl">{children}</main>
    </div>
  );
}
