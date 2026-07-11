import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Built with Next.js & Tailwind</span>
        <div className="flex items-center gap-4">
          <span>© 2026 Asam Hussain</span>
          <Link to="/admin" className="hover:text-foreground transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}