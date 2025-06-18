<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";
import { Pencil, Trash2, Eye } from "lucide-vue-next";
import Swal from "sweetalert2";
import EventModal from "../../components/admin/EventModal.vue";

const events = ref([]);
const allCommittee = ref([]);
const allSpeakers = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);
const eventForm = ref({});
const newPhotoFile = ref(null);
const photoPreview = ref(null);

const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle-2"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>`;

async function fetchAllData() {
  try {
    loading.value = true;
    const [eventsRes, committeeRes, speakersRes] = await Promise.all([
      supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false }),
      supabase.from("committee_members").select("id, name"),
      supabase.from("speakers").select("id, name"),
    ]);
    if (eventsRes.error) throw eventsRes.error;
    if (committeeRes.error) throw committeeRes.error;
    if (speakersRes.error) throw speakersRes.error;

    events.value = eventsRes.data;
    allCommittee.value = committeeRes.data;
    allSpeakers.value = speakersRes.data;
  } catch (error) {
    Swal.fire("Error", `Failed to fetch data: ${error.message}`, "error");
  } finally {
    loading.value = false;
  }
}

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    newPhotoFile.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
}

async function openCreateModal() {
  isEditMode.value = false;
  eventForm.value = {
    name: "",
    category: "",
    event_date: "",
    description: "",
    photo_url: "",
    committee: [],
    speakers: [],
  };
  newPhotoFile.value = null;
  photoPreview.value = null;
  isModalOpen.value = true;
}

async function openEditModal(event) {
  isEditMode.value = true;
  const { data, error } = await supabase.rpc("get_event_details", {
    p_event_id: event.id,
  });
  if (error) {
    return Swal.fire(
      "Error",
      "Could not fetch event details for editing.",
      "error"
    );
  }

  eventForm.value = {
    ...data.details,
    committee: data.committee,
    speakers: data.speakers,
  };
  newPhotoFile.value = null;
  photoPreview.value = event.photo_url;
  isModalOpen.value = true;
}

async function handleSave() {
  isSaving.value = true;
  let finalPhotoUrl = eventForm.value.photo_url;
  try {
    if (newPhotoFile.value) {
      if (isEditMode.value && eventForm.value.photo_url) {
        const oldFilePath = new URL(eventForm.value.photo_url).pathname
          .split("event-photos/")
          .pop();
        await supabase.storage.from("event-photos").remove([oldFilePath]);
      }

      const fileName = `${Date.now()}-${newPhotoFile.value.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("event-photos")
        .upload(fileName, newPhotoFile.value);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("event-photos")
        .getPublicUrl(uploadData.path);
      finalPhotoUrl = urlData.publicUrl;
    }

    const payload = {
      ...eventForm.value,
      photo_url: finalPhotoUrl,
      committee_ids: eventForm.value.committee.map((c) => c.id),
      speaker_ids: eventForm.value.speakers.map((s) => s.id),
    };
    delete payload.committee;
    delete payload.speakers;
    delete payload.created_at;

    const { error } = await supabase.functions.invoke("manage-event", {
      method: isEditMode.value ? "PATCH" : "POST",
      body: payload,
    });

    if (error) throw error;
    Swal.fire(
      "Success",
      `Event ${isEditMode.value ? "updated" : "created"}!`,
      "success"
    );
    isModalOpen.value = false;
    fetchAllData();
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  } finally {
    isSaving.value = false;
  }
}

async function handleDelete(event) {
  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: `Delete ${event.name}?`,
    icon: "warning",
    showCancelButton: true,
  });
  if (isConfirmed) {
    try {
      const { error } = await supabase.functions.invoke("manage-event", {
        method: "DELETE",
        body: { id: event.id, photo_url: event.photo_url },
      });
      if (error) throw error;
      Swal.fire("Deleted!", "Event has been deleted.", "success");
      fetchAllData();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  }
}

onMounted(fetchAllData);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Data Kegiatan</h1>
      <button
        @click="openCreateModal"
        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
      >
        + Create New Event
      </button>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Photo
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Category
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Date
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="5" class="text-center p-4">Loading...</td>
          </tr>
          <tr v-else-if="events.length === 0">
            <td colspan="5" class="text-center p-4">No events found.</td>
          </tr>
          <tr v-for="event in events" :key="event.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <img
                :src="event.photo_url || defaultAvatar"
                class="w-16 h-10 object-cover rounded text-gray-300"
              />
            </td>
            <td class="px-6 py-4 font-medium">{{ event.name }}</td>
            <td class="px-6 py-4">{{ event.category }}</td>
            <td class="px-6 py-4">
              {{ new Date(event.event_date).toLocaleString("id-ID") }}
            </td>
            <td class="px-6 py-4 text-right">
              <router-link
                :to="`/admin/events/${event.id}`"
                class="text-green-600 hover:text-green-900 mr-4 inline-block align-middle"
                ><Eye class="w-5 h-5"
              /></router-link>
              <button
                @click="openEditModal(event)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                <Pencil class="w-5 h-5" />
              </button>
              <button
                @click="handleDelete(event)"
                class="text-red-600 hover:text-red-900"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EventModal
      :isOpen="isModalOpen"
      :isEditMode="isEditMode"
      :eventForm="eventForm"
      :isSaving="isSaving"
      :photoPreview="photoPreview"
      :defaultAvatar="defaultAvatar"
      :allCommittee="allCommittee"
      :allSpeakers="allSpeakers"
      @close="isModalOpen = false"
      @save="handleSave"
      @fileChange="onFileChange"
      @update:eventForm="eventForm = $event"
    />
  </div>
</template>
