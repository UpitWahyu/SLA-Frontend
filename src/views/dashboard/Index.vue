<template>
  <DashboardLayout>
    <h1 class="text-2xl font-bold">Data AWB</h1>

    <!-- Tombol Upload -->
    <button v-if="authStore.role === 'owner'" @click="showModal = true" class="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded shadow">Upload XLSX</button>

    <!-- HEADER TABLE -->
    <div class="flex flex-col gap-3 mt-6 mb-3 md:flex-row md:items-center md:justify-between">
      <h2 class="text-lg font-semibold">List AWB</h2>

      <div class="flex flex-wrap items-center gap-2">
        <button @click="exportPng" class="p-2 rounded hover:bg-gray-700 transition" title="Export PNG">
          <!-- download icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
          </svg>
        </button>

        <button @click="showColumnModal = true" class="p-2 rounded hover:bg-gray-700 transition" title="Pilih Kolom">
          <!-- Gear SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11.983 5.5a1.5 1.5 0 013 0v.338a7.97 7.97 0 012.173.904l.24-.24a1.5 1.5 0 112.121 2.121l-.24.24c.39.68.69 1.418.904 2.173h.338a1.5 1.5 0 010 3h-.338a7.97 7.97 0 01-.904 2.173l.24.24a1.5 1.5 0 11-2.121 2.121l-.24-.24a7.97 7.97 0 01-2.173.904v.338a1.5 1.5 0 01-3 0v-.338a7.97 7.97 0 01-2.173-.904l-.24.24a1.5 1.5 0 11-2.121-2.121l.24-.24a7.97 7.97 0 01-.904-2.173h-.338a1.5 1.5 0 010-3h.338a7.97 7.97 0 01.904-2.173l-.24-.24a1.5 1.5 0 112.121-2.121l.24.24a7.97 7.97 0 012.173-.904V5.5z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>

        <!-- STAGGING -->
        <select v-if="isOwner" v-model="selectedStagging" @change="onStaggingChange" class="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm">
          <option value="">Pilih Stagging</option>
          <option v-for="s in staggingList" :key="s.id" :value="s">
            {{ s.code }}
          </option>
        </select>

        <!-- FILTER UZ -->
        <select v-model="selectedUz" @change="fetchAwb" class="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm">
          <option value="">Semua UZ</option>
          <option v-for="u in uzList" :key="u.id" :value="u.code">
            {{ u.code }}
          </option>
        </select>

        <!-- FILTER TANGGAL -->
        <input type="date" v-model="selectedDate" @change="fetchAwb" class="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm" />
      </div>
    </div>

    <!-- TABLE -->
    <div ref="tableRef" class="overflow-x-auto rounded-lg border border-gray-700">
      <table class="w-full text-sm">
        <thead class="bg-gray-800 text-gray-300">
          <tr>
            <th v-for="h in selectedHeaders" :key="h" class="p-2 text-left">{{ columnConfig[h]?.label || h.replaceAll("_", " ") }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, i) in awbList" :key="i" class="border-t border-gray-700 hover:bg-gray-800">
            <td v-for="h in selectedHeaders" key="h" class="p-2" :class="cellClass(h, row[h])">{{ cellValue(h, row[h]) }}</td>
          </tr>

          <tr v-if="!awbList.length">
            <td colspan="4" class="p-4 text-center text-gray-500">Tidak ada data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="fade">
      <div v-if="showColumnModal" @click.self="showColumnModal = false" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-5 w-full max-w-sm">
          <h3 class="text-lg font-semibold mb-4">Pilih Kolom</h3>

          <div class="grid grid-cols-2 gap-2 text-sm max-h-60 overflow-auto">
            <label v-for="h in allHeaders" :key="h" class="flex items-center gap-2">
              <input type="checkbox" :value="h" v-model="selectedHeaders" />
              {{ columnConfig[h]?.label || h.replaceAll("_", " ") }}
            </label>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button class="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700" @click="selectedHeaders = [...allHeaders]">Reset</button>
            <button class="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700" @click="showColumnModal = false">Tutup</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modal -->
    <transition v-if="authStore.role === 'owner'" name="fade">
      <div v-if="showModal" @click.self="showModal = false" class="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
        <div class="bg-gray-800 rounded-lg w-96 p-6 relative">
          <h2 class="text-lg font-semibold mb-4">Upload File XLSX</h2>

          <!-- Close Button -->
          <button @click="showModal = false" class="absolute top-2 right-2 text-gray-400 hover:text-white">✕</button>

          <!-- Form Upload -->
          <form @submit.prevent="handleUpload">
            <input type="file" accept=".xlsx,.xls" @change="handleFileChange" class="mb-4 w-full rounded p-2 text-gray-200 bg-gray-700" />

            <div class="flex justify-end gap-2">
              <button type="button" @click="showModal = false" class="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700 text-white">Cancel</button>
              <button type="submit" :disabled="!file || uploading" class="px-3 py-1 rounded flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white disabled:opacity-60 disabled:cursor-not-allowed">
                <svg v-if="uploading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>

                <span>
                  {{ uploading ? "Uploading..." : "Upload" }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/lib/axios";
import { formatTimestamp } from "@/utils/date";
import * as htmlToImage from "html-to-image";

const authStore = useAuthStore();
authStore.loadUserFromToken();

const showModal = ref(false);
const file = ref(null);

const awbList = ref([]);
const selectedDate = ref(new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10));

const uzList = ref([]);
const selectedUz = ref("");

const isOwner = computed(() => ["owner", "developer"].includes(authStore.role));
const staggingList = ref([]);
const selectedStagging = ref(null);

const excludedKeys = ["ingest_time", "destination_stagging"];
const selectedHeaders = ref([]);

const COLUMN_STORAGE_KEY = "awb_selected_columns";

const showColumnModal = ref(false);
const uploading = ref(false);

const tableRef = ref(null);

const columnConfig = {
  awb_no: {
    label: "AWB",
    order: 1,
  },
  receiver_name: {
    label: "Receiver",
    order: 2,
  },
  receiver_address: {
    label: "Alamat Receiver",
    order: 3,
  },
  receiver_district_name: {
    label: "Kecamatan",
    order: 4,
  },
  destination_uz: {
    label: "UZ",
    order: 5,
  },
  produk: {
    label: "Produk",
    order: 6,
  },
  flag_cod: {
    label: "COD",
    order: 7,
  },
  channel: {
    label: "Channel",
    order: 8,
  },
  scan_time: {
    label: "Terakhir Scan",
    order: 9,
  },
  sla_day: {
    label: "SLA",
    order: 10,
  },
};

const allHeaders = computed(() => {
  if (!awbList.value.length) return [];

  return Object.keys(awbList.value[0])
    .filter((k) => !excludedKeys.includes(k))
    .sort((a, b) => {
      const oa = columnConfig[a]?.order ?? 999;
      const ob = columnConfig[b]?.order ?? 999;
      return oa - ob;
    });
});

const exportPng = async () => {
  if (!tableRef.value) return;

  try {
    const dataUrl = await htmlToImage.toPng(tableRef.value, {
      backgroundColor: "#111827", // gray-900 biar sesuai theme
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = `awb-${selectedDate.value}.png`;

    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Export PNG gagal:", err);
    alert("Gagal export PNG");
  }
};

async function fetchStagging() {
  try {
    const res = await api.get("/api/stagging");
    staggingList.value = res.data?.data || [];

    if (staggingList.value.length) {
      selectedStagging.value = staggingList.value[0];
      onStaggingChange(); // isi UZ + fetchAwb
    }
  } catch (err) {
    console.error("Gagal ambil stagging", err);
    staggingList.value = [];
  }
}

function onStaggingChange() {
  if (!selectedStagging.value) {
    uzList.value = [];
    selectedUz.value = "";
    fetchAwb();
    return;
  }

  uzList.value = selectedStagging.value.uz || [];
  selectedUz.value = "";
  fetchAwb();
}

const cellClass = (key, value) => {
  if (key === "awb_no") return "text-pink-400 font-mono font-semibold";

  if (key === "sla_day") return "text-xs text-gray-400";

  return "";
};

const cellValue = (key, value) => {
  if (key === "scan_time") return formatTimestamp(value);
  return value;
};

watch(
  allHeaders,
  (val) => {
    if (!val.length) return;

    const saved = localStorage.getItem(COLUMN_STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // ambil hanya header yang masih ada + urutkan sesuai allHeaders
        selectedHeaders.value = val.filter((h) => parsed.includes(h));
      } catch {
        selectedHeaders.value = [...val];
      }
    } else {
      // default: semua kolom
      selectedHeaders.value = [...val];
    }
  },
  { immediate: true },
);

watch(selectedHeaders, (val) => {
  // paksa urutan ikut allHeaders
  const ordered = allHeaders.value.filter((h) => val.includes(h));

  if (JSON.stringify(val) !== JSON.stringify(ordered)) {
    selectedHeaders.value = ordered;
    return;
  }

  // simpan ke localStorage
  localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(ordered));
});

// dummy data untuk non admin

function handleFileChange(e) {
  file.value = e.target.files[0] || null;
}

async function fetchAwb() {
  try {
    const res = await api.get("/api/dashboard/awb-date", {
      params: {
        date: selectedDate.value,
        destination_uz: selectedUz.value || undefined,
        stagging_code: selectedStagging.value?.code || undefined,
      },
    });

    awbList.value = Array.isArray(res.data.data) ? res.data.data : [];
  } catch (err) {
    console.error(err);
    awbList.value = [];
  }
}

async function fetchUz() {
  try {
    const res = await api.get("/api/dashboard/uz");
    uzList.value = Array.isArray(res.data) ? res.data : res.data.data || [];
  } catch (err) {
    console.error("Gagal ambil UZ", err);
    uzList.value = [];
  }
}

onMounted(() => {
  if (!isOwner.value) {
    fetchUz(); // kalau masih dipakai admin
    fetchAwb();
  } else {
    fetchStagging();
  }
});

async function handleUpload() {
  if (!file.value || uploading.value) return;

  uploading.value = true;

  try {
    const formData = new FormData();
    formData.append("file", file.value);

    const { data } = await api.post("/api/dashboard/upload/xlsx", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    showModal.value = false;
    file.value = null;

    await fetchAwb();

    alert(`Upload sukses (${data.stored} rows)`);
  } catch (err) {
    console.error("UPLOAD ERROR:", err?.response?.data || err);
    alert(err?.response?.data?.message || "Upload gagal");
  } finally {
    uploading.value = false;
  }
}
</script>

<style>
/* Animasi fade modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
