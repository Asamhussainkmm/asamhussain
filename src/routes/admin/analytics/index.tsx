import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/admin/AdminShell";
import { usePageViewStats } from "@/lib/analytics";

export const Route = createFileRoute("/admin/analytics/")({
  component: AdminAnalytics,
});

function AdminAnalytics() {
  const { data: stats, isLoading } = usePageViewStats();
  const max = stats?.byPath[0]?.count ?? 1;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
      <p className="text-sm text-muted-foreground mt-1">Page views logged from the live site.</p>

      {isLoading && <p className="text-sm text-muted-foreground mt-6">Loading…</p>}

      {stats && (
        <>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground mt-1">Total page views</div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="text-3xl font-bold text-foreground">{stats.last7Days}</div>
              <div className="text-sm text-muted-foreground mt-1">Last 7 days</div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Views by page</h2>
            {stats.byPath.map((p) => (
              <div key={p.path} className="flex items-center gap-3">
                <div className="w-32 shrink-0 text-sm text-foreground/80 truncate">{p.path}</div>
                <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(p.count / max) * 100}%` }}
                  />
                </div>
                <div className="w-10 text-right text-sm text-muted-foreground">{p.count}</div>
              </div>
            ))}
            {stats.byPath.length === 0 && (
              <p className="text-sm text-muted-foreground">No page views logged yet.</p>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
}
