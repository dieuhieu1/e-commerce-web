import AdminSidebar from "@/components/Sidebar/AdminSidebar";
import { useAuthStore } from "@/lib/zustand/useAuthStore";
import { useProductStore } from "@/lib/zustand/useProductStore";
import path from "@/ultils/path";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminLayout = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { fetchProductsCategory } = useProductStore();
  useEffect(() => {
    fetchProductsCategory();
  }, []);
  if (!isAuthenticated && !user && user.role !== "admin") {
    <Navigate to={`/${path.LOGIN}`} replace={true} />;
  }
  return (
    <div className="flex w-full bg-white min-h-screen relative text-black">
      <div className="w-[327px] flex-none top-0 bottom-0 fixed">
        <AdminSidebar />
      </div>
      <div className="w-[327px]"></div>
      <div className="flex-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
