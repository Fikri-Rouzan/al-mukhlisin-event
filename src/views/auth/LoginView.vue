<script setup>
import { ref, onMounted } from "vue";
import { RouterLink, useRouter, useRoute } from "vue-router";
import { supabase } from "../../lib/supabase";
import Swal from "sweetalert2";
import { Eye, EyeOff, Mail, Lock } from "lucide-vue-next";
import { motion } from "motion-v";

const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const loading = ref(false);
const showPassword = ref(false);

onMounted(() => {
  if (route.query.redirected_from) {
    Swal.fire({
      icon: "info",
      title: "Akses Dibatasi!",
      text: "Anda harus login terlebih dahulu untuk mengakses halaman tersebut",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        container: "swal-container",
      },
    });
  }
});

const handleLogin = async () => {
  try {
    loading.value = true;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, name")
      .eq("id", data.user.id)
      .single();

    if (profileError) throw profileError;

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: `Selamat Datang Kembali, ${profile.name || "Admin"}!`,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        container: "swal-container",
      },
    });

    if (profile.role === "admin") {
      router.push("/admin/residents");
    } else {
      router.push("/");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Login Gagal!",
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
    :initial="{ opacity: 0 }"
    :whileInView="{ opacity: 1 }"
    :transition="{ duration: 1 }"
    class="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4"
  >
    <div
      class="w-full max-w-4xl flex flex-col md:flex-row bg-white shadow-xl rounded-2xl overflow-hidden"
    >
      <div
        class="w-full md:w-1/2 bg-primary text-white flex flex-col items-center justify-center p-10 text-center"
      >
        <motion.h1
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.3, duration: 0.5 }"
          class="text-3xl font-bold"
          >Selamat Datang di Al Mukhlisin!</motion.h1
        >
        <motion.p
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.5, duration: 0.5 }"
          class="mt-6"
          >Silakan login menggunakan akun yang telah dibuat</motion.p
        >
      </div>

      <div class="w-full md:w-1/2 p-8 space-y-6">
        <motion.h1
          class="text-2xl font-bold text-center text-primary"
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.6, duration: 0.5 }"
        >
          Login Akun</motion.h1
        >
        <motion.form
          @submit.prevent="handleLogin"
          class="space-y-4"
          :initial="{ opacity: 0 }"
          :whileInView="{ opacity: 1 }"
          :transition="{ delay: 0.8, duration: 0.5 }"
        >
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
                placeholder="Masukkan email"
                autocomplete="email"
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
          <button
            type="submit"
            :disabled="loading"
            class="mt-2 w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
          >
            {{ loading ? "Sedang Login..." : "Login" }}
          </button>
        </motion.form>
        <motion.p
          class="text-center"
          :initial="{ y: 20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.9, duration: 0.6 }"
        >
          Belum memiliki akun?
          <RouterLink
            to="/register"
            class="text-primary hover:text-secondary hover:underline transition-colors"
            >Daftar di sini</RouterLink
          >
        </motion.p>
      </div>
    </div>
  </motion.div>
</template>
