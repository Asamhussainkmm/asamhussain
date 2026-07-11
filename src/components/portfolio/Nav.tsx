import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";

const links = [
  { to: "/about", label: "About" },
  { to: "/projects", label: "Work" },
  { to: "/skills", label: "Skills" },
  { to: "/experience", label: "Experience" },
  { to: "/contact", label: "Contact" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors ${
        scrolled
          ? "backdrop-blur-md bg-background/70 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-semibold tracking-tight text-foreground">
          asam<span className="text-primary">.</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-foreground transition-colors [&.active]:text-foreground"
              activeProps={{ className: "active" }}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <Link
            to="/contact"
            className="hidden sm:inline-flex text-sm font-medium px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Hire Me
          </Link>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden h-9 w-9 grid place-items-center rounded-full border border-border bg-card/50 hover:border-primary hover:text-primary transition-colors"
            >
              <Menu className="h-4 w-4" />
            </button>
            <SheetContent side="right" className="w-3/4 sm:max-w-xs">
              <SheetTitle className="mb-2">
                asam<span className="text-primary">.</span>
              </SheetTitle>
              <div className="flex flex-col gap-1 text-base">
                {links.map((l) => (
                  <SheetClose asChild key={l.to}>
                    <Link
                      to={l.to}
                      className="rounded-lg px-3 py-2.5 text-muted-foreground hover:text-foreground hover:bg-card transition-colors [&.active]:text-foreground [&.active]:bg-card"
                      activeProps={{ className: "active" }}
                    >
                      {l.label}
                    </Link>
                  </SheetClose>
                ))}
              </div>
              <SheetClose asChild>
                <Link
                  to="/contact"
                  className="mt-4 inline-flex items-center justify-center text-sm font-medium px-4 py-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  Hire Me
                </Link>
              </SheetClose>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
