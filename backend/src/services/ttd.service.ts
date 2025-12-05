import axios from "axios";
import { env } from "../config/env";
import { prisma } from "../config/prisma";

type TtdParams = {
  Lang?: "th" | "en" | "zh";
  Skip?: number;
  Limit?: number;
  Type?: number;
  ProvinceCode?: number;
};

const endpoint = "https://api.thailandtourismdirectory.go.th/openapi/read";

type CacheEntry = { data: any; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1000;

function keyOf(payload: any) {
  return JSON.stringify(payload);
}

export async function fetchTtd(params: TtdParams) {
  const payload = {
    APIKey: env.TTD_API_KEY,
    SecretKey: env.TTD_SECRET_KEY,
    Lang: params.Lang ?? env.TTD_DEFAULT_LANG,
    Skip: params.Skip ?? 0,
    Limit: params.Limit ?? 20,
    Type: params.Type ?? 1,
    ProvinceCode: params.ProvinceCode
  };

  const key = keyOf(payload);
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const { data } = await axios.post(endpoint, payload);
  cache.set(key, { data, expiresAt: Date.now() + TTL_MS });
  return data;
}

// ฟังก์ชันรวมข้อมูล TAT API กับข้อมูลจาก Database
export async function fetchTtdWithLocal(params: TtdParams) {
  // ดึงข้อมูลจาก TAT API
  const tatData = await fetchTtd(params);
  
  // ดึงข้อมูลจาก Database (TourismLocal)
  const localPlaces = await prisma.tourismLocal.findMany({
    where: {
      isOpen: true,
      ...(params.Type && { type: params.Type }),
      ...(params.ProvinceCode && { 
        province: { 
          // จะต้องมี mapping ระหว่าง province code กับชื่อจังหวัด
          // ตอนนี้ใช้แค่ filter ด้วย province string
        } 
      })
    },
    orderBy: { createdAt: "desc" }
  });

  // แปลง local places ให้อยู่ในรูปแบบเดียวกับ TAT API
  const localItems = localPlaces.map(place => ({
    id: `local_${place.id}`,
    name: place.name,
    introduction: place.detail,
    province: place.province,
    district: place.district,
    region: place.region,
    thumbnail: place.introImage,
    url: place.url,
    latitude: place.latitude ? parseFloat(place.latitude.toString()) : null,
    longitude: place.longitude ? parseFloat(place.longitude.toString()) : null,
    isLocal: true, // flag เพื่อแยกว่ามาจาก DB
    createdAt: place.createdAt
  }));

  // รวมข้อมูล - ข้อมูล Local แสดงก่อนเสมอ (เรียงใหม่สุดก่อน)
  const tatItems = tatData.items || [];
  const combinedItems = [...localItems, ...tatItems];

  return {
    ...tatData,
    items: combinedItems,
    totalLocal: localItems.length,
    totalTAT: tatItems.length,
    total: combinedItems.length
  };
}
