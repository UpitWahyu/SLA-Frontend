<template>
  <DashboardLayout>
    <h1 class="text-2xl font-bold mb-1">Data Stagging</h1>
    <p class="text-gray-400 mb-6">List semua stagging beserta slug dan UZ</p>

    <!-- GRID -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="s in staggingList" :key="s.id" class="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
        <!-- TOP -->
        <div class="flex items-start justify-between">
          <div>
            <div class="font-semibold text-lg">{{ s.code }}</div>
            <div class="text-xs text-gray-400">
              Link:
              <span class="font-mono text-pink-400">{{ s.slug }}</span>
            </div>
          </div>
        </div>

        <!-- UZ -->
        <div>
          <div class="text-gray-400 text-xs mb-1">UZ</div>

          <div v-if="s.uz?.length" class="flex flex-wrap gap-2">
            <span v-for="u in s.uz" :key="u.id" class="px-2 py-0.5 rounded bg-gray-700/60 text-xs font-mono text-blue-400">
              {{ u.code }}
            </span>
          </div>

          <div v-else class="text-gray-500 italic text-xs">Tidak ada UZ</div>
        </div>
      </div>
    </div>

    <div v-if="!staggingList.length" class="text-center text-gray-500 mt-10">Tidak ada data</div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import api from "@/lib/axios";

const staggingList = ref([]);

async function fetchStagging() {
  try {
    const res = await api.get("/api/stagging");
    staggingList.value = Array.isArray(res.data.data) ? res.data.data : [];
  } catch (err) {
    console.error("Gagal ambil stagging:", err);
    staggingList.value = [];
  }
}

onMounted(() => {
  fetchStagging();
});
</script>
