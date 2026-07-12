import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { useExperienceContent } from "@/lib/portfolio-content";
import { Reveal } from "@/components/Reveal";

const COLLAPSED_COUNT = 4;

export function Experience() {
  const experience = useExperienceContent();
  const [expanded, setExpanded] = useState(false);
  const entries = expanded
    ? experience.entries
    : experience.entries.slice(0, COLLAPSED_COUNT);
  const hasMore = experience.entries.length > COLLAPSED_COUNT;

  return (
    <section id="experience" className="py-24 md:py-32 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading eyebrow={experience.eyebrow} title={experience.title} />
        </Reveal>
        <ol className="relative border-l border-border ml-2 space-y-10">
          {entries.map((e, i) => (
            <li key={e.role + e.company} className="pl-8 relative">
              <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
              <Reveal delay={i * 80}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-lg font-semibold text-foreground">{e.role}</h3>
                  <span className="text-primary">· {e.company}</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-1">
                  {e.period} · {e.location}
                </div>
                <p className="mt-2 text-sm text-foreground/75 leading-relaxed">{e.detail}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mt-8 mx-auto flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
          >
            {expanded ? "Show less" : `See ${experience.entries.length - COLLAPSED_COUNT} more`}
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
    </section>
  );
}
