import { SectionHeading } from "./SectionHeading";
import { useExperienceContent } from "@/lib/portfolio-content";

export function Experience() {
  const experience = useExperienceContent();
  return (
    <section id="experience" className="py-24 md:py-32 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={experience.eyebrow} title={experience.title} />
        <ol className="relative border-l border-border ml-2 space-y-10">
          {experience.entries.map((e) => (
            <li key={e.role + e.company} className="pl-8 relative">
              <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="text-lg font-semibold text-foreground">{e.role}</h3>
                <span className="text-primary">· {e.company}</span>
              </div>
              <div className="text-xs text-muted-foreground font-mono mt-1">
                {e.period} · {e.location}
              </div>
              <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{e.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}