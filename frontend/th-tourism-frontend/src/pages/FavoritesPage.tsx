import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";

interface FavoriteItem {
  id: number;
  userId: number;
  tourismLocalId?: number;
  externalSource?: string;
  externalId?: string;
  externalName?: string;
  externalDetail?: string;
  externalImage?: string;
  externalProvince?: string;
  createdAt: string;
  tourismLocal?: {
    id: number;
    name: string;
    detail?: string;
    province?: string;
    introImage?: string;
  };
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { token } = useAppSelector((s) => s.auth);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadFavorites();
  }, [token, navigate]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/api/favorites/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFavorites((prev) => prev.filter((f) => f.id !== id));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-900">❤️ รายการโปรดของฉัน</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            กลับหน้าหลัก
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <span className="text-blue-600 text-lg font-semibold animate-pulse">
              Loading...
            </span>
          </div>
        ) : favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-xl mb-4">ยังไม่มีรายการโปรด</p>
            <p className="text-gray-400 mb-6">เริ่มเพิ่มสถานที่ท่องเที่ยวที่คุณชื่นชอบกันเถอะ!</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              ไปหน้าสำรวจ
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {favorites.map((fav) => {
              const isLocal = !!fav.tourismLocal;
              const name = isLocal
                ? fav.tourismLocal?.name
                : (fav.externalName || `สถานที่จาก TAT (ID: ${fav.externalId})`);
              const province = isLocal 
                ? fav.tourismLocal?.province 
                : (fav.externalProvince || "ไม่ระบุ");
              const detail = isLocal 
                ? fav.tourismLocal?.detail 
                : (fav.externalDetail || "ข้อมูลจาก Thailand Tourism Directory");
              const image = isLocal
                ? fav.tourismLocal?.introImage || "/default-image.jpg"
                : (fav.externalImage || "/default-image.jpg");

              return (
                <div
                  key={fav.id}
                  className="flex flex-row gap-6 p-6 bg-white rounded-2xl border border-blue-100 shadow-md hover:shadow-lg transition-shadow duration-200 items-start relative"
                >
                  {isLocal && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✨ Local
                    </div>
                  )}
                  {!isLocal && fav.externalSource === "TAT" && (
                    <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      🌏 TAT
                    </div>
                  )}

                  <img
                    src={image}
                    alt={name || ""}
                    className="rounded-xl object-cover w-32 h-32 shrink-0 border border-blue-200 shadow-sm"
                  />

                  <div className="flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-blue-900 text-xl">{name}</h3>
                    <p className="text-blue-700 text-sm">📍 {province}</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{detail}</p>
                    <p className="text-gray-400 text-xs mt-2">
                      เพิ่มเมื่อ: {new Date(fav.createdAt).toLocaleDateString("th-TH")}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="ลบจากรายการโปรด"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
