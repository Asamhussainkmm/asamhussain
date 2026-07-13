import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AdminShell } from "@/components/admin/AdminShell";
import { usePageViewStats } from "@/lib/analytics";

export const Route = createFileRoute("/admin/analytics/")({
  component: AdminAnalytics,
});

function countryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "";
  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)),
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function AdminAnalytics() {
  const { data: stats, isLoading } = usePageViewStats();
  const maxPath = stats?.byPath[0]?.count ?? 1;
  const maxCountry = stats?.byCountry[0]?.count ?? 1;
  const maxReferrer = stats?.byReferrer[0]?.count ?? 1;
  const deviceTotal = stats?.byDevice.reduce((sum, d) => sum + d.count, 0) ?? 0;

  return (
    <AdminShell>
      <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
      <p className="text-sm text-muted-foreground mt-1">Visitor activity on the live site.</p>

      {isLoading && <p className="text-sm text-muted-foreground mt-6">Loading…</p>}

      {stats && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <StatTile label="Total views" value={stats.total} />
            <StatTile label="Unique visitors" value={stats.uniqueVisitors} />
            <StatTile label="Last 7 days" value={stats.last7Days} />
            <StatTile label="Last 30 days" value={stats.last30Days} />
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-4">
              Daily views — last 14 days
            </h2>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyTrend} barCategoryGap={4}>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tickLine={false}
                    axisLine={{ stroke: "var(--border)" }}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    interval={1}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                    width={28}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "var(--foreground)",
                    }}
                    labelFormatter={(v) => formatDate(String(v))}
                  />
                  <Bar dataKey="count" name="Views" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <RankedList
              title="Views by page"
              rows={stats.byPath.map((p) => ({ key: p.path, label: p.path, count: p.count }))}
              max={maxPath}
              empty="No page views logged yet."
            />
            <RankedList
              title="Views by country"
              rows={stats.byCountry.map((c) => ({
                key: c.country,
                label: `${countryFlag(c.countryCode)} ${c.country}`.trim(),
                count: c.count,
              }))}
              max={maxCountry}
              empty="No country data yet."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <RankedList
              title="Top referrers"
              rows={stats.byReferrer.map((r) => ({ key: r.referrer, label: r.referrer, count: r.count }))}
              max={maxReferrer}
              empty="No referrer data yet."
            />

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-sm font-medium text-muted-foreground mb-4">Device</h2>
              {deviceTotal === 0 ? (
                <p className="text-sm text-muted-foreground">No device data yet.</p>
              ) : (
                <>
                  <div className="flex h-3 w-full rounded-full overflow-hidden bg-border">
                    {stats.byDevice.map((d, i) => (
                      <div
                        key={d.device}
                        style={{
                          width: `${(d.count / deviceTotal) * 100}%`,
                          backgroundColor: i === 0 ? "var(--primary)" : "var(--accent-cyan)",
                        }}
                        className="h-full first:ml-0 [&:not(:first-child)]:ml-0.5"
                      />
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    {stats.byDevice.map((d, i) => (
                      <div key={d.device} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-foreground/80 capitalize">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: i === 0 ? "var(--primary)" : "var(--accent-cyan)" }}
                          />
                          {d.device}
                        </span>
                        <span className="text-muted-foreground">
                          {d.count} ({Math.round((d.count / deviceTotal) * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-2xl font-semibold text-foreground">{value.toLocaleString()}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function RankedList({
  title,
  rows,
  max,
  empty,
}: {
  title: string;
  rows: { key: string; label: string; count: number }[];
  max: number;
  empty: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-sm font-medium text-muted-foreground mb-4">{title}</h2>
      <div className="space-y-3">
        {rows.slice(0, 8).map((r) => (
          <div key={r.key} className="flex items-center gap-3">
            <div className="w-28 shrink-0 text-sm text-foreground/80 truncate">{r.label}</div>
            <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${(r.count / max) * 100}%` }}
              />
            </div>
            <div className="w-8 text-right text-sm text-muted-foreground">{r.count}</div>
          </div>
        ))}
        {rows.length === 0 && <p className="text-sm text-muted-foreground">{empty}</p>}
      </div>
    </div>
  );
}
