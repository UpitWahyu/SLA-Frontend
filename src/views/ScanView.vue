<template>
  <div class="min-h-screen bg-gray-900 text-white p-4">
    <!-- LOADING -->
    <div v-if="loading" class="flex items-center justify-center h-[60vh]">
      <p class="text-gray-400">Memeriksa link...</p>
    </div>

    <!-- INVALID SLUG -->
    <div v-else-if="!isValid" class="flex flex-col items-center justify-center h-[60vh] text-center">
      <h1 class="text-xl font-semibold text-red-400 mb-2">Link tidak valid</h1>
      <p class="text-sm text-gray-400">Link scan ini sudah tidak aktif atau tidak ditemukan.</p>
    </div>

    <!-- VALID -->
    <div v-else class="max-w-md mx-auto">
      <!-- Header -->
      <div class="mb-4 flex items-start justify-between">
        <div>
          <h1 class="text-lg font-semibold text-pink-500">Scan Barcode</h1>
          <p v-if="stagging" class="text-sm text-gray-400">Destination: {{ stagging.code }}</p>
        </div>

        <!-- BUTTON DASHBOARD -->
        <RouterLink v-if="auth.user" to="/dashboard" class="ml-3 shrink-0 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-sm transition">Dashboard</RouterLink>
      </div>

      <!-- Scanner Card -->
      <div class="bg-gray-800 border border-gray-700 rounded-xl p-3 shadow-lg">
        <!-- Video -->
        <div class="relative rounded-lg overflow-hidden bg-black">
          <video ref="video" class="w-full h-[40vh] md:h-[55vh] object-cover" playsinline />

          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-4/5 h-20 border-2 border-pink-500/60 rounded-md"></div>
          </div>
        </div>

        <!-- INPUT HASIL SCAN -->
        <div class="mt-4 space-y-2">
          <label class="text-xs text-gray-400"> Hasil Scan / Input Manual </label>

          <input v-model="scannedText" type="text" placeholder="Scan barcode atau ketik manual" class="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 text-pink-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />

          <button @click="submitScan" class="w-full mt-2 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition">Submit</button>
        </div>
      </div>

      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" @click.self="closeModal">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-5 w-full max-w-sm">
          <h2 class="text-lg font-semibold text-pink-500 mb-3">Hasil Scan</h2>

          <div class="space-y-2 text-sm">
            <div>
              <span class="text-gray-400">AWB</span>
              <div class="font-mono text-pink-400">
                {{ scanResult.awb_no }}
              </div>
            </div>

            <div>
              <span class="text-gray-400">Produk</span>
              <div>{{ scanResult.produk }}</div>
            </div>

            <div>
              <span class="text-gray-400">Receiver</span>
              <div>{{ scanResult.receiver_name }}</div>
            </div>

            <div>
              <span class="text-gray-400">Alamat</span>
              <div class="text-xs">
                {{ scanResult.receiver_address }}
              </div>
            </div>

            <div>
              <span class="text-gray-400">SLA Date</span>
              <div>{{ scanResult.sla_day }}</div>
            </div>

            <div>
              <span class="text-gray-400">Terakhir Scan</span>
              <div>{{ formatTimestamp(scanResult.scan_time) }}</div>
            </div>
          </div>

          <button class="mt-4 w-full bg-pink-600 hover:bg-pink-700 rounded-lg py-2" @click="closeModal">Tutup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute, RouterLink, onBeforeRouteLeave } from "vue-router";
import api from "@/lib/axios";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType, BrowserMultiFormatReader } from "@zxing/library";
import { useAuthStore } from "@/stores/auth";
import { formatTimestamp } from "@/utils/date";

const auth = useAuthStore();
auth.loadUserFromToken();

const route = useRoute();
const slug = route.params.slug;

const loading = ref(true);
const isValid = ref(false);
const stagging = ref(null);

const video = ref(null);
const scannedText = ref("");

const showModal = ref(false);
const scanResult = ref({});
const isSubmitting = ref(false);

let reader;
let controls;
let lastText = "";
let lastTime = 0;
let modalTimer = null;

const checkSlug = async () => {
  try {
    const res = await api.get(`/api/public/stagging/${slug}`);
    if (res.data.valid) {
      isValid.value = true;
      stagging.value = res.data.stagging;
    }
  } catch {
    isValid.value = false;
  } finally {
    loading.value = false;
  }
};

const initScanner = async () => {
  const hints = new Map();

  // ✅ Semua 1D barcode
  hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128, BarcodeFormat.CODE_39, BarcodeFormat.CODE_93, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.ITF, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E, BarcodeFormat.CODABAR, BarcodeFormat.RSS_14, BarcodeFormat.RSS_EXPANDED]);

  // bantu scanner lebih agresif
  hints.set(DecodeHintType.TRY_HARDER, true);
  hints.set(DecodeHintType.PURE_BARCODE, false);

  reader = new BrowserMultiFormatReader(hints);

  controls = await reader.decodeFromConstraints(
    {
      video: {
        facingMode: { ideal: "environment" },

        // ✅ naikkan resolusi
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },

        // optional: minta frame rate lebih tinggi
        frameRate: { ideal: 30 },
      },
    },
    video.value,
    (result) => {
      if (result && !showModal.value) {
        const text = result.getText();
        const now = Date.now();

        if (text !== lastText || now - lastTime > 1500) {
          scannedText.value = text;
          lastText = text;
          lastTime = now;
        }
      }
    },
  );
};

const submitScan = async () => {
  if (!scannedText.value || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    const res = await api.post("/api/public/scan-awb", {
      awb_no: scannedText.value,
      stagging_code: stagging.value.code,
    });

    scanResult.value = res.data;
    showModal.value = true;

    stopScanner();

    modalTimer = setTimeout(() => {
      closeModal();
    }, 5000);
  } catch (err) {
    alert("Barcode tidak valid");
  } finally {
    setTimeout(() => {
      isSubmitting.value = false;
    }, 800);
  }
};

const closeModal = async () => {
  showModal.value = false;

  if (modalTimer) {
    clearTimeout(modalTimer);
    modalTimer = null;
  }

  await startScanner();
};

const stopScanner = () => {
  controls?.stop();
  controls = null;
};

const startScanner = async () => {
  if (controls) return; // sudah jalan
  await initScanner();
};

const handleVisibility = async () => {
  if (document.hidden) {
    // tab tidak aktif → stop kamera
    stopScanner();
  } else {
    // balik ke tab → nyalakan lagi (kalau modal tidak tampil)
    if (!showModal.value && isValid.value) {
      await startScanner();
    }
  }
};

onMounted(async () => {
  await checkSlug();
  if (isValid.value) await initScanner();

  document.addEventListener("visibilitychange", handleVisibility);
});

onUnmounted(() => {
  controls?.stop();
  document.removeEventListener("visibilitychange", handleVisibility);
});

onBeforeRouteLeave(() => {
  controls?.stop();

  if (video.value?.srcObject) {
    video.value.srcObject.getTracks().forEach((t) => t.stop());
  }
});

watch(scannedText, (val) => {
  if (val && !showModal.value) {
    submitScan();
  }
});
</script>
