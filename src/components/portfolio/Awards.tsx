import { Award as AwardIcon, ExternalLink } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { useAwardsContent } from "@/lib/portfolio-content";
import { useAwardsList } from "@/lib/awards";
import { Reveal } from "@/components/Reveal";

export function Awards() {
  const section = useAwardsContent();
  const { data: items } = useAwardsList();

  if ((items ?? []).length === 0) return null;

  return (
    <section id="awards" className="py-24 md:py-32 bg-surface/40">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
          />
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(items ?? []).map((a, i) => (
            <Reveal key={a.id} delay={i * 80} className="h-full">
              <div className="rounded-2xl border border-border bg-card p-6 h-full flex flex-col">
                {a.image ? (
                  <img
                    src={a.image}
                    alt={a.title}
                    className="h-14 w-14 rounded-xl object-cover mb-4"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-xl bg-background/60 border border-border flex items-center justify-center mb-4">
                    <AwardIcon className="h-6 w-6 text-primary" />
                  </div>
                )}
                <h3 className="text-base font-semibold text-foreground">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{a.issuer}</p>
                <p className="text-xs text-muted-foreground font-mono mt-2">{a.date}</p>
                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary hover:underline underline-offset-4"
                  >
                    View credential <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
