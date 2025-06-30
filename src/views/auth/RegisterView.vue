<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { supabase } from "../../lib/supabase";
import Swal from "sweetalert2";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-vue-next";
import { motion } from "motion-v";

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
      customClass: {
        container: "swal-container",
      },
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
      customClass: {
        container: "swal-container",
      },
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
      customClass: {
        container: "swal-container",
      },
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
      customClass: {
        container: "swal-container",
      },
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <motion.div
    class="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4"
    :initial="{ opacity: 0 }"
    :whileInView="{ opacity: 1 }"
    :transition="{ duration: 1 }"
  >
    <div
      class="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden"
    >
      <div
        class="w-full md:w-1/2 bg-primary text-white flex flex-col items-center justify-center p-10 text-center"
      >
        <motion.h1
          class="text-3xl font-bold"
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.3, duration: 0.5 }"
        >
          Daftarkan Akunmu Disini!</motion.h1
        >
        <motion.p
          class="mt-6"
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.5, duration: 0.5 }"
        >
          Silakan daftar untuk proses pembuatan akun</motion.p
        >
      </div>

      <div class="w-full md:w-1/2 p-8 space-y-6">
        <motion.h1
          class="text-2xl font-bold text-center text-primary"
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.6, duration: 0.5 }"
        >
          Daftar Akun</motion.h1
        >
        <motion.form
          @submit.prevent="handleRegister"
          class="space-y-4"
          :initial="{ opacity: 0 }"
          :whileInView="{ opacity: 1 }"
          :transition="{ delay: 0.8, duration: 0.5 }"
        >
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
            class="mt-2 w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
          >
            {{ loading ? "Mendaftar..." : "Daftar" }}
          </button>
        </motion.form>
        <motion.p
          class="text-center"
          :initial="{ y: 20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.9, duration: 0.6 }"
        >
          Sudah memiliki akun?
          <RouterLink
            to="/login"
            class="text-primary hover:text-secondary hover:underline transition-colors"
          >
            Login di sini</RouterLink
          >
        </motion.p>
      </div>
    </div>
  </motion.div>
</template>
