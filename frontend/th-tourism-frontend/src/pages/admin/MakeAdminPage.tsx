import { useState } from "react";

export default function MakeAdminPage() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const makeAdmin = async () => {
    if (!email) {
      alert("กรุณากรอกอีเมล");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/make-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(`✅ สำเร็จ! ${data.message}`);
        setEmail("");
      } else {
        const error = await res.json();
        setResult(`❌ ผิดพลาด: ${error.error}`);
      }
    } catch (error) {
      setResult(`❌ เกิดข้อผิดพลาด: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-purple-900 mb-6 text-center">
          👑 สร้าง Admin
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              อีเมลที่ต้องการเป็น Admin
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={makeAdmin}
            disabled={loading}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "กำลังดำเนินการ..." : "ทำให้เป็น Admin"}
          </button>

          {result && (
            <div
              className={`p-4 rounded-lg ${
                result.startsWith("✅")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {result}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-2">📝 วิธีใช้:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>สมัครสมาชิกก่อนที่หน้า Register</li>
              <li>กรอกอีเมลที่สมัครไว้ด้านบน</li>
              <li>กดปุ่ม "ทำให้เป็น Admin"</li>
              <li>Logout แล้ว Login ใหม่</li>
              <li>จะเห็นเมนู Admin ใน Navbar</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
