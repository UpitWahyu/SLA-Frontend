<template>
  <section class="bg-gray-900 min-h-screen">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
      <!-- LOGO -->
      <div class="mb-6 flex justify-center">
        <img src="@/assets/img/logo.webp" alt="logo" class="w-24 h-24 rounded-full" />
      </div>

      <!-- BOX -->
      <div class="w-full bg-gray-800 rounded-lg shadow sm:max-w-md border border-gray-700">
        <!-- SLUG FORM -->
        <div v-if="!showLogin" class="p-6 space-y-4 sm:p-8">
          <h1 class="text-xl font-bold text-white text-center">Masukkan Kode Stagging</h1>

          <div>
            <input v-model="slug" placeholder="contoh: 9pGi0U" class="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
          </div>

          <p v-if="slugError" class="text-sm text-pink-400">
            {{ slugError }}
          </p>

          <button @click="submitSlug" :disabled="checkingSlug" class="w-full cursor-pointer text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-500 rounded-lg px-5 py-2.5 transition disabled:opacity-60">
            {{ checkingSlug ? "Checking..." : "Submit" }}
          </button>

          <button class="w-full cursor-pointer text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:ring-pink-500 rounded-lg px-5 py-2.5 transition disabled:opacity-60" @click="showLogin = true">Login</button>
        </div>

        <!-- LOGIN FORM -->
        <div v-else class="p-6 space-y-4 sm:p-8">
          <h1 class="text-xl font-bold text-white text-center">Login</h1>

          <form class="space-y-4" @submit.prevent="login">
            <div>
              <label class="text-gray-300 block mb-1">Username</label>
              <input type="text" v-model="username" placeholder="Username" class="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
            </div>

            <div>
              <label class="text-gray-300 block mb-1">Password</label>
              <input type="password" v-model="password" placeholder="••••••" class="w-full p-2.5 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-pink-500 focus:border-pink-500" />
            </div>

            <p v-if="error" class="text-sm text-pink-400">
              {{ error }}
            </p>

            <button type="submit" class="w-full text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-500 rounded-lg px-5 py-2.5 transition">Sign in</button>
          </form>

          <!-- BACK BUTTON -->
          <button class="w-full text-sm text-gray-400 hover:text-white transition mt-2" @click="showLogin = false">← Kembali</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import api from "@/lib/axios";
import { useRouter } from "vue-router";

const router = useRouter();

const slug = ref("");
const slugError = ref("");
const showLogin = ref(false);
const checkingSlug = ref(false);

const username = ref("");
const password = ref("");
const error = ref("");
const authStore = useAuthStore();

const submitSlug = async () => {
  slugError.value = "";
  checkingSlug.value = true;

  const cleanSlug = extractSlug(slug.value);

  if (!cleanSlug) {
    slugError.value = "Kode tidak valid";
    checkingSlug.value = false;
    return;
  }

  try {
    await api.get(`/api/public/stagging/${cleanSlug}`);

    // simpan slug valid
    localStorage.setItem("slug", cleanSlug);

    // redirect manual (sesuai requirement kamu)
    window.location.href = `/s/${cleanSlug}`;
  } catch (e) {
    slugError.value = "Slug tidak ditemukan";
  } finally {
    checkingSlug.value = false;
  }
};

const login = async () => {
  error.value = "";
  try {
    await authStore.login(username.value, password.value);
  } catch (err) {
    error.value = err.message;
  }
};

const extractSlug = (input) => {
  if (!input) return "";

  // trim spasi
  const val = input.trim();

  // jika full URL
  try {
    if (val.startsWith("http")) {
      const url = new URL(val);
      // ambil path terakhir setelah /s/
      const match = url.pathname.match(/\/s\/([^/]+)/);
      return match ? match[1] : "";
    }
  } catch (e) {
    // abaikan jika URL tidak valid
  }

  // jika hanya slug
  return val;
};

onMounted(() => {
  const savedSlug = localStorage.getItem("slug");
  if (savedSlug) {
    slug.value = savedSlug;
  }
});
</script>
