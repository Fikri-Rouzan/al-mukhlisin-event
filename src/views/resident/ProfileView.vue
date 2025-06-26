<script setup>
import { computed } from "vue";
import { useAuth } from "../../composables/useAuth";
import { Pencil } from "lucide-vue-next";

const { user, profile } = useAuth();

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
</script>

<template>
  <div class="flex items-center min-h-[75vh]">
    <div class="w-full max-w-2xl mx-auto">
      <div class="bg-white shadow-xl rounded-2xl relative overflow-hidden">
        <router-link
          :to="{ name: 'ProfileEdit' }"
          class="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
          aria-label="Edit Profil"
        >
          <Pencil class="w-5 h-5" />
        </router-link>

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
              <p class="block text-sm font-medium text-gray-500">Email</p>
              <p class="text-lg text-gray-800">{{ user.email }}</p>
            </div>
          </div>
        </div>

        <div v-else class="p-8 text-center">
          <p>Loading profil pengguna...</p>
        </div>
      </div>
    </div>
  </div>
</template>
