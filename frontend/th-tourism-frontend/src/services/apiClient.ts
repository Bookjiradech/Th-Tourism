// src/services/apiClient.ts
// ใช้ได้ทั้ง import api from ... และ import { getProvinces, ... } from ...
// มีตรวจเช็ค res.ok กัน error เงียบ ๆ และใส่ type พื้นฐานให้ด้วย

const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

// ---------- Types ----------
export type Province = { id: number; name: string | null; regionName?: string | null };
export type Category = { id: number; name: string | null };

export interface SearchParams {
  keyword?: string;
  provinceId?: number | null;
  categoryId?: number | null;
  limit?: number;
  page?: number;
}

export interface PaginationMeta {
  pageNumber: number;
  pageSize: number;
  total: number;
  totalPage: number;
}

export interface SimplePlace {
  id: number | string; // รองรับทั้ง number และ string (local_xxx)
  name: string | null;
  introduction: string | null;
  thumbnail: string | null;
  province: string | null;
  district: string | null;
  subDistrict: string | null;
  latitude: number | null;
  longitude: number | null;
  tags: string[];
  isLocal?: boolean;
}

export interface SearchResponse {
  items: SimplePlace[];
  pagination: PaginationMeta | null;
  query: any;
}

// ---------- helper ----------
async function jfetch<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    // พยายามอ่านข้อความ error จาก server
    let detail = "";
    try { detail = await res.text(); } catch {}
    const msg = detail || res.statusText || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return res.json() as Promise<T>;
}

// ---------- APIs ----------
export async function searchPlaces(params: SearchParams = {}): Promise<SearchResponse> {
  return jfetch<SearchResponse>(`${BASE}/ttd/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
}

export async function getProvinces(): Promise<{ items: Province[] }> {
  return jfetch<{ items: Province[] }>(`${BASE}/ttd/provinces`);
}

export async function getPlaceCategories(): Promise<{ items: Category[] }> {
  return jfetch<{ items: Category[] }>(`${BASE}/ttd/place-categories`);
}

// ---------- default export (เพื่อรองรับโค้ดเดิมที่เรียก api.getTTD) ----------
const api = {
  getTTD: (params?: SearchParams) => searchPlaces(params),
  getProvinces,
  getPlaceCategories,
};

export default api;
