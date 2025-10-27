import Header from "@/components/Header/Header";
import MemberSidebar from "@/components/Sidebar/MemberSidebar";
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
    <div className="flex">
      <MemberSidebar />
      <div className="flex-auto bg-gray-100 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default MemberLayout;
