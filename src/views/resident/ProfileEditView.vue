<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../composables/useAuth";
import { supabase } from "../../lib/supabase";
import Swal from "sweetalert2";
import { Eye, EyeOff, User, Lock } from "lucide-vue-next";
import { motion } from "motion-v";

const router = useRouter();
const { user, profile, fetchProfile } = useAuth();

const form = ref({
  name: "",
  newPassword: "",
  confirmPassword: "",
});
const isSaving = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

onMounted(() => {
  if (profile.value) {
    form.value.name = profile.value.name;
  }
});

async function handleUpdateProfile() {
  if (
    form.value.newPassword &&
    form.value.newPassword !== form.value.confirmPassword
  ) {
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

  isSaving.value = true;
  try {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ name: form.value.name })
      .eq("id", user.value.id);
    if (profileError) throw profileError;

    if (form.value.newPassword) {
      const { error: authError } = await supabase.auth.updateUser({
        password: form.value.newPassword,
      });
      if (authError) throw authError;
    }

    await fetchProfile();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Sukses!",
      text: "Profil berhasil diperbarui.",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: {
        container: "swal-container",
      },
    });

    router.push({ name: "Profile" });
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
</script>

<template>
  <motion.div
    class="flex items-center justify-center min-h-screen"
    :initial="{ opacity: 0 }"
    :whileInView="{ opacity: 1 }"
    :transition="{ duration: 1 }"
  >
    <div class="w-full max-w-lg">
      <div class="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <motion.h1
          class="text-3xl font-bold text-primary text-center mb-8"
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.3, duration: 0.5 }"
        >
          Edit Profil Saya
        </motion.h1>
        <motion.form
          @submit.prevent="handleUpdateProfile"
          id="profile-edit-form"
          class="space-y-4"
          :initial="{ opacity: 0 }"
          :whileInView="{ opacity: 1 }"
          :transition="{ delay: 0.5, duration: 0.5 }"
        >
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
                v-model="form.name"
                type="text"
                id="name"
                autocomplete="name"
                placeholder="Masukkan nama baru"
                required
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label
              for="new-password"
              class="block text-sm font-medium text-gray-700"
              >Password Baru</label
            >
            <div class="relative mt-1">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <Lock class="w-5 h-5 text-gray-400" />
              </div>
              <input
                v-model="form.newPassword"
                :type="showPassword ? 'text' : 'password'"
                id="new-password"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
                class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
            <label
              for="confirm-password"
              class="block text-sm font-medium text-gray-700"
              >Konfirmasi Password Baru</label
            >
            <div class="relative mt-1">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <Lock class="w-5 h-5 text-gray-400" />
              </div>
              <input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirm-password"
                placeholder="Biarkan kosong jika tidak ingin mengubah"
                class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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

          <div class="flex justify-end items-center gap-4 pt-4">
            <router-link
              :to="{ name: 'Profile' }"
              class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
            >
              Batal
            </router-link>
            <button
              type="submit"
              form="profile-edit-form"
              :disabled="isSaving"
              class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              {{ isSaving ? "Menyimpan..." : "Simpan Perubahan" }}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  </motion.div>
</template>
