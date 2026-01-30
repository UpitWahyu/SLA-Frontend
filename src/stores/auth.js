import { defineStore } from "pinia";
import axios from "axios";
import router from "../router";
import { jwtDecode } from "jwt-decode"; // fix import untuk Vite

const API_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    role: "",
    user: null,
  }),
  actions: {
    async login(username, password) {
      try {
        const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });

        this.token = res.data.token;
        localStorage.setItem("token", this.token);

        // decode token
        const decoded = jwtDecode(this.token);
        this.role = decoded.role;
        this.user = { id: decoded.id, role: this.role, username };

        // redirect berdasarkan role
        // if (this.role === "owner") router.push("/owner-dashboard");
        // else if (this.role === "admin") router.push("/admin-dashboard");
        // else router.push("/developer-dashboard");
        router.push("/dashboard");
      } catch (err) {
        console.error("Login error:", err);
        throw new Error(err.response?.data?.message || "Login gagal");
      }
    },

    logout() {
      this.token = "";
      this.role = "";
      this.user = null;
      localStorage.removeItem("token");
      router.push("/login");
    },

    loadUserFromToken() {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          this.token = token;
          this.role = decoded.role;
          this.user = { id: decoded.id, role: decoded.role };
        } catch {
          this.logout();
        }
      }
    },
  },
});
