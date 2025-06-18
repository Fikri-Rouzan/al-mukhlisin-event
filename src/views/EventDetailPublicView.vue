<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";

const route = useRoute();
const event = ref(null);
const loading = ref(true);
const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle-2"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>`;

onMounted(async () => {
  try {
    const { data, error } = await supabase.rpc("get_event_details", {
      p_event_id: route.params.id,
    });
    if (error) throw error;
    event.value = data;
  } catch (error) {
    Swal.fire("Error", "Failed to fetch event details.", "error");
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
      Event not found.
    </div>
    <div v-else class="max-w-4xl mx-auto">
      <img
        :src="event.details.photo_url || defaultAvatar"
        class="w-full h-80 object-cover rounded-lg mb-6 bg-gray-100 text-gray-300"
      />

      <div class="bg-white p-8 rounded-lg shadow-md">
        <p class="text-primary font-semibold">{{ event.details.category }}</p>
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
          {{ event.details.name }}
        </h1>
        <p class="text-lg text-gray-600 font-medium mt-4">
          {{ formatDateTime(event.details.event_date) }} WIB
        </p>

        <p class="mt-8 text-gray-700 whitespace-pre-wrap leading-relaxed">
          {{ event.details.description }}
        </p>

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
                :src="speaker.photo_url || defaultAvatar"
                class="w-16 h-16 rounded-full object-cover text-gray-300"
              />
              <div>
                <h3 class="font-bold text-lg text-gray-800">
                  {{ speaker.name }}
                </h3>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500">
            Informasi narasumber tidak tersedia.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
