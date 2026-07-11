import { Quote } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { useTestimonialsContent } from "@/lib/portfolio-content";
import { useTestimonialsList } from "@/lib/testimonials";

export function Testimonials() {
  const section = useTestimonialsContent();
  const { data: items } = useTestimonialsList();
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} />
        <div className="grid md:grid-cols-2 gap-6">
          {(items ?? []).map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-7">
              <Quote className="h-6 w-6 text-primary/60 mb-4" />
              <p className="text-foreground/60 italic leading-relaxed">{t.quote}</p>
              <div className="mt-5 flex items-center gap-3 text-sm">
                {t.avatar && (
                  <img src={t.avatar} alt={t.name} className="h-9 w-9 rounded-full object-cover" />
                )}
                <div>
                  <div className="text-foreground/80 font-medium">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.roleCompany}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          {section.badges.map((b) => (
            <span
              key={b.label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm"
            >
              <span>{b.emoji}</span> {b.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}