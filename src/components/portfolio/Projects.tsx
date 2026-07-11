import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const projects = [
  {
    name: "IQLand.ai",
    role: "Full-Stack Engineer · Jan 2024 – Present",
    description:
      "Built the complete frontend and backend of a Techstars-backed AI real estate platform used by real estate professionals across the US. Architected APIs, real-time dashboards, and AI-powered features from scratch.",
    tags: ["Next.js", "FastAPI", "GCP", "AI"],
    link: "https://iqland.ai",
  },
  {
    name: "The Logo Generator",
    role: "Founder & Full-Stack Developer",
    description:
      "Built and launched an AI-powered SaaS logo generation tool as a solo founder — designed, developed, and shipped the full product independently.",
    tags: ["React", "FastAPI", "AI SaaS", "Founder"],
    link: "https://thelogogenerator.com",
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="02 / Selected Work"
          title="Products I've shipped"
          description="Two representative projects — a Techstars-backed startup and a solo SaaS. Both live, both in production."
        />
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((p) => (
            <a
              key={p.name}
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="group card-hover rounded-2xl border border-border bg-card p-7 flex flex-col"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {p.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{p.role}</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
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
            </a>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-dashed border-border/60 bg-card/30 p-6 text-sm text-muted-foreground text-center">
          More projects available on request — including internal tools, client
          work, and open source.
        </div>
      </div>
    </section>
  );
}