<template>
  <section class="bg-gray-900 min-h-screen">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
      <!-- LOGO DI LUAR BOX -->
      <div class="mb-6 flex justify-center">
        <img src="@/assets/img/anteraja.png" alt="Anteraja" class="w-24 h-24 rounded-full shadow-lg shadow-pink-500/30" />
      </div>

      <!-- BOX LOGIN -->
      <div class="w-full bg-gray-800 rounded-lg shadow sm:max-w-md border border-gray-700">
        <div class="p-6 space-y-4 sm:p-8">
          <h1 class="text-xl font-bold text-white text-center">Admin Login</h1>

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
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const username = ref("");
const password = ref("");
const error = ref("");
const authStore = useAuthStore();

const login = async () => {
  error.value = "";
  try {
    await authStore.login(username.value, password.value);
  } catch (err) {
    error.value = err.message;
  }
};
</script>
