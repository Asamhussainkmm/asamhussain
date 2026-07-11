import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "./firebase";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: Date | null;
}

const messagesCol = collection(db, "messages");

export async function submitMessage(input: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await addDoc(messagesCol, { ...input, read: false, createdAt: serverTimestamp() });
}

export async function listMessages(): Promise<ContactMessage[]> {
  const snap = await getDocs(query(messagesCol, orderBy("createdAt", "desc")));
  return snap.docs.map((d) => {
    const data = d.data();
    const createdAt = data.createdAt as Timestamp | undefined;
    return {
      id: d.id,
      name: (data.name as string) ?? "",
      email: (data.email as string) ?? "",
      message: (data.message as string) ?? "",
      read: (data.read as boolean) ?? false,
      createdAt: createdAt ? createdAt.toDate() : null,
    };
  });
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  await updateDoc(doc(db, "messages", id), { read });
}

export async function deleteMessage(id: string): Promise<void> {
  await deleteDoc(doc(db, "messages", id));
}

export const useMessages = () =>
  useQuery({
    queryKey: ["messages"],
    queryFn: listMessages,
  });
