// src/pages/HomePage.tsx
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAppSelector((s) => s.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-blue-900 mb-6 animate-fade-in">
              🇹🇭 Thailand Tourism
            </h1>
            <p className="text-2xl text-gray-700 mb-8 max-w-3xl mx-auto">
              ค้นพบสถานที่ท่องเที่ยวสุดพิเศษทั่วประเทศไทย
              <br />
              พร้อมระบบจัดการรายการโปรดและข้อมูลครบถ้วน
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate("/explore")}
                className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                🗺️ เริ่มสำรวจ
              </button>
              {!user && (
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 shadow-lg hover:shadow-xl border-2 border-blue-600 transform hover:-translate-y-1 transition-all duration-200"
                >
                  ✨ สมัครสมาชิก
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-bounce">🏖️</div>
        <div className="absolute top-40 right-20 text-6xl opacity-20 animate-bounce delay-100">🏔️</div>
        <div className="absolute bottom-20 left-1/4 text-6xl opacity-20 animate-bounce delay-200">🏛️</div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-blue-900 mb-12">
          ✨ ฟีเจอร์เด่น
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-blue-500">
            <div className="text-5xl mb-4 text-center">🗺️</div>
            <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">
              แผนที่ประเทศไทย
            </h3>
            <p className="text-gray-600 text-center">
              เลือกจังหวัดผ่านแผนที่ SVG แบบ interactive 
              ครอบคลุมทั้ง 77 จังหวัด
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-green-500">
            <div className="text-5xl mb-4 text-center">❤️</div>
            <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">
              รายการโปรด
            </h3>
            <p className="text-gray-600 text-center">
              บันทึกสถานที่โปรดของคุณ พร้อมข้อมูลครบถ้วน
              เรียกดูได้ทุกที่ทุกเวลา
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-t-4 border-purple-500">
            <div className="text-5xl mb-4 text-center">🔧</div>
            <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">
              จัดการข้อมูล (Admin)
            </h3>
            <p className="text-gray-600 text-center">
              เพิ่ม แก้ไข ลบ สถานที่ท่องเที่ยว
              แสดงผลทันทีในหน้าสำรวจ
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">77</div>
              <div className="text-xl opacity-90">จังหวัด</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">1000+</div>
              <div className="text-xl opacity-90">สถานที่ท่องเที่ยว</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">🗺️</div>
              <div className="text-xl opacity-90">แผนที่แบบ SVG</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">🔥</div>
              <div className="text-xl opacity-90">อัปเดตตลอดเวลา</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-6">
          พร้อมเริ่มต้นการผจญภัยแล้วหรือยัง?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          สำรวจสถานที่ท่องเที่ยวทั่วไทยและบันทึกรายการโปรดของคุณ
        </p>
        <button
          onClick={() => navigate("/explore")}
          className="px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-xl font-bold rounded-full hover:from-blue-700 hover:to-blue-900 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
        >
          🚀 เริ่มสำรวจเลย!
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg mb-2">🇹🇭 Thailand Tourism Directory</p>
          <p className="text-gray-400">
            ข้อมูลจาก TAT API + Local Database | © 2025
          </p>
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin/tourism")}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              🔧 จัดการระบบ (Admin)
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}

