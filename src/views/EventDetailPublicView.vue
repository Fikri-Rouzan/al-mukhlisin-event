<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";
import { Image, UserCircle2, ArrowLeft } from "lucide-vue-next";

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
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center p-10">Loading...</div>
    <div v-else-if="!event || !event.details" class="text-center p-10">
      Kegiatan tidak ditemukan
    </div>
    <div v-else class="max-w-4xl mx-auto">
      <div class="mb-6">
        <button
          @click="goBack"
          class="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
        >
          <ArrowLeft class="w-5 h-5" />
          <span>Kembali</span>
        </button>
      </div>

      <div
        class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg mb-6"
      >
        <img
          v-if="event.details.photo_url"
          :src="event.details.photo_url"
          alt="Foto Kegiatan"
          class="w-full h-full object-cover rounded-lg"
        />
        <Image v-else class="w-16 h-16 text-gray-400" />
      </div>

      <div class="bg-white p-8 rounded-lg shadow-md">
        <h1 class="text-4xl text-center md:text-5xl font-bold text-gray-800">
          {{ event.details.name }}
        </h1>

        <div class="mt-8">
          <p class="text-lg font-semibold text-gray-500 mb-1">Kategori</p>
          <p class="text-md text-gray-800">
            {{ event.details.category }}
          </p>
        </div>

        <div class="mt-6">
          <p class="text-lg font-semibold text-gray-500 mb-1">Jadwal</p>
          <p class="text-md text-gray-800">
            {{ formatDateTime(event.details.event_date) }} WIB
          </p>
        </div>

        <div class="mt-6">
          <p class="text-lg font-semibold text-gray-500 mb-1">Deskripsi</p>
          <p class="text-md text-gray-800 whitespace-pre-wrap leading-relaxed">
            {{ event.details.description }}
          </p>
        </div>

        <hr class="my-8" />

        <div>
          <h2 class="text-2xl font-bold mb-4">Narasumber</h2>
          <div
            v-if="event.speakers.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 gap-6"
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
                <h3 class="font-semibold text-lg text-gray-800">
                  {{ speaker.name }}
                </h3>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">
            Informasi narasumber tidak tersedia
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
