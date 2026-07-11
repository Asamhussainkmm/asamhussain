import { SectionHeading } from "./SectionHeading";
import { useSkillsContent } from "@/lib/portfolio-content";

export function Skills() {
  const skills = useSkillsContent();
  return (
    <section id="skills" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={skills.eyebrow}
          title={skills.title}
          description={skills.description}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skills.groups.map((g) => (
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