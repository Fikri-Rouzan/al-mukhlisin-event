<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../lib/supabase";
import { RouterLink } from "vue-router";
import Swal from "sweetalert2";

const events = ref([]);
const loading = ref(true);
const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><line x1="2" x2="22" y1="2" y2="22"/><circle cx="12" cy="13" r="3"/></svg>`;

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
      title: "Failed to Fetch Events",
      text: error.message,
    });
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-primary mb-8 text-center">
      Jadwal Kegiatan
    </h1>

    <div v-if="loading" class="text-center">Loading kegiatan...</div>
    <div v-else-if="events.length === 0" class="text-center text-gray-500">
      Belum ada kegiatan yang dijadwalkan.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <RouterLink
        v-for="event in events"
        :key="event.id"
        :to="`/events/${event.id}`"
        class="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
      >
        <div class="overflow-hidden">
          <img
            :src="event.photo_url || defaultAvatar"
            alt="Event Photo"
            class="w-full h-48 object-cover text-gray-300 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-500">{{ event.category }}</p>
          <h2
            class="text-2xl font-bold text-gray-800 mt-2 mb-3 group-hover:text-primary transition-colors"
          >
            {{ event.name }}
          </h2>
          <p class="text-md text-gray-700 font-semibold">
            {{
              new Date(event.event_date).toLocaleString("id-ID", {
                dateStyle: "long",
                timeStyle: "short",
              })
            }}
            WIB
          </p>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
