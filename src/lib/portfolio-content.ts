import { doc, getDoc, setDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "./firebase";

export interface HeroContent {
  badge: string;
  name: string;
  roleTitle: string;
  stack: string[];
  tagline: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  intro: string;
  currentRolePrefix: string;
  currentRoleCompany: string;
  currentRoleUrl: string;
  currentRoleSuffix: string;
  outro: string;
  initials: string;
}

export interface ProjectsContent {
  eyebrow: string;
  title: string;
  description: string;
  footerNote: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface SkillsContent {
  eyebrow: string;
  title: string;
  description: string;
  groups: SkillGroup[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  detail: string;
}

export interface ExperienceContent {
  eyebrow: string;
  title: string;
  entries: ExperienceEntry[];
}

export interface TestimonialBadge {
  emoji: string;
  label: string;
}

export interface TestimonialsContent {
  eyebrow: string;
  title: string;
  badges: TestimonialBadge[];
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  description: string;
  email: string;
  linkedinUrl: string;
  githubUrl: string;
  note: string;
}

// Empty shapes only — no copy lives in the codebase. All real content lives
// in Firestore (`portfolio/{section}`), edited from /admin/content. These
// just keep the UI from crashing for the instant before the first fetch
// resolves, or if a document hasn't been created yet.
const emptyHero: HeroContent = { badge: "", name: "", roleTitle: "", stack: [], tagline: "" };

const emptyAbout: AboutContent = {
  eyebrow: "",
  title: "",
  intro: "",
  currentRolePrefix: "",
  currentRoleCompany: "",
  currentRoleUrl: "",
  currentRoleSuffix: "",
  outro: "",
  initials: "",
};

const emptyProjects: ProjectsContent = { eyebrow: "", title: "", description: "", footerNote: "" };

const emptySkills: SkillsContent = { eyebrow: "", title: "", description: "", groups: [] };

const emptyExperience: ExperienceContent = { eyebrow: "", title: "", entries: [] };

const emptyTestimonials: TestimonialsContent = { eyebrow: "", title: "", badges: [] };

const emptyContact: ContactContent = {
  eyebrow: "",
  title: "",
  description: "",
  email: "",
  linkedinUrl: "",
  githubUrl: "",
  note: "",
};

/**
 * Fetches a `portfolio/{id}` Firestore document and shallow-merges it over
 * the empty shape, so a missing field (or a missing doc, or a network/rules
 * error) degrades to blank rather than crashing the page.
 */
async function fetchSection<T extends object>(id: string, fallback: T): Promise<T> {
  try {
    const snap = await getDoc(doc(db, "portfolio", id));
    return snap.exists() ? { ...fallback, ...(snap.data() as Partial<T>) } : fallback;
  } catch {
    return fallback;
  }
}

function usePortfolioSection<T extends object>(id: string, fallback: T): T {
  const { data } = useQuery({
    queryKey: ["portfolio", id],
    queryFn: () => fetchSection(id, fallback),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    initialData: fallback,
    // Without this, React Query treats `initialData` as already-fresh for
    // the full staleTime window and never actually fetches from Firestore on
    // a new page load — marking it as of "time zero" forces one real fetch.
    initialDataUpdatedAt: 0,
  });
  return data;
}

export const useHeroContent = () => usePortfolioSection("hero", emptyHero);
export const useAboutContent = () => usePortfolioSection("about", emptyAbout);
export const useProjectsContent = () => usePortfolioSection("projects", emptyProjects);
export const useSkillsContent = () => usePortfolioSection("skills", emptySkills);
export const useExperienceContent = () => usePortfolioSection("experience", emptyExperience);
export const useTestimonialsContent = () =>
  usePortfolioSection("testimonials", emptyTestimonials);
export const useContactContent = () => usePortfolioSection("contact", emptyContact);

export async function savePortfolioSection<T extends object>(id: string, data: T): Promise<void> {
  await setDoc(doc(db, "portfolio", id), data, { merge: true });
}
