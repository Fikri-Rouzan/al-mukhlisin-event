<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { supabase } from "../../lib/supabase";
import Swal from "sweetalert2";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-vue-next";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Semua field harus diisi",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    return;
  }
  if (password.value !== confirmPassword.value) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Password tidak cocok dengan konfirmasi password",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    return;
  }

  try {
    loading.value = true;
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          name: name.value,
          role: "resident",
        },
      },
    });

    if (error) throw error;

    await supabase.auth.signOut();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Registrasi Berhasil!",
      text: "Silakan login untuk melanjutkan",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    router.push("/login");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Registrasi Gagal!",
      text: error.message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
    <div
      class="w-full max-w-md p-8 space-y-6 border rounded-lg shadow-lg bg-white"
    >
      <h1 class="text-3xl font-bold text-center text-primary">
        Membuat Akun Baru
      </h1>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="name" class="block text-gray-700 mb-2">Nama</label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <User class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="name"
              type="text"
              id="name"
              autocomplete="name"
              placeholder="Masukkan nama"
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>
        <div>
          <label for="email" class="block text-gray-700 mb-2">Email</label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Mail class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="email"
              type="email"
              id="email"
              autocomplete="email"
              placeholder="Masukkan email"
              class="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>
        <div>
          <label for="password" class="block text-gray-700 mb-2"
            >Password</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Lock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              placeholder="Masukkan password"
              class="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 cursor-pointer"
            >
              <Eye v-if="!showPassword" class="h-5 w-5" />
              <EyeOff v-else class="h-5 w-5" />
            </button>
          </div>
        </div>
        <div>
          <label for="confirm-password" class="block text-gray-700 mb-2"
            >Konfirmasi Password</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Lock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirm-password"
              placeholder="Masukkan konfirmasi password"
              class="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 cursor-pointer"
            >
              <Eye v-if="!showConfirmPassword" class="h-5 w-5" />
              <EyeOff v-else class="h-5 w-5" />
            </button>
          </div>
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
        >
          {{ loading ? "Mendaftar..." : "Daftar" }}
        </button>
      </form>
      <p class="text-center">
        Sudah memiliki akun?
        <RouterLink
          to="/login"
          class="text-primary hover:text-secondary transition-colors"
          >Login di sini</RouterLink
        >
      </p>
    </div>
  </div>
</template>
