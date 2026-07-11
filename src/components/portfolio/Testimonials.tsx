import { Quote } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="05 / Social Proof" title="Trusted by teams that ship" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-7">
              <Quote className="h-6 w-6 text-primary/60 mb-4" />
              <p className="text-foreground/60 italic leading-relaxed">
                Testimonial coming soon — a note from a founder or hiring
                manager I've worked with will live here.
              </p>
              <div className="mt-5 text-sm">
                <div className="text-foreground/80 font-medium">Client name</div>
                <div className="text-muted-foreground text-xs">Role · Company</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
            <span>⭐</span> Upwork Top Rated
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
            <span>🚀</span> Techstars Startup Team
          </span>
        </div>
      </div>
    </section>
  );
}