import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "./firebase";

export interface Project {
  id: string;
  slug: string;
  name: string;
  role: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
  caseStudy: string;
  order: number;
  featured: boolean;
}

export type ProjectInput = Omit<Project, "id">;

const projectsCol = collection(db, "projects");

function toProject(id: string, data: Record<string, unknown>): Project {
  return {
    id,
    slug: (data.slug as string) ?? id,
    name: (data.name as string) ?? "",
    role: (data.role as string) ?? "",
    description: (data.description as string) ?? "",
    tags: (data.tags as string[]) ?? [],
    link: (data.link as string) ?? "",
    image: (data.image as string) ?? "",
    caseStudy: (data.caseStudy as string) ?? "",
    order: (data.order as number) ?? 0,
    featured: (data.featured as boolean) ?? false,
  };
}

export async function listProjects(): Promise<Project[]> {
  try {
    const snap = await getDocs(query(projectsCol, orderBy("order", "asc")));
    return snap.docs.map((d) => toProject(d.id, d.data()));
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const snap = await getDocs(query(projectsCol, where("slug", "==", slug)));
    if (snap.empty) return null;
    const d = snap.docs[0];
    return toProject(d.id, d.data());
  } catch {
    return null;
  }
}

export async function getProject(id: string): Promise<Project | null> {
  const snap = await getDoc(doc(db, "projects", id));
  return snap.exists() ? toProject(snap.id, snap.data()) : null;
}

export async function createProject(data: ProjectInput): Promise<string> {
  const ref = await addDoc(projectsCol, { ...data, createdAt: serverTimestamp() });
  return ref.id;
}

export async function updateProject(id: string, data: Partial<ProjectInput>): Promise<void> {
  await setDoc(doc(db, "projects", id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function deleteProject(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
}

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: listProjects,
    staleTime: 60 * 1000,
    initialData: [],
    initialDataUpdatedAt: 0,
  });

export const useProject = (slug: string) =>
  useQuery({
    queryKey: ["project", slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: !!slug,
  });
