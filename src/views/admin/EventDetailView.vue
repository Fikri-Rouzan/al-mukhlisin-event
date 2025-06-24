<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../../lib/supabase";
import Swal from "sweetalert2";
import { ArrowLeft, Image, UserCircle2 } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();
const event = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data, error } = await supabase.rpc("get_event_details", {
      p_event_id: route.params.id,
    });
    if (error) throw error;
    event.value = data;
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <button
      @click="router.back()"
      class="mb-6 inline-flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 cursor-pointer transition-colors"
    >
      <ArrowLeft :size="20" />
      <span>Kembali</span>
    </button>

    <div v-if="loading" class="text-center p-10">Loading...</div>
    <div v-else-if="!event || !event.details" class="text-center p-10">
      Data kegiatan tidak ditemukan
    </div>

    <div v-else class="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div
        class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg mb-8"
      >
        <img
          v-if="event.details.photo_url"
          :src="event.details.photo_url"
          class="w-full h-full object-cover rounded-lg"
          alt="Event Photo"
        />
        <Image v-else class="w-16 h-16 text-gray-400" />
      </div>

      <div class="space-y-6">
        <div class="text-center">
          <p class="text-4xl sm:text-5xl font-bold text-primary">
            {{ event.details.name }}
          </p>
        </div>

        <div class="text-left space-y-1">
          <h3
            class="font-bold text-gray-500 uppercase text-base tracking-wider"
          >
            Kategori
          </h3>
          <p class="text-lg text-gray-800">{{ event.details.category }}</p>
        </div>

        <div class="text-left space-y-1">
          <h3
            class="font-bold text-gray-500 uppercase text-base tracking-wider"
          >
            Tanggal & Waktu
          </h3>
          <p class="text-lg text-gray-800">
            {{
              new Date(event.details.event_date).toLocaleString("id-ID", {
                dateStyle: "full",
                timeStyle: "short",
              })
            }}
          </p>
        </div>

        <div class="text-left space-y-1">
          <h3
            class="font-bold text-gray-500 uppercase text-base tracking-wider"
          >
            Deskripsi
          </h3>
          <p class="text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
            {{ event.details.description }}
          </p>
        </div>
      </div>

      <hr class="my-8" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-2xl font-bold mb-4 text-primary">Narasumber</h2>
          <ul v-if="event.speakers.length > 0" class="space-y-3">
            <li
              v-for="speaker in event.speakers"
              :key="speaker.id"
              class="flex items-center space-x-3"
            >
              <img
                v-if="speaker.photo_url"
                :src="speaker.photo_url"
                class="w-11 h-11 rounded-full object-cover"
                alt="Speaker Photo"
              />
              <UserCircle2 v-else class="w-11 h-11 text-gray-400" />
              <span>{{ speaker.name }}</span>
            </li>
          </ul>
          <p v-else class="text-gray-500">
            Tidak ada narasumber yang terdaftar
          </p>
        </div>

        <div>
          <h2 class="text-2xl font-bold mb-4 text-primary">Panitia</h2>
          <ul v-if="event.committee.length > 0" class="space-y-3">
            <li
              v-for="c in event.committee"
              :key="c.id"
              class="flex items-center space-x-3"
            >
              <img
                v-if="c.photo_url"
                :src="c.photo_url"
                class="w-11 h-11 rounded-full object-cover"
                alt="Committee Photo"
              />
              <UserCircle2 v-else class="w-11 h-11 text-gray-400" />
              <span>{{ c.name }} ({{ c.position }})</span>
            </li>
          </ul>
          <p v-else class="text-gray-500">Tidak ada panitia yang terdaftar</p>
        </div>
      </div>
    </div>
  </div>
</template>
