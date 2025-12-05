// src/routes/ttd.route.ts
import { Router } from "express";
import axios from "axios";
import { prisma } from "../config/prisma";

const router = Router();

const TAT_API_BASE_URL =
  process.env.TAT_API_BASE_URL || "https://tatdataapi.io/api/v2";
const TAT_API_KEY = process.env.TAT_API_KEY;
const TAT_DEFAULT_LANG = process.env.TAT_DEFAULT_LANG || "th";

if (!TAT_API_KEY) {
  console.warn(
    "[TAT] WARNING: TAT_API_KEY is not set. Please add it to your .env file."
  );
}
function pickArrayLike(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.items)) return raw.items;
  if (Array.isArray(raw?.categories)) return raw.categories;
  if (Array.isArray(raw?.data?.categories)) return raw.data.categories;
  return [];
}
// ====== รูปแบบข้อมูลที่ส่งให้ frontend ======
interface SimplePlace {
  id: number;
  name: string | null;
  introduction: string | null;
  thumbnail: string | null;
  province: string | null;
  district: string | null;
  subDistrict: string | null;
  latitude: number | null;
  longitude: number | null;
  tags: string[];
}
// ====== SEARCH (POST /api/ttd/search) ======
router.post("/search", async (req, res) => {
  try {
    const { keyword, provinceId, categoryId, limit = 12, page = 1 } = req.body || {};

    // --- 1. ดึงข้อมูลจาก Local Database ---
    const localWhere: any = { isOpen: true };
    if (keyword) {
      localWhere.OR = [
        { name: { contains: keyword } },
        { detail: { contains: keyword } },
        { province: { contains: keyword } }
      ];
    }
    // Note: provinceId จาก TAT API เป็น code เลข แต่ใน local เก็บเป็นชื่อจังหวัด
    // ถ้าต้องการ filter ด้วย provinceId ต้องมี mapping table
    
    const localPlaces = await prisma.tourismLocal.findMany({
      where: localWhere,
      orderBy: { createdAt: "desc" },
      take: 100 // จำกัดไม่เกิน 100 รายการ
    });

    const localItems: SimplePlace[] = localPlaces.map(place => ({
      id: `local_${place.id}` as any, // แยกจาก TAT ด้วย prefix
      name: place.name,
      introduction: place.detail,
      thumbnail: place.introImage,
      province: place.province,
      district: place.district,
      subDistrict: null,
      latitude: place.latitude ? parseFloat(place.latitude.toString()) : null,
      longitude: place.longitude ? parseFloat(place.longitude.toString()) : null,
      tags: [],
      isLocal: true // flag พิเศษ
    } as any));

    console.log(`[TTD Search] Found ${localItems.length} local places`);

    // --- 2. ดึงข้อมูลจาก TAT API ---
    let tatItems: SimplePlace[] = [];
    let pagination: any = {
      pageNumber: page,
      pageSize: limit,
      total: localItems.length,
      totalPage: 1
    };

    if (TAT_API_KEY) {
      const params: any = {
        limit,
        page,
        has_introduction: "true",
        has_name: "true",
        has_thumbnail: "true",
      };
      if (keyword) params.keyword = keyword;
      if (provinceId) params.province_id = Number(provinceId);
      if (categoryId) params.place_category_id = Number(categoryId);

      console.log("[TTD Search] Request params:", { keyword, provinceId, categoryId, limit, page });
      console.log("[TTD Search] API params to TAT:", params);

      try {
        const tatRes = await axios.get(`${TAT_API_BASE_URL}/places`, {
          headers: { "x-api-key": TAT_API_KEY!, "Accept-Language": TAT_DEFAULT_LANG },
          params,
          timeout: 10000,
        });

        const data = tatRes.data;
        console.log("[TTD Search] TAT API response status:", tatRes.status);
        console.log("[TTD Search] Items count:", Array.isArray(data?.data) ? data.data.length : 0);

        // --- normalize items ---
        tatItems = (data?.data || []).map((p: any) => {
          let thumb: string | null = null;
          if (Array.isArray(p.thumbnailUrl)) thumb = p.thumbnailUrl[0] || null;
          else if (typeof p.thumbnailUrl === "string") thumb = p.thumbnailUrl;

          return {
            id: p.placeId,
            name: p.name ?? null,
            introduction: p.introduction ?? null,
            thumbnail: thumb,
            province: p.location?.province?.name ?? null,
            district: p.location?.district?.name ?? null,
            subDistrict: p.location?.subDistrict?.name ?? null,
            latitude: p.latitude ?? null,
            longitude: p.longitude ?? null,
            tags: Array.isArray(p.tags) ? p.tags : [],
          };
        });

        // --- normalize pagination ---
        const rawPg = data?.pagination || {};
        const toNum = (v: any) => (v == null ? undefined : Number(v));

        const pageNumber =
          toNum(rawPg.pageNumber) ?? toNum(rawPg.page) ?? toNum(rawPg.currentPage) ?? Number(page) ?? 1;

        let pageSize =
          toNum(rawPg.pageSize) ?? toNum(rawPg.perpage) ?? Number(limit) ?? tatItems.length;
        if (!pageSize || !Number.isFinite(pageSize) || pageSize <= 0) pageSize = 12;

        const total =
          toNum(rawPg.total) ??
          toNum(rawPg.totalItems) ??
          toNum(data?.total) ??
          toNum(data?.count);

        let totalPage =
          toNum(rawPg.totalPage) ??
          (total && pageSize ? Math.max(1, Math.ceil(total / pageSize)) : undefined);

        if (!totalPage) {
          totalPage = tatItems.length < pageSize ? pageNumber : pageNumber + 1;
        }

        pagination = {
          pageNumber,
          pageSize,
          total: (total ?? 0) + localItems.length,
          totalPage,
        };

        console.log("[TAT] pagination normalized:", pagination);
      } catch (tatErr: any) {
        console.error("[TAT] API error:", tatErr.response?.data || tatErr.message);
        // ถ้า TAT API error ก็แสดงแค่ local items
      }
    }

    // --- 3. รวมข้อมูล: Local แสดงก่อนเสมอ ---
    const combinedItems = [...localItems, ...tatItems];

    console.log(`[TTD Search] Total items: ${combinedItems.length} (${localItems.length} local + ${tatItems.length} TAT)`);

    return res.json({
      items: combinedItems,
      pagination,
      query: req.body || null,
    });
  } catch (err: any) {
    console.error("[TTD Search] Error:", err.message || err.toString());
    return res.status(500).json({
      message: "Failed to search places",
      detail: err.message,
    });
  }
});

// ====== DROPDOWNS ======

// GET /api/ttd/provinces
router.get("/provinces", async (_req, res) => {
  try {
    if (!TAT_API_KEY) {
      return res.status(500).json({ message: "TAT_API_KEY is not configured" });
    }

    const tatRes = await axios.get(`${TAT_API_BASE_URL}/location/provinces`, {
      headers: {
        "x-api-key": TAT_API_KEY!,
        "Accept-Language": TAT_DEFAULT_LANG,
      },
      timeout: 10000,
    });

    const items = (tatRes.data?.data || tatRes.data || []).map((p: any) => ({
      id: p.id ?? p.provinceId ?? p.province_id ?? null,
      name: p.name ?? null,
      regionName: p.regionName ?? null,
    })).filter((x: any) => x.id != null);

    res.json({ items });
  } catch (err: any) {
    console.error("[TAT] provinces error:", err.response?.data || err.message);
    res.status(500).json({ message: "Failed to fetch provinces", detail: err.response?.data || err.message });
  }
});

// GET /api/ttd/place-categories
router.get("/place-categories", async (_req, res) => {
  try {
    if (!TAT_API_KEY) {
      return res.status(500).json({ message: "TAT_API_KEY is not configured" });
    }

    const tatRes = await axios.get(`${TAT_API_BASE_URL}/places/categories`, {
      headers: {
        "x-api-key": TAT_API_KEY!,
        "Accept-Language": TAT_DEFAULT_LANG,
      },
      timeout: 10000,
    });

    const raw = tatRes.data;
    // ลองหยิบ array จากหลาย ๆ key ที่พบบ่อย
    let arr: any[] = [];
    if (Array.isArray(raw)) arr = raw;
    else if (Array.isArray(raw?.data)) arr = raw.data;
    else if (Array.isArray(raw?.items)) arr = raw.items;
    else if (Array.isArray(raw?.result)) arr = raw.result;
    else if (Array.isArray(raw?.data?.data)) arr = raw.data.data; // บาง API ห่อซ้อน

    // map ให้ได้ id + name ที่ใช้งานได้
    const items = (arr || [])
      .map((c: any) => {
        const id =
          c?.categoryId ??
          c?.id ??
          c?.code ?? // กันเคสส่งเป็น code
          null;

        const name =
          c?.name ??
          c?.description ??
          c?.displayName ??
          c?.code ??
          null;

        return { id, name };
      })
      .filter((x: any) => x.id != null && x.name != null);

    // กันเคส API แปลก ๆ — ถ้าไม่มีอะไรเลยก็ลอง fallback เป็น sub-categories
    if (!items.length) {
      const sub = await axios.get(`${TAT_API_BASE_URL}/places/sub-categories`, {
        headers: {
          "x-api-key": TAT_API_KEY!,
          "Accept-Language": TAT_DEFAULT_LANG,
        },
        timeout: 10000,
      });
      const raw2 = sub.data;
      let arr2: any[] = [];
      if (Array.isArray(raw2)) arr2 = raw2;
      else if (Array.isArray(raw2?.data)) arr2 = raw2.data;
      const items2 = (arr2 || [])
        .map((s: any) => ({
          id: s?.subCategoryId ?? s?.id ?? null,
          name: s?.name ?? null,
        }))
        .filter((x: any) => x.id != null && x.name != null);
      return res.json({ items: items2 });
    }

    return res.json({ items });
  } catch (err: any) {
    console.error("[TAT] categories error:", err.response?.data || err.message);
    res
      .status(500)
      .json({ message: "Failed to fetch categories", detail: err.response?.data || err.message });
  }
});

// GET /api/ttd/place-categories-with-count
// Returns categories with a count field (may be 0 if not pre-checked)
// Uses in-memory cache to avoid hammering the TAT API
const categoryCountCache: Map<string, { data: any; timestamp: number }> = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

router.get("/place-categories-with-count", async (_req, res) => {
  try {
    if (!TAT_API_KEY) {
      return res.status(500).json({ message: "TAT_API_KEY is not configured" });
    }

    const cacheKey = "categories-with-count";
    const cached = categoryCountCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log("[TAT] Returning cached categories");
      return res.json(cached.data);
    }

    // First, get all categories
    const catRes = await axios.get(`${TAT_API_BASE_URL}/places/categories`, {
      headers: {
        "x-api-key": TAT_API_KEY!,
        "Accept-Language": TAT_DEFAULT_LANG,
      },
      timeout: 10000,
    });

    const raw = catRes.data;
    let arr: any[] = [];
    if (Array.isArray(raw)) arr = raw;
    else if (Array.isArray(raw?.data)) arr = raw.data;
    else if (Array.isArray(raw?.items)) arr = raw.items;
    else if (Array.isArray(raw?.result)) arr = raw.result;
    else if (Array.isArray(raw?.data?.data)) arr = raw.data.data;

    let categories = (arr || [])
      .map((c: any) => ({
        id: c?.categoryId ?? c?.id ?? c?.code ?? null,
        name: c?.name ?? c?.description ?? c?.displayName ?? c?.code ?? null,
      }))
      .filter((x: any) => x.id != null && x.name != null);

    // Fallback to sub-categories if no categories found
    if (!categories.length) {
      const sub = await axios.get(`${TAT_API_BASE_URL}/places/sub-categories`, {
        headers: {
          "x-api-key": TAT_API_KEY!,
          "Accept-Language": TAT_DEFAULT_LANG,
        },
        timeout: 10000,
      });
      const raw2 = sub.data;
      let arr2: any[] = [];
      if (Array.isArray(raw2)) arr2 = raw2;
      else if (Array.isArray(raw2?.data)) arr2 = raw2.data;
      categories = (arr2 || [])
        .map((s: any) => ({
          id: s?.subCategoryId ?? s?.id ?? null,
          name: s?.name ?? null,
        }))
        .filter((x: any) => x.id != null && x.name != null);
    }

    // Return categories with placeholder count (check in background async)
    const result = { items: categories.map((c) => ({ ...c, count: -1 })) };
    categoryCountCache.set(cacheKey, { data: result, timestamp: Date.now() });

    // Async: Check count for each category in background (don't wait)
    (async () => {
      const itemsWithCount = await Promise.all(
        categories.map(async (cat) => {
          try {
            const checkRes = await axios.get(`${TAT_API_BASE_URL}/places`, {
              headers: {
                "x-api-key": TAT_API_KEY!,
                "Accept-Language": TAT_DEFAULT_LANG,
              },
              params: {
                place_category_id: cat.id,
                limit: 1,
                page: 1,
                has_introduction: "true",
                has_name: "true",
                has_thumbnail: "true",
              },
              timeout: 10000,
            });
            const count = checkRes.data?.pagination?.total ?? 0;
            return { ...cat, count };
          } catch (e) {
            console.warn(`[TAT] Failed to check category ${cat.id}:`, e);
            return { ...cat, count: 0 };
          }
        })
      );

      // Update cache with actual counts
      const resultWithCounts = { items: itemsWithCount };
      categoryCountCache.set(cacheKey, { data: resultWithCounts, timestamp: Date.now() });
      console.log(`[TAT] Categories count cache updated: ${itemsWithCount.length} items`);
    })();

    return res.json(result);
  } catch (err: any) {
    console.error("[TAT] categories-with-count error:", err.response?.data || err.message);
    res.status(500).json({
      message: "Failed to fetch categories with count",
      detail: err.response?.data || err.message,
    });
  }
});

export default router;
