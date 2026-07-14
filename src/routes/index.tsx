import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Projects } from "@/components/portfolio/Projects";
import { Skills } from "@/components/portfolio/Skills";
import { Experience } from "@/components/portfolio/Experience";
import { Awards } from "@/components/portfolio/Awards";
import { Testimonials } from "@/components/portfolio/Testimonials";
import { Contact } from "@/components/portfolio/Contact";
import { PageShell } from "@/components/portfolio/PageShell";
import { PageLoader } from "@/components/portfolio/PageLoader";
import { SITE_URL } from "@/lib/site";
import { usePortfolioReady } from "@/lib/portfolio-content";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "canonical", href: SITE_URL }],
    meta: [{ property: "og:url", content: SITE_URL }],
  }),
  component: Index,
});

function Index() {
  const ready = usePortfolioReady();
  return (
    <PageShell>
      {ready ? (
        <>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Experience />
          <Awards />
          <Testimonials />
          <Contact />
        </>
      ) : (
        <PageLoader />
      )}
    </PageShell>
  );
}
