import { useAuthStore } from "@/lib/zustand/useAuthStore";
import path from "@/ultils/path";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const MemberLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated || !user) {
    <Navigate to={`/${path.LOGIN}`} replace={true} />;
  }
  return (
    <div>
      MemberLayout <Outlet />
    </div>
  );
};

export default MemberLayout;
