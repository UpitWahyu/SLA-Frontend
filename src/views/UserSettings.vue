<template>
  <DashboardLayout>
    <h1 class="text-2xl font-bold mb-1">Settings</h1>

    <div class="max-w-md bg-gray-800 border border-gray-700 rounded-xl p-6">
      <form @submit.prevent="submit">
        <!-- PASSWORD LAMA -->
        <div class="mb-4">
          <label class="text-sm text-gray-400 mb-1 block">Password Lama</label>
          <input v-model="oldPassword" type="password" class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" placeholder="Masukkan password lama" />
        </div>

        <!-- PASSWORD BARU -->
        <div class="mb-4">
          <label class="text-sm text-gray-400 mb-1 block">Password Baru</label>
          <input v-model="password" type="password" class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" placeholder="Masukkan password baru" />
        </div>

        <!-- KONFIRMASI -->
        <div class="mb-6">
          <label class="text-sm text-gray-400 mb-1 block">Konfirmasi Password</label>
          <input v-model="confirmPassword" type="password" class="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm" placeholder="Ulangi password" />
        </div>

        <button :disabled="loading" class="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 py-2 rounded text-sm">
          {{ loading ? "Menyimpan..." : "Simpan Password" }}
        </button>
      </form>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import api from "@/lib/axios";

const oldPassword = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const submit = async () => {
  if (!oldPassword.value) return alert("Password lama wajib diisi");

  if (!password.value) return alert("Password baru wajib diisi");

  if (password.value !== confirmPassword.value) return alert("Password baru tidak sama");

  try {
    loading.value = true;

    await api.post("/api/auth/change-password", {
      oldPassword: oldPassword.value,
      newPassword: password.value,
    });

    alert("Password berhasil diubah");

    oldPassword.value = "";
    password.value = "";
    confirmPassword.value = "";
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.message || "Gagal update password");
  } finally {
    loading.value = false;
  }
};
</script>
