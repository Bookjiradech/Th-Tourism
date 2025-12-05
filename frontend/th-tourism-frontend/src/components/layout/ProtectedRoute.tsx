// src/components/layout/ProtectedRoute.tsx
// src/components/layout/ProtectedRoute.tsx
// src/components/layout/ProtectedRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../store/hooks";

type Props = {
  children: ReactNode;
  requiredRole?: "admin";
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, token } = useAppSelector((s) => s.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
