<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import SidebarItem from "./SidebarItem.vue";

const router = useRouter();
const token = ref(localStorage.getItem("token"));

const logout = () => {
  localStorage.removeItem("token");
  token.value = null;
  router.push("/");
};
</script>

<template>
  <div class="border-t border-gray-700 p-4 space-y-2">
    <SidebarItem class="w-full text-left px-4 py-2 rounded-lg hover:bg-pink-600/20 hover:text-pink-400 transition" to="/settings">⚙️ Account Settings</SidebarItem>

    <button @click="logout" class="w-full text-left px-4 py-2 rounded-lg cursor-pointer hover:bg-pink-600/20 hover:text-pink-400 text-red-400 transition">🚪 Logout</button>
  </div>
</template>
