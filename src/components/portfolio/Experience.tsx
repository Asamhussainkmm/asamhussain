import { SectionHeading } from "./SectionHeading";

const entries = [
  {
    role: "Full-Stack Engineer",
    company: "IQLand.ai",
    period: "Jan 2024 – Present",
    location: "Remote · USA",
    detail: "Sole full-stack engineer building a Techstars-backed AI real estate platform end-to-end.",
  },
  {
    role: "Founder & Developer",
    company: "thelogogenerator.com",
    period: "2024 – Present",
    location: "Remote",
    detail: "Designed, built, and launched an AI-powered logo SaaS as a solo founder.",
  },
  {
    role: "Top Rated Freelancer",
    company: "Upwork",
    period: "2022 – Present",
    location: "Remote · US & UK clients",
    detail: "Long-term engagements with startups and agencies across full-stack, AI, and cloud.",
  },
  {
    role: "Associate Software Engineer",
    company: "Virtusa Private Limited",
    period: "Nov 2021 – Aug 2023",
    location: "Sri Lanka",
    detail: "Built enterprise web applications and internal platforms for global clients.",
  },
];

export function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="04 / Experience" title="Where I've worked" />
        <ol className="relative border-l border-border ml-2 space-y-10">
          {entries.map((e) => (
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