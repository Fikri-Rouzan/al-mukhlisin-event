<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../../lib/supabase";
import Swal from "sweetalert2";

const route = useRoute();
const router = useRouter();
const speaker = ref(null);
const loading = ref(true);

const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle-2"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>`;

onMounted(async () => {
  try {
    const speakerId = route.params.id;
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .eq("id", speakerId)
      .single();

    if (error) throw error;
    speaker.value = data;
  } catch (error) {
    Swal.fire("Error", "Failed to fetch speaker details.", "error");
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <button
      @click="router.back()"
      class="mb-6 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
    >
      &larr; Back to List
    </button>

    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="!speaker" class="text-center">Speaker not found.</div>
    <div v-else class="bg-white p-8 rounded-lg shadow-md">
      <div
        class="flex flex-col md:flex-row items-center md:items-start md:space-x-8"
      >
        <img
          :src="speaker.photo_url || defaultAvatar"
          alt="Photo"
          class="w-40 h-40 rounded-full object-cover border-4 border-gray-100 mb-6 md:mb-0"
        />
        <div class="w-full">
          <h1 class="text-4xl font-bold text-primary">{{ speaker.name }}</h1>
          <div class="mt-8 space-y-4">
            <div>
              <h3 class="font-semibold text-gray-500 uppercase text-sm">
                Phone Number
              </h3>
              <p class="text-lg text-gray-800">
                {{ speaker.phone_number || "-" }}
              </p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-500 uppercase text-sm">
                Address
              </h3>
              <p class="text-lg text-gray-800 whitespace-pre-wrap">
                {{ speaker.address || "-" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
