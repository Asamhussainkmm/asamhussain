import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { useProjectsContent } from "@/lib/portfolio-content";
import { useProjects } from "@/lib/projects";
import { Reveal } from "@/components/Reveal";

export function Projects() {
  const section = useProjectsContent();
  const { data: items } = useProjects();
  return (
    <section id="projects" className="py-24 md:py-32 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
          />
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {(items ?? []).map((p, i) => (
            <Reveal key={p.id} delay={i * 100} className="h-full">
              <Link
                to="/projects/$slug"
                params={{ slug: p.slug }}
                className="group card-hover rounded-2xl border border-border bg-card overflow-hidden flex flex-col h-full"
              >
                {p.image && (
                  <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
                )}
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{p.role}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                  <p className="mt-5 text-sm text-foreground/75 leading-relaxed flex-1">
                    {p.description}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 rounded-full border border-border bg-background/60 text-primary font-mono"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {(items ?? []).length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Projects will appear here once added from the admin panel.
          </p>
        )}
        <div className="mt-6 rounded-2xl border border-dashed border-border/60 bg-card/30 p-6 text-sm text-muted-foreground text-center">
          {section.footerNote}
        </div>
      </div>
    </section>
  );
}
