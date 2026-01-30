<template>
  <DashboardLayout>
    <div class="text-white">
      <h1 class="text-2xl font-semibold mb-4">Pengaturan</h1>
      <hr class="h-px my-5 bg-white border-0" />

      <!-- GRID UNTUK SEMUA CARD -->
      <div v-if="!loading && !error" class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        <!-- CARD -->
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-5 w-full">
          <span class="block text-gray-400 text-sm mb-2"> Link Scan: </span>

          <div class="bg-gray-900 rounded-lg p-3 border border-gray-700 mb-4">
            <span class="block text-pink-400 break-all">
              {{ fullLink }}
            </span>
          </div>

          <div class="flex flex-wrap gap-3">
            <button @click="regenerateLink" class="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 transition">Generate ulang</button>

            <button @click="copyLink" class="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition">Copy link</button>
          </div>
        </div>

        <!-- CARD BARU (contoh placeholder) -->
        <!--
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-5">
          Card lain
        </div>
        -->
      </div>

      <!-- STATE -->
      <p v-if="loading" class="text-gray-400">Memeriksa assignment...</p>

      <p v-if="error" class="text-red-400">
        {{ error }}
      </p>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import api from "@/lib/axios";

const loading = ref(true);
const error = ref("");
const stagging = ref(null);

const fullLink = computed(() => {
  if (!stagging.value) return "";
  return `${window.location.origin}/s/${stagging.value.slug}`;
});

const fetchstagging = async () => {
  try {
    const res = await api.get("/api/dashboard/settings/destination-stagging");
    stagging.value = res.data; // { code, slug }
  } catch (err) {
    error.value = err.response?.data?.message || "User belum diassign ke stagging";
  } finally {
    loading.value = false;
  }
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(fullLink.value);
    alert("Link berhasil disalin");
  } catch {
    alert("Gagal menyalin link");
  }
};

const regenerateLink = async () => {
  try {
    await api.post("/api/dashboard/settings/destination-stagging", {
      code: stagging.value.code, // kirim kode stagging
    });

    await fetchstagging(); // ambil slug baru
    alert("Link berhasil digenerate ulang");
  } catch (err) {
    console.error(err);
    alert("Gagal generate ulang link");
  }
};

onMounted(fetchstagging);
</script>
