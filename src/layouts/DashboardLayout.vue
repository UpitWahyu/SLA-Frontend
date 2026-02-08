<template>
  <div class="flex h-screen bg-gray-900 text-white overflow-hidden">
    <!-- SIDEBAR (tidak ikut scroll) -->
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- OVERLAY MOBILE -->
    <div v-if="sidebarOpen" @click="sidebarOpen = false" class="fixed inset-0 bg-black/50 z-30 md:hidden" />

    <!-- MAIN (SATU-SATUNYA YANG SCROLL) -->
    <main class="flex-1 overflow-y-auto p-6">
      <!-- TOPBAR MOBILE -->
      <div class="flex items-center mb-6 md:hidden">
        <button @click="sidebarOpen = true" class="text-2xl">☰</button>
        <h1 class="ml-4 font-semibold">Dashboard</h1>
      </div>

      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Sidebar from "@/components/sidebar/Sidebar.vue";

const sidebarOpen = ref(false);
</script>
