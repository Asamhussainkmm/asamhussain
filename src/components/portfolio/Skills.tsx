import { SectionHeading } from "./SectionHeading";

const groups = [
  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"] },
  { label: "Backend", items: ["FastAPI", "Django", "Python", "REST APIs"] },
  { label: "Cloud & DevOps", items: ["GCP", "Firebase", "Cloud Run", "AWS", "Docker"] },
  { label: "Databases", items: ["PostgreSQL", "Firebase Firestore"] },
  { label: "Tools", items: ["Git", "Claude AI", "Cursor", "VS Code"] },
];

export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="03 / Skills"
          title="Stack"
          description="The tools I reach for. Deep in the first three groups, comfortable across the rest."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.label} className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs uppercase tracking-[0.18em] text-primary font-mono mb-4">
                {g.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {g.items.map((i) => (
                  <span
                    key={i}
                    className="text-sm px-3 py-1.5 rounded-lg bg-background/60 border border-border text-foreground/85"
                  >
                    {i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}