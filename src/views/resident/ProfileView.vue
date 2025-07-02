<script setup>
import { computed } from "vue";
import { useAuth } from "../../composables/useAuth";
import { Pencil } from "lucide-vue-next";
import { motion } from "motion-v";

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
  <motion.div
    class="flex items-center min-h-[75vh]"
    :initial="{ opacity: 0 }"
    :whileInView="{ opacity: 1 }"
    :transition="{ duration: 1 }"
  >
    <div class="w-full max-w-2xl mx-auto">
      <div class="bg-white shadow-xl rounded-2xl relative overflow-hidden">
        <router-link
          :to="{ name: 'ProfileEdit' }"
          class="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors cursor-pointer"
          aria-label="Edit Profil"
        >
          <motion.div
            :initial="{ y: -20, opacity: 0 }"
            :whileInView="{ y: 0, opacity: 1 }"
            :transition="{ delay: 0.3, duration: 0.5 }"
          >
            <Pencil class="w-5 h-5" />
          </motion.div>
        </router-link>

        <div v-if="profile" class="p-6 sm:p-8">
          <motion.h1
            class="text-3xl font-bold text-primary text-center mb-8"
            :initial="{ y: -20, opacity: 0 }"
            :whileInView="{ y: 0, opacity: 1 }"
            :transition="{ delay: 0.3, duration: 0.5 }"
          >
            Profil Saya
          </motion.h1>

          <div class="flex flex-col items-center space-y-2 mb-8">
            <motion.div
              :initial="{ y: -20, opacity: 0 }"
              :whileInView="{ y: 0, opacity: 1 }"
              :transition="{ delay: 0.5, duration: 0.5 }"
              class="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md"
            >
              {{ userInitials }}
            </motion.div>
            <div>
              <motion.h2
                :initial="{ y: -20, opacity: 0 }"
                :whileInView="{ y: 0, opacity: 1 }"
                :transition="{ delay: 0.6, duration: 0.5 }"
                class="text-xl font-semibold text-gray-900 text-center capitalize"
              >
                {{ profile.name }}
              </motion.h2>
              <motion.p
                class="text-sm text-gray-500 text-center"
                :initial="{ y: -20, opacity: 0 }"
                :whileInView="{ y: 0, opacity: 1 }"
                :transition="{ delay: 0.7, duration: 0.5 }"
                >{{ user.email }}</motion.p
              >
            </div>
          </div>

          <motion.hr
            class="my-6"
            :initial="{ opacity: 0 }"
            :whileInView="{ opacity: 1 }"
            :transition="{ delay: 0.8, duration: 0.5 }"
          />

          <div class="space-y-4 text-center sm:text-left">
            <motion.h3
              class="text-lg font-semibold text-primary mb-4 text-center"
              :initial="{ y: -20, opacity: 0 }"
              :whileInView="{ y: 0, opacity: 1 }"
              :transition="{ delay: 0.8, duration: 0.5 }"
            >
              Detail Informasi
            </motion.h3>
            <motion.div
              :initial="{ y: -20, opacity: 0 }"
              :whileInView="{ y: 0, opacity: 1 }"
              :transition="{ delay: 0.9, duration: 0.6 }"
            >
              <p class="block text-sm font-medium text-gray-500">Nama</p>
              <p class="text-lg text-gray-800 capitalize">{{ profile.name }}</p>
            </motion.div>

            <motion.div
              :initial="{ y: -20, opacity: 0 }"
              :whileInView="{ y: 0, opacity: 1 }"
              :transition="{ delay: 1, duration: 0.6 }"
            >
              <p class="block text-sm font-medium text-gray-500">Email</p>
              <p class="text-lg text-gray-800">{{ user.email }}</p>
            </motion.div>
          </div>
        </div>

        <div v-else class="p-8 text-center">
          <p>Loading profil pengguna...</p>
        </div>
      </div>
    </div>
  </motion.div>
</template>
