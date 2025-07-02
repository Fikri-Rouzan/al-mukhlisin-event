<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import { Image, UserCircle2, ArrowLeft } from "lucide-vue-next";
import { motion } from "motion-v";

const route = useRoute();
const router = useRouter();
const event = ref(null);
const loading = ref(true);

function goBack() {
  router.go(-1);
}

onMounted(async () => {
  try {
    const { data, error } = await supabase.rpc("get_event_details", {
      p_event_id: route.params.id,
    });
    if (error) throw error;
    event.value = data;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
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
});

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });
}
</script>

<template>
  <motion.div
    class="container mx-auto px-4 py-8"
    :initial="{ opacity: 0 }"
    :whileInView="{ opacity: 1 }"
    :transition="{ duration: 1 }"
  >
    <div v-if="loading" class="text-center p-10">Loading...</div>
    <motion.div
      v-else-if="!event || !event.details"
      class="text-center p-10"
      :initial="{ y: -20, opacity: 0 }"
      :whileInView="{ y: 0, opacity: 1 }"
      :transition="{ delay: 0.3, duration: 0.5 }"
    >
      Kegiatan tidak ditemukan
    </motion.div>
    <div v-else class="max-w-4xl mx-auto">
      <motion.div
        class="mb-6"
        :initial="{ x: -50, opacity: 0 }"
        :whileInView="{ x: 0, opacity: 1 }"
        :transition="{ delay: 0.3, duration: 0.5 }"
      >
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
        >
          <ArrowLeft class="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0 }"
        :whileInView="{ opacity: 1 }"
        :transition="{ delay: 0.5, duration: 0.5 }"
        class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg mb-6"
      >
        <img
          v-if="event.details.photo_url"
          :src="event.details.photo_url"
          alt="Foto Kegiatan"
          class="w-full h-full object-cover rounded-lg"
        />
        <Image v-else class="w-16 h-16 text-gray-400" />
      </motion.div>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <motion.h1
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.6, duration: 0.5 }"
          class="text-4xl text-center md:text-5xl font-bold text-gray-800 capitalize"
        >
          {{ event.details.name }}
        </motion.h1>

        <motion.div
          class="mt-8"
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 0.8, duration: 0.5 }"
        >
          <p class="text-lg font-semibold text-gray-500 mb-1">Kategori</p>
          <p class="text-md text-gray-800 capitalize">
            {{ event.details.category }}
          </p>
        </motion.div>

        <motion.div
          class="mt-6"
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 1.0, duration: 0.5 }"
        >
          <p class="text-lg font-semibold text-gray-500 mb-1">Jadwal</p>
          <p class="text-md text-gray-800">
            {{ formatDateTime(event.details.event_date) }} WIB
          </p>
        </motion.div>

        <motion.div
          class="mt-6"
          :initial="{ y: -20, opacity: 0 }"
          :whileInView="{ y: 0, opacity: 1 }"
          :transition="{ delay: 1.2, duration: 0.5 }"
        >
          <p class="text-lg font-semibold text-gray-500 mb-1">Deskripsi</p>
          <p class="text-md text-gray-800 whitespace-pre-wrap leading-relaxed">
            {{ event.details.description }}
          </p>
        </motion.div>

        <motion.hr
          class="my-8"
          :initial="{ opacity: 0 }"
          :whileInView="{ opacity: 1 }"
          :transition="{ delay: 1.2, duration: 0.6 }"
        />

        <div>
          <motion.h2
            class="text-2xl font-bold mb-4"
            :initial="{ y: -20, opacity: 0 }"
            :whileInView="{ y: 0, opacity: 1 }"
            :transition="{ delay: 1.2, duration: 0.6 }"
            >Narasumber</motion.h2
          >
          <motion.div
            v-if="event.speakers.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 gap-6"
            :initial="{ x: -50, opacity: 0 }"
            :whileInView="{ x: 0, opacity: 1 }"
            :transition="{ delay: 1.3, duration: 0.6 }"
          >
            <div
              v-for="speaker in event.speakers"
              :key="speaker.id"
              class="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg"
            >
              <img
                v-if="speaker.photo_url"
                :src="speaker.photo_url"
                alt="Foto Narasumber"
                class="w-16 h-16 rounded-full object-cover"
              />
              <UserCircle2 v-else class="w-16 h-16 text-gray-400" />
              <div>
                <h3 class="font-semibold text-lg text-gray-800 capitalize">
                  {{ speaker.name }}
                </h3>
              </div>
            </div>
          </motion.div>
          <motion.p
            v-else
            class="text-gray-500"
            :initial="{ y: -20, opacity: 0 }"
            :whileInView="{ y: 0, opacity: 1 }"
            :transition="{ delay: 1.3, duration: 0.6 }"
          >
            Informasi narasumber tidak tersedia
          </motion.p>
        </div>
      </div>
    </div>
  </motion.div>
</template>
