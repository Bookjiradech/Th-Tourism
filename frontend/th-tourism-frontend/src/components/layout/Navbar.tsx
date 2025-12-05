// src/components/layout/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-bold text-2xl text-blue-600 hover:text-blue-700">
          🇹🇭 TH-Tourism
        </Link>
        <nav className="flex gap-6 items-center text-sm font-medium">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            หน้าหลัก
          </Link>
          <Link to="/explore" className="hover:text-blue-600 transition-colors">
            สำรวจ
          </Link>
          
          {token && (
            <Link to="/favorites" className="hover:text-blue-600 transition-colors">
              ❤️ รายการโปรด
            </Link>
          )}
          
          {user?.role === "admin" && (
            <Link to="/admin/tourism" className="hover:text-blue-600 transition-colors">
              🔧 จัดการ
            </Link>
          )}

          {token ? (
            <div className="flex items-center gap-4 ml-4 border-l pl-4">
              <span className="text-gray-700">
                {user?.email}
                {user?.role === "admin" && (
                  <span className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                    ADMIN
                  </span>
                )}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          ) : (
            <div className="flex gap-3 ml-4 border-l pl-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                สมัครสมาชิก
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
