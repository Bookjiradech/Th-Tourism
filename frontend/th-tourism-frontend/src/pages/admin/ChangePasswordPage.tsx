import { useState } from "react";

export default function ChangePasswordPage() {
  const [email, setEmail] = useState("admin@test.com");
  const [newPassword, setNewPassword] = useState("password");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const changePassword = async () => {
    if (!email || !newPassword) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (newPassword.length < 8) {
      alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        setResult(`✅ สำเร็จ! ${data.message}`);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6 text-center">
          🔑 เปลี่ยนรหัสผ่าน
        </h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              อีเมล
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@test.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รหัสผ่านใหม่
            </label>
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              ต้องมีอย่างน้อย 8 ตัวอักษร
            </p>
          </div>

          <button
            onClick={changePassword}
            disabled={loading}
            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
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

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
            <p className="font-semibold mb-2">⚠️ สำหรับ admin@test.com:</p>
            <p>รหัสผ่านเดิม: ยฟหหไนพก</p>
            <p>เปลี่ยนเป็น: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
