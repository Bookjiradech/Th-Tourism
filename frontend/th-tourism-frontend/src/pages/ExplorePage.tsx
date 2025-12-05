// C:\File\TH-TOURISM\frontend\th-tourism-frontend\src\pages\ExplorePage.tsx
// src/pages/ExplorePage.tsx
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchTTD, setProvinceId, setPage } from "../store/slices/tourismSlice";
import Pagination from "../components/common/Pagination";
import ThailandMap from "../components/common/ThailandMap";
import { getProvinces, type Province } from "../services/apiClient";

// อนุญาตให้ id เป็น string หรือ number (บาง API ส่ง code เป็น string)
interface SelectItem {
  id: string | number;
  name: string | null;
}

// แปลง string → number เฉพาะกรณีเป็นตัวเลขจริง ๆ (กัน NaN)
const toMaybeNumber = (v: string) => {
  if (v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

const PAGE_SIZE = 12;

export default function ExplorePage() {
  const dispatch = useAppDispatch();
  const { items, loading, provinceId, page, totalPage } = useAppSelector((s) => s.tourism);
  const { token } = useAppSelector((s) => s.auth);
  const [provinces, setProvinces] = useState<SelectItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchText, setSearchText] = useState("");
  const [prov, setProv] = useState<string>(provinceId != null ? String(provinceId) : "");
  const filteredProvinces = provinces.filter((p: SelectItem) =>
    (p.name || "").toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    (async () => {
      try {
        const pRes = await getProvinces();
        const pItems = (pRes.items as Province[]).map((p) => ({
          id: (p as any).id,
          name: (p as any).name ?? null,
        }));
        setProvinces(pItems);
      } catch (err: any) {
        // handle error silently
      }
    })();
  }, []);

  useEffect(() => {
    if (token) {
      loadFavorites();
    }
  }, [token]);

  const loadFavorites = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const favSet = new Set<string>();
        data.forEach((fav: any) => {
          if (fav.externalSource && fav.externalId) {
            favSet.add(`${fav.externalSource}_${fav.externalId}`);
          } else if (fav.tourismLocalId) {
            favSet.add(`local_${fav.tourismLocalId}`);
          }
        });
        setFavorites(favSet);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (place: any) => {
    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนเพิ่มรายการโปรด");
      return;
    }

    const placeId = place.id?.toString() || "";
    const isLocal = place.isLocal || placeId.startsWith("local_");
    const favoriteKey = isLocal ? placeId : `TAT_${placeId}`;
    const isFavorited = favorites.has(favoriteKey);

    try {
      if (isFavorited) {
        // Remove favorite
        const res = await fetch("http://localhost:3000/api/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const allFavorites = await res.json();
          const targetFav = allFavorites.find((f: any) => {
            if (isLocal) {
              const localId = parseInt(placeId.replace("local_", ""));
              return f.tourismLocalId === localId;
            } else {
              return f.externalSource === "TAT" && f.externalId === placeId;
            }
          });
          
          if (targetFav) {
            await fetch(`http://localhost:3000/api/favorites/${targetFav.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites((prev) => {
              const newSet = new Set(prev);
              newSet.delete(favoriteKey);
              return newSet;
            });
          }
        }
      } else {
        // Add favorite with full data
        const payload = isLocal
          ? { tourismLocalId: parseInt(placeId.replace("local_", "")) }
          : { 
              externalSource: "TAT", 
              externalId: placeId,
              externalName: place.name || "",
              externalDetail: place.introduction || "",
              externalImage: place.thumbnail || "",
              externalProvince: place.province || ""
            };

        const res = await fetch("http://localhost:3000/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setFavorites((prev) => new Set([...prev, favoriteKey]));
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const pid = toMaybeNumber(prov);
      dispatch(setProvinceId(pid ?? null));
      dispatch(setPage(1));
      dispatch(
        fetchTTD({
          provinceId: pid,
          page: 1,
          limit: PAGE_SIZE,
        })
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [prov, dispatch]);

  const handleMapClick = (provinceName: string) => {
    const found = provinces.find((p) => p.name === provinceName);
    if (found) setProv(String(found.id));
  };

  const changePage = (p: number) => {
    const pid = toMaybeNumber(prov);
    dispatch(setPage(p));
    dispatch(
      fetchTTD({
        provinceId: pid,
        page: p,
        limit: PAGE_SIZE,
      })
    );
  };
  // Two-column layout: map at left, results at right
  return (
    <div className="flex flex-row gap-4 h-screen overflow-hidden bg-linear-to-br from-blue-100 via-white to-blue-50">
      {/* Left: Map & province selector */}
      <div className="w-1/2 shrink-0 flex flex-col p-4 overflow-hidden">
        {/* Search Dropdown */}
        <div className="w-full mb-3">
          <label htmlFor="province-search" className="block text-sm font-semibold text-blue-900 mb-1">ค้นหาจังหวัด</label>
          <input
            id="province-search"
            ref={searchRef}
            type="text"
            className="w-full rounded-lg border border-blue-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm"
            placeholder="พิมพ์ชื่อจังหวัด..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <div className="relative mt-2">
            <select
              className="w-full rounded-lg border border-blue-200 px-3 py-2 bg-white text-sm shadow-sm cursor-pointer"
              value={prov}
              onChange={e => setProv(e.target.value)}
            >
              <option value="">-- เลือกจังหวัด --</option>
              {filteredProvinces.map((p: SelectItem) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Map Container */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <ThailandMap
            selectedProvinceName={
              provinces.find((p) => String(p.id) === String(prov))?.name || undefined
            }
            onProvinceClick={handleMapClick}
            provinces={provinces.map((p) => ({ id: Number(p.id), name: p.name || "" }))}
          />
        </div>
      </div>

      {/* Right: Results */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-bold text-blue-900">Explore Thailand</h1>
          {items.length > 0 && (
            <span className="text-sm text-gray-600">{items.length} สถานที่</span>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-blue-600 text-lg font-semibold animate-pulse">Loading...</span>
          </div>
        ) : (
          <>
            {items.length === 0 ? (
              <div className="text-gray-500 text-center mt-16 text-lg">ไม่พบข้อมูลสถานที่ท่องเที่ยว</div>
            ) : (
              <>
                {/* Scrollable Results */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-blue-100">
                  {items.map((place) => {
                    const placeId = place.id?.toString() || "";
                    const isLocal = (place as any).isLocal || placeId.startsWith("local_");
                    const favoriteKey = isLocal ? placeId : `TAT_${placeId}`;
                    const isFavorited = favorites.has(favoriteKey);

                    return (
                      <div
                        key={place.id}
                        className="flex flex-row gap-4 p-4 bg-white/90 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200 items-start relative"
                      >
                        {/* Local Badge */}
                        {isLocal && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          ✨ Local
                        </div>
                      )}

                      <img
                        src={place.thumbnail || "/default-image.jpg"}
                        alt={place.name || ""}
                        className="rounded-lg object-cover w-20 h-20 shrink-0 border border-blue-200 shadow-sm"
                      />
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="font-bold text-blue-900 text-base truncate">{place.name}</div>
                        <div className="text-blue-700 text-xs">{place.province}</div>
                        <div className="text-gray-700 text-xs line-clamp-2">{place.introduction}</div>
                      </div>

                      {/* Favorite Button */}
                      {token && (
                        <button
                          onClick={() => toggleFavorite(place)}
                          className={`p-2 rounded-full transition-all duration-200 shrink-0 ${
                            isFavorited
                              ? "bg-red-500 text-white hover:bg-red-600"
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          }`}
                          title={isFavorited ? "ลบจากรายการโปรด" : "เพิ่มในรายการโปรด"}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill={isFavorited ? "currentColor" : "none"}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}
                </div>

                {/* Pagination */}
                {totalPage && totalPage > 1 && (
                  <div className="mt-3 shrink-0">
                    <Pagination page={page} totalPage={totalPage} onChangePage={changePage} />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
