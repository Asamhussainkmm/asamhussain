import { SectionHeading } from "./SectionHeading";
import { useAboutContent } from "@/lib/portfolio-content";
import { Reveal } from "@/components/Reveal";

export function About() {
  const about = useAboutContent();
  return (
    <section id="about" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />
        </Reveal>
        <Reveal delay={100}>
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
                {about.photo ? (
                  <img
                    src={about.photo}
                    alt={about.initials || "Profile photo"}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full rounded-full bg-surface flex items-center justify-center text-4xl md:text-5xl font-bold text-foreground/80">
                    {about.initials}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}