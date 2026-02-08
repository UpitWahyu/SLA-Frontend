<template>
  <aside :class="['fixed md:static inset-y-0 left-0 z-40 w-64', 'bg-gray-800 border-r border-gray-700', 'transform transition-transform', open ? 'translate-x-0' : '-translate-x-full', 'md:translate-x-0']">
    <div class="flex flex-col h-full">
      <!-- LOGO -->
      <div class="flex items-center justify-center h-16 border-b border-gray-700">
        <img src="@/assets/img/logo.webp" class="w-9 h-9 rounded-full" />
        <span class="ml-2 font-bold text-pink-500">Dashboard</span>
      </div>

      <!-- MENU -->
      <nav class="flex-1 p-4 space-y-1">
        <SidebarItem to="/dashboard">
          <template #icon>
            <!-- Custom Home SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 50 50">
              <path
                d="M 25 1.0507812 C 24.7825 1.0507812 24.565859 1.1197656 24.380859 1.2597656 L 1.3808594 19.210938 C 0.95085938 19.550938 0.8709375 20.179141 1.2109375 20.619141 C 1.5509375 21.049141 2.1791406 21.129062 2.6191406 20.789062 L 4 19.710938 L 4 46 C 4 46.55 4.45 47 5 47 L 19 47 L 19 29 L 31 29 L 31 47 L 45 47 C 45.55 47 46 46.55 46 46 L 46 19.710938 L 47.380859 20.789062 C 47.570859 20.929063 47.78 21 48 21 C 48.3 21 48.589063 20.869141 48.789062 20.619141 C 49.129063 20.179141 49.049141 19.550938 48.619141 19.210938 L 25.619141 1.2597656 C 25.434141 1.1197656 25.2175 1.0507812 25 1.0507812 z M 35 5 L 35 6.0507812 L 41 10.730469 L 41 5 L 35 5 z"
              ></path>
            </svg>
          </template>
          Home
        </SidebarItem>

        <SidebarItem v-if="authStore.role === 'owner' || authStore.role === 'developer'" to="/dashboard/users">
          <template #icon>
            <!-- User SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 16 16" height="16" width="16">
              <desc>People Fill Streamline Icon: https://streamlinehq.com</desc>
              <path d="M7 14s-1 0 -1 -1 1 -4 5 -4 5 3 5 4 -1 1 -1 1zm4 -6a3 3 0 1 0 0 -6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0 -1.355 0.68 -2.75 1.936 -3.72A6.3 6.3 0 0 0 5 9c-4 0 -5 3 -5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0 -5 2.5 2.5 0 0 0 0 5" stroke-width="1"></path>
            </svg>
          </template>
          Account
        </SidebarItem>

        <SidebarItem v-if="authStore.role === 'owner' || authStore.role === 'developer'" to="/dashboard/stagging">
          <template #icon>
            <!-- Database SVG -->
            <svg class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 -64 640 640">
              <path
                d="M504 352H136.4c-4.4 0-8 3.6-8 8l-.1 48c0 4.4 3.6 8 8 8H504c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm0 96H136.1c-4.4 0-8 3.6-8 8l-.1 48c0 4.4 3.6 8 8 8h368c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm0-192H136.6c-4.4 0-8 3.6-8 8l-.1 48c0 4.4 3.6 8 8 8H504c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm106.5-139L338.4 3.7a48.15 48.15 0 0 0-36.9 0L29.5 117C11.7 124.5 0 141.9 0 161.3V504c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8V256c0-17.6 14.6-32 32.6-32h382.8c18 0 32.6 14.4 32.6 32v248c0 4.4 3.6 8 8 8h80c4.4 0 8-3.6 8-8V161.3c0-19.4-11.7-36.8-29.5-44.3z"
              />
            </svg>
          </template>
          Stagging
        </SidebarItem>

        <SidebarItem to="/dashboard/settings">
          <template #icon>
            <!-- Document SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 50 50">
              <path
                d="M47.16,21.221l-5.91-0.966c-0.346-1.186-0.819-2.326-1.411-3.405l3.45-4.917c0.279-0.397,0.231-0.938-0.112-1.282 l-3.889-3.887c-0.347-0.346-0.893-0.391-1.291-0.104l-4.843,3.481c-1.089-0.602-2.239-1.08-3.432-1.427l-1.031-5.886 C28.607,2.35,28.192,2,27.706,2h-5.5c-0.49,0-0.908,0.355-0.987,0.839l-0.956,5.854c-1.2,0.345-2.352,0.818-3.437,1.412l-4.83-3.45 c-0.399-0.285-0.942-0.239-1.289,0.106L6.82,10.648c-0.343,0.343-0.391,0.883-0.112,1.28l3.399,4.863 c-0.605,1.095-1.087,2.254-1.438,3.46l-5.831,0.971c-0.482,0.08-0.836,0.498-0.836,0.986v5.5c0,0.485,0.348,0.9,0.825,0.985 l5.831,1.034c0.349,1.203,0.831,2.362,1.438,3.46l-3.441,4.813c-0.284,0.397-0.239,0.942,0.106,1.289l3.888,3.891 c0.343,0.343,0.884,0.391,1.281,0.112l4.87-3.411c1.093,0.601,2.248,1.078,3.445,1.424l0.976,5.861C21.3,47.647,21.717,48,22.206,48 h5.5c0.485,0,0.9-0.348,0.984-0.825l1.045-5.89c1.199-0.353,2.348-0.833,3.43-1.435l4.905,3.441 c0.398,0.281,0.938,0.232,1.282-0.111l3.888-3.891c0.346-0.347,0.391-0.894,0.104-1.292l-3.498-4.857 c0.593-1.08,1.064-2.222,1.407-3.408l5.918-1.039c0.479-0.084,0.827-0.5,0.827-0.985v-5.5C47.999,21.718,47.644,21.3,47.16,21.221z M25,32c-3.866,0-7-3.134-7-7c0-3.866,3.134-7,7-7s7,3.134,7,7C32,28.866,28.866,32,25,32z"
              ></path>
            </svg>
          </template>
          Settings
        </SidebarItem>
      </nav>

      <!-- BOTTOM -->
      <SidebarBottom />
    </div>
  </aside>
</template>

<script setup>
import SidebarItem from "./SidebarItem.vue";
import SidebarBottom from "./SidebarBottom.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
authStore.loadUserFromToken();

defineProps({
  open: Boolean,
});
defineEmits(["close"]);
</script>
