import { defineStore } from "pinia";
import api from "@/lib/axios";

export const useStaggingStore = defineStore("stagging", {
  state: () => ({
    data: null,
    ready: false,
  }),

  actions: {
    async fetch() {
      if (this.ready) return; // ✅ prevent refetch

      try {
        const res = await api.get("/api/dashboard/settings/destination-stagging");
        this.data = res.data;
      } catch {
        this.data = { code: null, slug: null };
      } finally {
        this.ready = true;
      }
    },
  },
});
