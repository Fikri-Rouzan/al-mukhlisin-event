<script setup>
import { ref, computed } from "vue";
import { useAuth } from "../composables/useAuth";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import ProfileEditModal from "../components/resident/ProfileEditModal.vue";
import { Pencil, LogOut } from "lucide-vue-next";

const { user, profile, logout } = useAuth();

const isModalOpen = ref(false);
const isSaving = ref(false);

const userInitials = computed(() => {
  if (profile.value?.name) {
    const names = profile.value.name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }
  return "U";
});

async function handleLogout() {
  const result = await Swal.fire({
    title: "Ingin Logout?",
    text: "Anda akan keluar dari akun ini",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#006a4e",
    confirmButtonText: "Ya, Logout!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    await logout();
  }
}

async function handleUpdateProfile(formData) {
  if (
    formData.newPassword &&
    formData.newPassword !== formData.confirmPassword
  ) {
    return Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Password tidak cocok dengan konfirmasi password",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }

  isSaving.value = true;
  try {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ name: formData.name })
      .eq("id", user.value.id);

    if (profileError) throw profileError;

    if (formData.newPassword) {
      const { error: authError } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });
      if (authError) throw authError;
    }

    profile.value.name = formData.name;

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Sukses!",
      text: "Profil berhasil diperbarui",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    isModalOpen.value = false;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error.message,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="flex items-center min-h-[75vh]">
    <div class="w-full max-w-2xl mx-auto">
      <div class="bg-white shadow-xl rounded-2xl relative overflow-hidden">
        <button
          @click="isModalOpen = true"
          class="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
          aria-label="Edit Profil"
        >
          <Pencil class="w-5 h-5" />
        </button>

        <div v-if="profile" class="p-6 sm:p-8">
          <h1 class="text-3xl font-bold text-primary text-center mb-8">
            Profil Saya
          </h1>

          <div class="flex flex-col items-center space-y-2 mb-8">
            <div
              class="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md"
            >
              {{ userInitials }}
            </div>
            <div>
              <h2 class="text-xl font-semibold text-gray-900 text-center">
                {{ profile.name }}
              </h2>
              <p class="text-sm text-gray-500 text-center">{{ user.email }}</p>
            </div>
          </div>

          <hr class="my-6" />

          <div class="space-y-4 text-center sm:text-left">
            <h3 class="text-lg font-semibold text-primary mb-4 text-center">
              Detail Informasi
            </h3>
            <div>
              <p class="block text-sm font-medium text-gray-500">Nama</p>
              <p class="text-lg text-gray-800">{{ profile.name }}</p>
            </div>
            <div>
              <p class="block text-sm font-medium text-gray-500">Alamat</p>
              <p class="text-lg text-gray-800">{{ user.email }}</p>
            </div>
          </div>
        </div>

        <div v-else class="p-8 text-center">
          <p>Loading profil pengguna...</p>
        </div>
      </div>

      <div class="mt-6">
        <button
          @click="handleLogout"
          class="w-full flex justify-center items-center space-x-2 bg-red-500 text-white py-3 rounded-lg hover:bg-red-800 treansition-colors cursor-pointer"
        >
          <LogOut class="w-5 h-5" />
          <span class="font-semibold">Logout</span>
        </button>
      </div>
    </div>
  </div>

  <ProfileEditModal
    :isOpen="isModalOpen"
    :profileData="profile"
    :isSaving="isSaving"
    @close="isModalOpen = false"
    @save="handleUpdateProfile"
  />
</template>
