import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TourismPlace {
  id: number;
  type: number;
  name: string;
  detail?: string;
  province?: string;
  district?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  introImage?: string;
  url?: string;
  isOpen: boolean;
  createdAt: string;
}

export default function AdminTourismManagePage() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<TourismPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    type: 1,
    name: "",
    detail: "",
    province: "",
    district: "",
    region: "",
    latitude: "",
    longitude: "",
    introImage: "",
    url: "",
    isOpen: true,
  });

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/api/tourism", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPlaces(data);
    } catch (error) {
      console.error("Error loading places:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    const payload = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
    };

    try {
      const url = editingId
        ? `http://localhost:3000/api/tourism/${editingId}`
        : "http://localhost:3000/api/tourism";
      
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingId ? "อัปเดตสำเร็จ!" : "เพิ่มสถานที่สำเร็จ!");
        resetForm();
        loadPlaces();
      } else {
        const error = await res.json();
        alert("เกิดข้อผิดพลาด: " + (error.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleEdit = (place: TourismPlace) => {
    setEditingId(place.id);
    setFormData({
      type: place.type,
      name: place.name,
      detail: place.detail || "",
      province: place.province || "",
      district: place.district || "",
      region: place.region || "",
      latitude: place.latitude?.toString() || "",
      longitude: place.longitude?.toString() || "",
      introImage: place.introImage || "",
      url: place.url || "",
      isOpen: place.isOpen,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบสถานที่นี้?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:3000/api/tourism/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        alert("ลบสำเร็จ!");
        loadPlaces();
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      type: 1,
      name: "",
      detail: "",
      province: "",
      district: "",
      region: "",
      latitude: "",
      longitude: "",
      introImage: "",
      url: "",
      isOpen: true,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-900">จัดการสถานที่ท่องเที่ยว (Admin)</h1>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            กลับหน้าหลัก
          </button>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
        >
          {showForm ? "ยกเลิก" : "+ เพิ่มสถานที่ใหม่"}
        </button>

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              {editingId ? "แก้ไขสถานที่" : "เพิ่มสถานที่ใหม่"}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">ชื่อสถานที่ * (name)</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="เช่น วัดพระแก้ว"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">ประเภท (type)</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value={1}>สถานที่ท่องเที่ยว</option>
                  <option value={2}>ที่พัก</option>
                  <option value={3}>ร้านอาหาร</option>
                  <option value={4}>ร้านค้าของฝาก</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">รายละเอียด (introduction)</label>
                <textarea
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={4}
                  placeholder="รายละเอียดสถานที่ท่องเที่ยว (จะแสดงเป็น introduction ในหน้าสำรวจ)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">จังหวัด * (province)</label>
                <input
                  type="text"
                  required
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="เช่น กรุงเทพมหานคร"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">อำเภอ (district)</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="เช่น พระนคร"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">ภาค (region)</label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">-- เลือกภาค --</option>
                  <option value="ภาคเหนือ">ภาคเหนือ</option>
                  <option value="ภาคอีสาน">ภาคอีสาน</option>
                  <option value="ภาคกลาง">ภาคกลาง</option>
                  <option value="ภาคตะวันออก">ภาคตะวันออก</option>
                  <option value="ภาคใต้">ภาคใต้</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="13.7563"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="100.5018"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">URL รูปภาพ * (thumbnail)</label>
                <input
                  type="url"
                  required
                  value={formData.introImage}
                  onChange={(e) => setFormData({ ...formData, introImage: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">จะแสดงเป็น thumbnail ในหน้าสำรวจ</p>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-semibold mb-1">URL เว็บไซต์ (url)</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="https://example.com"
                />
              </div>

              <div className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isOpen}
                  onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-semibold">เปิดให้บริการ (จะแสดงในหน้าสำรวจ)</label>
              </div>

              <div className="col-span-2 flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  {editingId ? "บันทึกการแก้ไข" : "เพิ่มสถานที่"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">ชื่อสถานที่</th>
                <th className="px-4 py-3 text-left">จังหวัด</th>
                <th className="px-4 py-3 text-left">ภาค</th>
                <th className="px-4 py-3 text-center">สถานะ</th>
                <th className="px-4 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : places.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    ยังไม่มีข้อมูลสถานที่
                  </td>
                </tr>
              ) : (
                places.map((place) => (
                  <tr key={place.id} className="border-b hover:bg-blue-50">
                    <td className="px-4 py-3">{place.id}</td>
                    <td className="px-4 py-3 font-semibold">{place.name}</td>
                    <td className="px-4 py-3">{place.province || "-"}</td>
                    <td className="px-4 py-3">{place.region || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          place.isOpen
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {place.isOpen ? "เปิด" : "ปิด"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleEdit(place)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 mr-2"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(place.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
