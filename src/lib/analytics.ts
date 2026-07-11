import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "./firebase";

const pageviewsCol = collection(db, "pageviews");

export async function logPageView(path: string): Promise<void> {
  try {
    await addDoc(pageviewsCol, { path, timestamp: serverTimestamp() });
  } catch {
    // Best-effort — never let analytics logging break navigation.
  }
}

export interface PageViewStats {
  total: number;
  last7Days: number;
  byPath: { path: string; count: number }[];
}

export async function getPageViewStats(): Promise<PageViewStats> {
  const snap = await getDocs(query(pageviewsCol, orderBy("timestamp", "desc")));
  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const counts = new Map<string, number>();
  let last7Days = 0;

  snap.docs.forEach((d) => {
    const data = d.data();
    const path = (data.path as string) ?? "unknown";
    counts.set(path, (counts.get(path) ?? 0) + 1);
    const ts = data.timestamp as Timestamp | undefined;
    if (ts && now - ts.toMillis() <= sevenDaysMs) last7Days += 1;
  });

  const byPath = Array.from(counts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count);

  return { total: snap.size, last7Days, byPath };
}

export const usePageViewStats = () =>
  useQuery({
    queryKey: ["pageview-stats"],
    queryFn: getPageViewStats,
  });
