// src/pages/PlaceDetailPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/apiClient";

export default function PlaceDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await api.getTTD({ id });
        setData(res.data);
      } catch (e: any) {
        setErr(e?.message || "failed");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (err) return <div className="p-4 text-red-500">{err}</div>;
  if (!data) return null;

  const p = data?.data || data; // บาง endpoint ห่อด้วย {data:{...}}
  const images: string[] = p?.desktopImageUrls || p?.mobileImageUrls || (Array.isArray(p?.thumbnailUrl) ? p.thumbnailUrl : []);

  return (
    <div className="p-4 space-y-3">
      <Link to="/" className="text-blue-600">&larr; Back</Link>
      <h1 className="text-2xl font-semibold">{p?.name || "-"}</h1>
      <div className="text-gray-600">
        {p?.location?.province?.name || ""} {p?.location?.district?.name ? `• ${p.location.district.name}` : ""}
      </div>
      {images?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {images.slice(0, 6).map((u, i) => (
            <img key={i} src={u} className="w-full h-48 object-cover rounded" />
          ))}
        </div>
      )}
      {p?.information?.introduction && (
        <div className="whitespace-pre-wrap">{p.information.introduction}</div>
      )}
    </div>
  );
}
