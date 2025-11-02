import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useDealDailyStore = create(
  persist(
    (set) => ({
      dealDaily: null,
      endTime: null,
      setDealDaily: (deal, endTime) => set({ dealDaily: deal, endTime }),
      clearDeal: () => set({ dealDaily: null, endTime: null }),
    }),
    {
      name: "deal-daily-storage", // key lưu trong localStorage
    }
  )
);
