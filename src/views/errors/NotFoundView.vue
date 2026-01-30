<template>
  <main class="grid min-h-screen place-items-center bg-gray-900 px-6 py-24">
    <div class="text-center">
      <p class="text-base font-semibold text-pink-400">404</p>

      <h1 class="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-7xl">Page not found</h1>

      <p class="mt-6 text-lg font-medium text-gray-400 sm:text-xl">Sorry, we couldn’t find the page you’re looking for.</p>

      <div class="mt-10 flex items-center justify-center gap-x-6">
        <RouterLink v-if="authStore.user" to="/dashboard" class="rounded-md bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"> Go back dashboard </RouterLink>

        <RouterLink v-if="!authStore.user" to="/" class="rounded-md bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"> Go back home </RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
authStore.loadUserFromToken();
</script>
