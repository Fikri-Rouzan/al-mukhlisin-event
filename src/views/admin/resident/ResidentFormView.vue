<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../../../lib/supabase";
import Swal from "sweetalert2";
import { Eye, EyeOff, User, Mail, Lock, ChevronLeft } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

const isEditMode = ref(false);
const residentForm = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const isSaving = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const residentId = route.params.id;
if (residentId) {
  isEditMode.value = true;
}

async function fetchResidentData() {
  if (!isEditMode.value) return;
  try {
    const { data: user, error } = await supabase
      .rpc("get_user_by_id", { p_user_id: residentId })
      .single();

    if (error) throw error;

    if (user) {
      residentForm.value = { ...user, password: "", confirmPassword: "" };
    } else {
      throw new Error("Data warga tidak ditemukan");
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        container: "swal-container",
      },
    });
    router.push({ name: "AdminResidents" });
  }
}

async function handleSaveResident() {
  if (residentForm.value.password || !isEditMode.value) {
    if (residentForm.value.password !== residentForm.value.confirmPassword) {
      return Swal.fire({
        title: "Error!",
        text: "Password tidak cocok dengan konfirmasi password",
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
          container: "swal-container",
        },
      });
    }
  }

  isSaving.value = true;
  try {
    const payload = {
      method: isEditMode.value ? "PATCH" : "POST",
      body: {
        id: isEditMode.value ? residentId : undefined,
        name: residentForm.value.name,
        email: residentForm.value.email,
        password: residentForm.value.password || undefined,
      },
    };

    const { error } = await supabase.functions.invoke(
      "manage-resident",
      payload
    );
    if (error) throw error;

    Swal.fire({
      toast: true,
      position: "top-end",
      title: "Sukses!",
      text: `Data warga berhasil ${
        isEditMode.value ? "diperbarui" : "ditambahkan"
      }`,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        container: "swal-container",
      },
    });
    router.push({ name: "AdminResidents" });
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        container: "swal-container",
      },
    });
  } finally {
    isSaving.value = false;
  }
}

onMounted(() => {
  fetchResidentData();
});
</script>

<template>
  <div class="px-6 py-4">
    <div class="mb-8">
      <h1 class="text-4xl font-bold">
        {{ isEditMode ? "Edit Data Warga" : "Tambah Data Warga" }}
      </h1>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md">
      <form @submit.prevent="handleSaveResident" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Nama</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <User class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="residentForm.name"
              type="text"
              id="name"
              placeholder="Masukkan nama"
              autocomplete="name"
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Mail class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="residentForm.email"
              type="email"
              id="email"
              placeholder="Masukkan email"
              autocomplete="email"
              :disabled="isEditMode"
              :required="!isEditMode"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 focus:outline-none focus:ring-primary focus:border-primary disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Lock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="residentForm.password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              :placeholder="
                isEditMode
                  ? 'Biarkan kosong jika tidak ingin mengubah'
                  : 'Masukkan password'
              "
              :required="!isEditMode"
              class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 cursor-pointer"
            >
              <EyeOff v-if="showPassword" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700"
            >Konfirmasi Password</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Lock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="residentForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              :placeholder="
                isEditMode
                  ? 'Biarkan kosong jika tidak ingin mengubah'
                  : 'Masukkan konfirmasi password'
              "
              :required="!isEditMode && residentForm.password"
              class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 cursor-pointer"
            >
              <EyeOff v-if="showConfirmPassword" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="flex justify-end md:justify-start items-center gap-4 pt-4">
          <router-link
            :to="{ name: 'AdminResidents' }"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer transition-colors"
          >
            Batal
          </router-link>
          <button
            type="submit"
            :disabled="isSaving"
            class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            {{ isSaving ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
