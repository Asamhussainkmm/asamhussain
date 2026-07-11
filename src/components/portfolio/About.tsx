import { SectionHeading } from "./SectionHeading";
import { useAboutContent } from "@/lib/portfolio-content";

export function About() {
  const about = useAboutContent();
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={about.eyebrow} title={about.title} />
        <div className="grid md:grid-cols-[1fr_auto] gap-12 items-start">
          <div className="space-y-5 text-base md:text-lg text-foreground/85 leading-relaxed">
            <p>{about.intro}</p>
            <p>
              {about.currentRolePrefix}{" "}
              <a
                href={about.currentRoleUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline underline-offset-4"
              >
                {about.currentRoleCompany}
              </a>
              {about.currentRoleSuffix}
            </p>
            <p>{about.outro}</p>
          </div>
          <div className="mx-auto md:mx-0">
            <div className="relative h-40 w-40 md:h-52 md:w-52 rounded-full p-[2px] bg-gradient-to-br from-primary via-accent-cyan to-primary/40">
              <div className="h-full w-full rounded-full bg-surface flex items-center justify-center text-4xl md:text-5xl font-bold text-foreground/80">
                {about.initials}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}