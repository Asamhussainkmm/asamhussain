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

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
  image: string;
  order: number;
}

export type AwardInput = Omit<Award, "id">;

const awardsCol = collection(db, "awards");

function toAward(id: string, data: Record<string, unknown>): Award {
  return {
    id,
    title: (data.title as string) ?? "",
    issuer: (data.issuer as string) ?? "",
    date: (data.date as string) ?? "",
    url: (data.url as string) ?? "",
    image: (data.image as string) ?? "",
    order: (data.order as number) ?? 0,
  };
}

export async function listAwards(): Promise<Award[]> {
  try {
    const snap = await getDocs(query(awardsCol, orderBy("order", "asc")));
    return snap.docs.map((d) => toAward(d.id, d.data()));
  } catch {
    return [];
  }
}

export async function createAward(data: AwardInput): Promise<string> {
  const ref = await addDoc(awardsCol, data);
  return ref.id;
}

export async function updateAward(id: string, data: Partial<AwardInput>): Promise<void> {
  await setDoc(doc(db, "awards", id), data, { merge: true });
}

export async function deleteAward(id: string): Promise<void> {
  await deleteDoc(doc(db, "awards", id));
}

export const useAwardsList = () =>
  useQuery({
    queryKey: ["awards"],
    queryFn: listAwards,
    staleTime: 60 * 1000,
    initialData: [],
    initialDataUpdatedAt: 0,
  });
