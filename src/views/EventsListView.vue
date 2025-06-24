<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { RouterLink } from "vue-router";
import Swal from "sweetalert2";
import { Image, ArrowRight } from "lucide-vue-next";

const events = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
    if (error) throw error;
    events.value = data;
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
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-primary mb-12 text-center">
      Jadwal Kegiatan Masjid Al-Mukhlisin
    </h1>

    <div v-if="loading" class="text-center py-10">Loading...</div>
    <div
      v-else-if="events.length === 0"
      class="text-center text-gray-500 py-10"
    >
      Belum ada kegiatan yang dijadwalkan
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <RouterLink
        v-for="event in events"
        :key="event.id"
        :to="`/events/${event.id}`"
        class="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
      >
        <div
          class="w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="event.photo_url"
            :src="event.photo_url"
            alt="Foto Kegiatan"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Image v-else class="w-12 h-12 text-gray-400" />
        </div>

        <div class="p-6 flex flex-col">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">
            {{ event.name }}
          </h2>

          <div class="mb-4">
            <p class="text-md text-gray-500 font-semibold">Kategori</p>
            <p class="text-md text-gray-800">
              {{ event.category }}
            </p>
          </div>

          <div class="mb-6">
            <p class="text-md text-gray-500 font-semibold">Jadwal</p>
            <p class="text-md text-gray-800">
              {{
                new Date(event.event_date).toLocaleString("id-ID", {
                  dateStyle: "long",
                  timeStyle: "short",
                })
              }}
              WIB
            </p>
          </div>

          <div class="flex-grow"></div>

          <div class="mt-auto">
            <RouterLink
              :to="`/events/${event.id}`"
              class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary transition-colors"
              @click.stop
            >
              <span>Detail</span>
              <ArrowRight class="w-4 h-4" />
            </RouterLink>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
