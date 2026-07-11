import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "./firebase";

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  roleCompany: string;
  avatar: string;
  order: number;
}

export type TestimonialInput = Omit<Testimonial, "id">;

const testimonialsCol = collection(db, "testimonials");

function toTestimonial(id: string, data: Record<string, unknown>): Testimonial {
  return {
    id,
    quote: (data.quote as string) ?? "",
    name: (data.name as string) ?? "",
    roleCompany: (data.roleCompany as string) ?? "",
    avatar: (data.avatar as string) ?? "",
    order: (data.order as number) ?? 0,
  };
}

export async function listTestimonials(): Promise<Testimonial[]> {
  try {
    const snap = await getDocs(query(testimonialsCol, orderBy("order", "asc")));
    return snap.docs.map((d) => toTestimonial(d.id, d.data()));
  } catch {
    return [];
  }
}

export async function createTestimonial(data: TestimonialInput): Promise<string> {
  const ref = await addDoc(testimonialsCol, data);
  return ref.id;
}

export async function updateTestimonial(
  id: string,
  data: Partial<TestimonialInput>,
): Promise<void> {
  await setDoc(doc(db, "testimonials", id), data, { merge: true });
}

export async function deleteTestimonial(id: string): Promise<void> {
  await deleteDoc(doc(db, "testimonials", id));
}

export const useTestimonialsList = () =>
  useQuery({
    queryKey: ["testimonials"],
    queryFn: listTestimonials,
    staleTime: 60 * 1000,
    initialData: [],
    initialDataUpdatedAt: 0,
  });
