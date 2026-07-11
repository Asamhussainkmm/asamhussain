import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="01 / About" title="Engineer, not a template" />
        <div className="grid md:grid-cols-[1fr_auto] gap-12 items-start">
          <div className="space-y-5 text-base md:text-lg text-foreground/85 leading-relaxed">
            <p>
              I'm a full-stack engineer with 5+ years shipping production
              products end-to-end. Based in Sri Lanka, working remote with
              teams across the US and UK.
            </p>
            <p>
              Currently at{" "}
              <a
                href="https://iqland.ai"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline underline-offset-4"
              >
                IQLand.ai
              </a>
              , a Techstars-backed AI real estate platform out of Tulsa, where
              I built the full product stack — frontend, backend, and AI
              features — as a remote engineer.
            </p>
            <p>
              Upwork Top Rated with a track record of clients across the US
              and UK. I care about clean code, fast UIs, and products that
              actually help the people using them.
            </p>
          </div>
          <div className="mx-auto md:mx-0">
            <div className="relative h-40 w-40 md:h-52 md:w-52 rounded-full p-[2px] bg-gradient-to-br from-primary via-accent-cyan to-primary/40">
              <div className="h-full w-full rounded-full bg-surface flex items-center justify-center text-4xl md:text-5xl font-bold text-foreground/80">
                AH
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}