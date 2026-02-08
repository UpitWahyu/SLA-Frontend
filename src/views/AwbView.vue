<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6">
    <!-- Loading -->
    <div v-if="loading" class="text-center text-gray-400">Loading...</div>

    <!-- Slug tidak valid -->
    <div v-else-if="!isValid" class="flex items-center justify-center h-[60vh]">
      <h1 class="text-xl font-semibold text-gray-400">Link tidak tersedia</h1>
    </div>

    <!-- Content -->
    <div v-else class="max-w-6xl mx-auto">
      <div class="mb-4 flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-1">Data AWB</h1>
          <p class="text-gray-400">Stagging: {{ stagging?.code }}</p>
        </div>

        <RouterLink :to="{ name: 'scan', params: { slug } }" class="ml-3 shrink-0 px-5 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-sm transition"> Scan </RouterLink>
      </div>

      <!-- FILTER -->
      <div class="flex flex-wrap gap-3 mb-4 items-center">
        <!-- Date -->
        <input type="date" v-model="selectedDate" @change="fetchAwb" class="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm" />

        <!-- UZ -->
        <select v-model="selectedUz" @change="fetchAwb" class="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm">
          <option value="">Semua UZ</option>
          <option v-for="uz in uzList" :key="uz.code" :value="uz.code">
            {{ uz.code }}
          </option>
        </select>
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto rounded-lg border border-gray-700">
        <table class="w-full text-sm">
          <thead class="bg-gray-800 text-gray-300">
            <tr>
              <th class="p-2 text-left">AWB</th>
              <th class="p-2 text-left">Receiver</th>
              <th class="p-2 text-left">Alamat</th>
              <th class="p-2 text-left">UZ</th>
              <th class="p-2 text-left">Produk</th>
              <th class="p-2 text-left">Terakhir Scan</th>
              <th class="p-2 text-left">SLA</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="row in awbList" :key="row.awb_no" class="border-t border-gray-700 hover:bg-gray-800">
              <td class="p-2 font-mono text-pink-400">
                {{ row.awb_no }}
              </td>
              <td class="p-2">{{ row.receiver_name }}</td>
              <td class="p-2">{{ row.receiver_address }}</td>
              <td class="p-2">{{ row.destination_uz }}</td>
              <td class="p-2">{{ row.produk }}</td>
              <td class="p-2">{{ formatTimestamp(row.scan_time) }}</td>
              <td class="p-2 text-xs text-gray-400">
                {{ row.sla_day }}
              </td>
            </tr>

            <tr v-if="!awbList.length">
              <td colspan="7" class="p-4 text-center text-gray-500">Tidak ada data</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/lib/axios";
import { formatTimestamp } from "@/utils/date";

const route = useRoute();
const slug = route.params.slug;

const loading = ref(true);
const isValid = ref(false);

const stagging = ref(null);

const awbList = ref([]);
const uzList = ref([]);

const selectedDate = ref(new Date().toISOString().slice(0, 10));
const selectedUz = ref("");

// ================= SLUG =================

const checkSlug = async () => {
  try {
    const res = await api.get(`/api/public/stagging/${slug}`);

    if (res.data.valid) {
      isValid.value = true;
      stagging.value = res.data.stagging;

      await fetchUz();
      await fetchAwb();
    }
  } catch {
    isValid.value = false;
  } finally {
    loading.value = false;
  }
};

// ================= UZ =================

async function fetchUz() {
  try {
    const res = await api.get(`/api/public/data-uz`, {
      params: { slug },
    });

    uzList.value = Array.isArray(res.data.data) ? res.data.data : [];
  } catch (err) {
    uzList.value = [];
  }
}

// ================= AWB =================

async function fetchAwb() {
  if (!slug) return;

  try {
    const res = await api.get("/api/public/data-awb", {
      params: {
        slug,
        date: selectedDate.value,
        uz: selectedUz.value || undefined,
      },
    });

    awbList.value = Array.isArray(res.data.data) ? res.data.data : [];
  } catch (err) {
    awbList.value = [];
  }
}

onMounted(checkSlug);
</script>
