<template>
  <router-link :to="to" class="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-pink-600/20 hover:text-pink-400 transition" :class="{ 'bg-gray-700 text-white': isActive, 'text-gray-300': !isActive }">
    <slot name="icon" />
    <span class="text-sm font-medium">
      <slot />
    </span>
  </router-link>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, defineProps } from "vue";

const props = defineProps({
  to: { type: String, required: true },
});

const route = useRoute();

// cek apakah route sekarang sama dengan "to"
const isActive = computed(() => route.path === props.to);
</script>
