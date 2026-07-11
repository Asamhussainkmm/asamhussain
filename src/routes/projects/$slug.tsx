import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/portfolio/PageShell";
import { useProject } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => ({
    links: [{ rel: "canonical", href: `${SITE_URL}/projects/${params.slug}` }],
    meta: [{ property: "og:url", content: `${SITE_URL}/projects/${params.slug}` }],
  }),
  component: ProjectCaseStudy,
});

function ProjectCaseStudy() {
  const { slug } = Route.useParams();
  const { data: project, isLoading } = useProject(slug);

  useEffect(() => {
    if (!project) return;
    document.title = `${project.name} — Asam Hussain`;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.name,
      description: project.description,
      author: { "@type": "Person", name: "Asam Hussain" },
      url: typeof window !== "undefined" ? window.location.href : undefined,
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [project]);

  return (
    <PageShell>
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All projects
          </Link>

          {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading…</p>}

          {!isLoading && !project && (
            <p className="mt-8 text-sm text-muted-foreground">Project not found.</p>
          )}

          {project && (
            <>
              {project.image && (
                <img
                  src={project.image}
                  alt={project.name}
                  className="mt-8 w-full rounded-2xl border border-border object-cover max-h-96"
                />
              )}
              <h1 className="mt-8 text-3xl md:text-4xl font-bold text-foreground">
                {project.name}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">{project.role}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full border border-border bg-card text-primary font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-8 space-y-4 text-base text-foreground/85 leading-relaxed">
                {(project.caseStudy || project.description)
                  .split(/\n\s*\n/)
                  .map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Visit live project <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
