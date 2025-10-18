import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetCurrentUser,
} from "../../apis/authApi";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      register: async (userData) => {
        set({ isLoading: true });
        try {
          const data = await apiRegister(userData);
          toast.success("Đăng ký thành công!");
          return data;
        } catch (error) {
          toast.error(error?.response?.data?.message || "Đăng ký thất bại!");
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const data = await apiLogin(credentials);
          const { accessToken, userData } = data;

          set({
            accessToken,
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success("Đăng nhập thành công!");
          return data;
        } catch (error) {
          set({ isLoading: false });
          toast.error(
            error?.response?.data?.message || "Sai thông tin đăng nhập!"
          );
          return null;
        }
      },

      // 🔴 Đăng xuất
      logout: async () => {
        const accessToken = get().accessToken;
        try {
          if (accessToken) await apiLogout(accessToken);
        } catch (error) {
          console.warn("Logout request failed, clearing local data only.");
        } finally {
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });
          toast.success("Đăng xuất thành công!");
        }
      },

      // 🟡 Kiểm tra đăng nhập (vd: auto login khi reload)
      checkAuth: async () => {
        const accessToken = get().accessToken;
        if (!accessToken) {
          set({ isAuthenticated: false });
          return false;
        }
        try {
          const user = await apiGetCurrentUser(accessToken);
          set({ user, isAuthenticated: true });
          return true;
        } catch {
          set({ isAuthenticated: false, user: null, accessToken: null });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
