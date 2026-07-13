import { Link } from "@tanstack/react-router";
import { Briefcase, Github, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import { useContactContent } from "@/lib/portfolio-content";

const quickLinks = [
  { to: "/about", label: "About" },
  { to: "/projects", label: "Work" },
  { to: "/skills", label: "Skills" },
  { to: "/experience", label: "Experience" },
  { to: "/awards", label: "Awards" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
];

export function Footer() {
  const contact = useContactContent();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-2 space-y-3">
          <Link to="/" className="font-semibold tracking-tight text-foreground">
            asam hussain<span className="text-primary">.</span>
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
            Senior Full-Stack Engineer building production web apps with React, Next.js, and
            FastAPI. Open to remote senior roles.
          </p>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Navigate
          </div>
          <ul className="space-y-2.5 text-sm">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground hover:text-foreground transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Connect
          </div>
          <ul className="space-y-2.5 text-sm">
            {contact.email && (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" /> {contact.email}
                </a>
              </li>
            )}
            {contact.phone && (
              <li>
                <a
                  href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" /> {contact.phone}
                </a>
              </li>
            )}
            {contact.whatsappUrl && contact.whatsappUrl !== "#" && (
              <li>
                <a
                  href={contact.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
              </li>
            )}
            {contact.linkedinUrl && contact.linkedinUrl !== "#" && (
              <li>
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
              </li>
            )}
            {contact.githubUrl && contact.githubUrl !== "#" && (
              <li>
                <a
                  href={contact.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
            )}
            {contact.upworkUrl && contact.upworkUrl !== "#" && (
              <li>
                <a
                  href={contact.upworkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Briefcase className="h-3.5 w-3.5" /> Upwork
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} Asam Hussain</span>
          <div className="flex items-center gap-4">
            <span>Built with React & Tailwind</span>
            <Link to="/admin" className="hover:text-foreground transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
