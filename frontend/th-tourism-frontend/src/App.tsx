// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { setCredentials } from "./store/slices/authSlice";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FavoritesPage from "./pages/FavoritesPage";
import AdminTourismManagePage from "./pages/admin/AdminTourismManagePage";
import MakeAdminPage from "./pages/admin/MakeAdminPage";
import ChangePasswordPage from "./pages/admin/ChangePasswordPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";

function App() {
  const dispatch = useAppDispatch();

  // Restore auth state from localStorage on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setCredentials({ user, token }));
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tourism"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminTourismManagePage />
              </ProtectedRoute>
            }
          />
          <Route path="/make-admin" element={<MakeAdminPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
