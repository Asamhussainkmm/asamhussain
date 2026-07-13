import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "./firebase";

const pageviewsCol = collection(db, "pageviews");

const VISITOR_ID_KEY = "visitor_id";
const GEO_CACHE_KEY = "visitor_geo";

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

interface GeoInfo {
  country: string;
  countryCode: string;
  city: string;
}

const UNKNOWN_GEO: GeoInfo = { country: "Unknown", countryCode: "", city: "" };

// Free, no-key IP geolocation — best-effort. Cached per tab session so we
// only look it up once per visit, not on every page navigation.
async function getGeo(): Promise<GeoInfo> {
  const cached = sessionStorage.getItem(GEO_CACHE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached) as GeoInfo;
    } catch {
      // fall through to refetch
    }
  }
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    const geo: GeoInfo = {
      country: data.country_name || "Unknown",
      countryCode: data.country_code || "",
      city: data.city || "",
    };
    sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(geo));
    return geo;
  } catch {
    return UNKNOWN_GEO;
  }
}

function getDevice(): "mobile" | "desktop" {
  return window.matchMedia("(max-width: 767px)").matches ? "mobile" : "desktop";
}

export async function logPageView(path: string): Promise<void> {
  try {
    const geo = await getGeo();
    await addDoc(pageviewsCol, {
      path,
      timestamp: serverTimestamp(),
      visitorId: getVisitorId(),
      referrer: document.referrer || "direct",
      device: getDevice(),
      country: geo.country,
      countryCode: geo.countryCode,
      city: geo.city,
    });
  } catch {
    // Best-effort — never let analytics logging break navigation.
  }
}

function normalizeReferrer(referrer: string): string {
  if (!referrer || referrer === "direct") return "Direct";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}

export interface PageViewStats {
  total: number;
  uniqueVisitors: number;
  last7Days: number;
  last30Days: number;
  byPath: { path: string; count: number }[];
  byCountry: { country: string; countryCode: string; count: number }[];
  byReferrer: { referrer: string; count: number }[];
  byDevice: { device: string; count: number }[];
  dailyTrend: { date: string; count: number }[];
}

const DAY_MS = 24 * 60 * 60 * 1000;
const TREND_DAYS = 14;

export async function getPageViewStats(): Promise<PageViewStats> {
  const snap = await getDocs(query(pageviewsCol, orderBy("timestamp", "desc")));
  const now = Date.now();

  const pathCounts = new Map<string, number>();
  const countryCounts = new Map<string, { countryCode: string; count: number }>();
  const referrerCounts = new Map<string, number>();
  const deviceCounts = new Map<string, number>();
  const visitorIds = new Set<string>();
  const dailyCounts = new Map<string, number>();

  let last7Days = 0;
  let last30Days = 0;

  snap.docs.forEach((d) => {
    const data = d.data();
    const path = (data.path as string) ?? "unknown";
    pathCounts.set(path, (pathCounts.get(path) ?? 0) + 1);

    const country = (data.country as string) ?? "Unknown";
    const countryCode = (data.countryCode as string) ?? "";
    const existingCountry = countryCounts.get(country);
    countryCounts.set(country, { countryCode, count: (existingCountry?.count ?? 0) + 1 });

    const referrer = normalizeReferrer((data.referrer as string) ?? "direct");
    referrerCounts.set(referrer, (referrerCounts.get(referrer) ?? 0) + 1);

    const device = (data.device as string) ?? "desktop";
    deviceCounts.set(device, (deviceCounts.get(device) ?? 0) + 1);

    const visitorId = data.visitorId as string | undefined;
    if (visitorId) visitorIds.add(visitorId);

    const ts = data.timestamp as Timestamp | undefined;
    if (ts) {
      const ms = ts.toMillis();
      if (now - ms <= 7 * DAY_MS) last7Days += 1;
      if (now - ms <= 30 * DAY_MS) last30Days += 1;
      if (now - ms <= TREND_DAYS * DAY_MS) {
        const dateKey = new Date(ms).toISOString().slice(0, 10);
        dailyCounts.set(dateKey, (dailyCounts.get(dateKey) ?? 0) + 1);
      }
    }
  });

  const byPath = Array.from(pathCounts.entries())
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count);

  const byCountry = Array.from(countryCounts.entries())
    .map(([country, v]) => ({ country, countryCode: v.countryCode, count: v.count }))
    .sort((a, b) => b.count - a.count);

  const byReferrer = Array.from(referrerCounts.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count);

  const byDevice = Array.from(deviceCounts.entries())
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);

  const dailyTrend: { date: string; count: number }[] = [];
  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const key = new Date(now - i * DAY_MS).toISOString().slice(0, 10);
    dailyTrend.push({ date: key, count: dailyCounts.get(key) ?? 0 });
  }

  return {
    total: snap.size,
    uniqueVisitors: visitorIds.size,
    last7Days,
    last30Days,
    byPath,
    byCountry,
    byReferrer,
    byDevice,
    dailyTrend,
  };
}

export const usePageViewStats = () =>
  useQuery({
    queryKey: ["pageview-stats"],
    queryFn: getPageViewStats,
  });
