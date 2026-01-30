<template>
  <DashboardLayout>
    <!-- HEADER -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">Users</h1>

      <button v-if="canCreateUser" @click="showCreateModal = true" class="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 px-3 py-2 rounded-lg text-sm">
        <span class="text-lg">+</span>
        Tambah User
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="u in users" :key="u.id" class="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
        <!-- TOP -->
        <div class="flex items-start justify-between">
          <div class="font-semibold text-lg">{{ u.username }}</div>

          <span :class="roleClass(u.role)" class="text-xs px-2 py-0.5 rounded capitalize">
            {{ u.role }}
          </span>
        </div>

        <!-- STAGGING -->
        <div class="text-sm">
          <div class="text-gray-400 text-xs mb-1">Stagging</div>

          <div v-if="u.staggingCode" class="inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-700/60">
            <span class="text-pink-400 font-mono">{{ u.staggingCode }}</span>
          </div>

          <div v-else class="text-gray-500 italic px-2 py-1 text-xs">Tidak terhubung</div>
        </div>

        <!-- BUTTON BAR (DI ATAS FOOTER) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <button v-if="canCreateUser" @click="openEdit(u)" class="flex-1 py-1.5 rounded bg-pink-600 hover:bg-pink-700 text-xs">Edit</button>

          <button v-if="canCreateUser" @click="deleteUser(u)" class="flex-1 py-1.5 rounded bg-red-700 hover:bg-red-800 text-xs">Delete</button>
        </div>

        <!-- FOOTER -->
        <div class="pt-2 border-t border-gray-700 text-xs text-gray-400">Dibuat: {{ formatDate(u.createdAt) }}</div>
      </div>

      <!-- CREATE USER MODAL -->
      <div v-if="showCreateModal" @click.self="showCreateModal = false" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="bg-gray-800 border border-gray-700 rounded-xl p-5 w-full max-w-sm">
          <h2 class="text-lg font-semibold mb-4">Tambah User</h2>

          <div class="space-y-3 text-sm">
            <!-- USERNAME -->
            <div>
              <label class="text-gray-400 text-xs">Username</label>
              <input v-model="form.username" class="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-700" placeholder="username" />
            </div>

            <!-- PASSWORD -->
            <div>
              <label class="text-gray-400 text-xs">Password</label>
              <input v-model="form.password" type="password" class="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-700" placeholder="password" />
            </div>

            <!-- ROLE -->
            <div>
              <label class="text-gray-400 text-xs">Role</label>
              <select v-model="form.role" class="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-700">
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
              </select>
            </div>

            <!-- STAGGING -->
            <div>
              <label class="text-gray-400 text-xs">Stagging</label>
              <select v-model="form.staggingCode" class="w-full mt-1 p-2 rounded bg-gray-900 border border-gray-700">
                <option value="">Tidak ada</option>

                <option v-for="s in staggingList" :key="s.id" :value="s.code">
                  {{ s.code }}
                </option>
              </select>
            </div>
          </div>

          <!-- ACTION -->
          <div class="flex justify-end gap-2 mt-5">
            <button @click="showCreateModal = false" class="px-3 py-1 rounded bg-gray-600 hover:bg-gray-700">Cancel</button>

            <button @click="createUser" :disabled="creating" class="px-3 py-1 rounded bg-pink-600 hover:bg-pink-700 disabled:opacity-50">
              {{ creating ? "Saving..." : "Create" }}
            </button>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div v-if="showEditModal" @click.self="showEditModal = false" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div class="bg-gray-800 w-96 rounded p-6 relative">
            <h2 class="text-lg font-semibold mb-4">Edit User</h2>

            <button @click="showEditModal = false" class="absolute right-3 top-2 text-gray-400 hover:text-white">✕</button>

            <div class="space-y-3">
              <div>
                <label class="text-xs text-gray-400">Username</label>
                <input v-model="editForm.username" class="w-full p-2 bg-gray-900 border border-gray-700 rounded" />
              </div>

              <div>
                <label class="text-xs text-gray-400">Password (optional)</label>
                <input type="password" v-model="editForm.password" class="w-full p-2 bg-gray-900 border border-gray-700 rounded" />
              </div>

              <div>
                <label class="text-xs text-gray-400">Stagging</label>
                <select v-model="editForm.staggingCode" class="w-full p-2 bg-gray-900 border border-gray-700 rounded">
                  <option value="">None</option>
                  <option v-for="s in staggingList" :key="s.code" :value="s.code">
                    {{ s.code }}
                  </option>
                </select>
              </div>

              <div class="flex justify-end gap-2 pt-3">
                <button @click="showEditModal = false" class="px-3 py-1 bg-gray-700 rounded">Cancel</button>
                <button @click="updateUser" class="px-3 py-1 bg-pink-500 rounded">Update</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import api from "@/lib/axios";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
authStore.loadUserFromToken();

const users = ref([]);
const showCreateModal = ref(false);
const creating = ref(false);
const staggingList = ref([]);
const showEditModal = ref(false);
const editingUser = ref(null);

const form = ref({
  username: "",
  password: "",
  role: "admin",
  staggingCode: "",
});

const editForm = ref({
  username: "",
  password: "",
  staggingCode: "",
});

// ✅ hanya owner / developer
const isOwner = computed(() => ["owner", "developer"].includes(authStore.role));

const canCreateUser = computed(() => authStore.role === "owner");

// redirect kalau bukan
if (!isOwner.value) {
  router.replace("/dashboard");
}

async function fetchUsers() {
  try {
    const res = await api.get("/api/users");
    users.value = res.data?.data || [];
  } catch (err) {
    console.error("Gagal ambil users", err);
    users.value = [];
  }
}

async function fetchStagging() {
  try {
    const res = await api.get("/api/stagging");
    staggingList.value = res.data?.data || [];
  } catch (e) {
    staggingList.value = [];
  }
}

async function createUser() {
  if (!form.value.username) return alert("Username wajib");
  if (!form.value.password) return alert("Password wajib");

  creating.value = true;

  try {
    await api.post("/api/user-create", {
      username: form.value.username,
      password: form.value.password,
      role: form.value.role,
      staggingCode: form.value.staggingCode || null,
    });

    showCreateModal.value = false;

    form.value = {
      username: "",
      password: "",
      role: "admin",
      staggingCode: "",
    };

    await fetchUsers();
  } catch (err) {
    alert(err?.response?.data?.message || "Gagal create user");
  } finally {
    creating.value = false;
  }
}

function openEdit(user) {
  editingUser.value = user;

  editForm.value = {
    username: user.username,
    password: "",
    staggingCode: user.staggingCode || "",
  };

  showEditModal.value = true;
}

async function updateUser() {
  if (!editingUser.value) return;

  const payload = {};

  if (editForm.value.username !== editingUser.value.username) {
    payload.username = editForm.value.username;
  }

  if (editForm.value.password) {
    payload.password = editForm.value.password;
  }

  if (editForm.value.staggingCode !== (editingUser.value.staggingCode || "")) {
    payload.stagging_code = editForm.value.staggingCode || null;
  }

  if (!Object.keys(payload).length) {
    return alert("Tidak ada perubahan");
  }

  try {
    await api.put(`/api/user/${editingUser.value.id}`, payload);

    showEditModal.value = false;
    editingUser.value = null;

    await fetchUsers();
  } catch (err) {
    alert(err?.response?.data?.message || "Gagal update user");
  }
}

const deleteUser = async (user) => {
  if (!confirm(`Hapus user ${user.username}?`)) return;

  try {
    await api.delete(`/api/user/${user.id}`);
    await fetchUsers();
  } catch (e) {
    alert("Gagal hapus user");
  }
};

const roleClass = (role) => {
  if (role === "owner") return "bg-pink-600/20 text-pink-400";
  if (role === "developer") return "bg-purple-600/20 text-purple-400";
  if (role === "admin") return "bg-blue-600/20 text-blue-400";
  return "bg-gray-600/20 text-gray-300";
};

const formatDate = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  return d.toLocaleString();
};

onMounted(() => {
  fetchUsers();
  fetchStagging();
});
</script>
