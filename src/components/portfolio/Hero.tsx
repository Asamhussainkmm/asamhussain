import { ArrowRight, Mail } from "lucide-react";
import { useHeroContent } from "@/lib/portfolio-content";

const tokens = ["{ }", "</>", "()", "=>", "[]", "//", "0x", "λ", "&&", "??"];

export function Hero() {
  const hero = useHeroContent();
  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
    >
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-mesh)" }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        {tokens.map((t, i) => (
          <span
            key={i}
            className="absolute font-mono text-primary/40 float-token select-none"
            style={{
              top: `${(i * 37) % 90 + 5}%`,
              left: `${(i * 53) % 92 + 3}%`,
              fontSize: `${12 + (i % 4) * 4}px`,
              animationDelay: `${(i % 5) * 0.7}s`,
              animationDuration: `${7 + (i % 4)}s`,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mx-auto max-w-6xl px-6 w-full">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {hero.badge}
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          {hero.name}
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-foreground/80 font-medium">
          {hero.roleTitle}
          {hero.stack.map((s) => (
            <span key={s}>
              {" "}
              <span className="text-muted-foreground">·</span>{" "}
              <span className="text-primary">{s}</span>
            </span>
          ))}
        </p>
        <p className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          {hero.tagline}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            View My Work <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-5 py-3 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
          >
            <Mail className="h-4 w-4" /> Hire Me
          </a>
        </div>
      </div>
    </section>
  );
}