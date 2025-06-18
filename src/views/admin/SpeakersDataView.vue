<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";
import { Pencil, Trash2, Eye } from "lucide-vue-next";
import Swal from "sweetalert2";
import SpeakersModal from "../../components/admin/SpeakersModal.vue";

const speakers = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);
const speakerForm = ref({
  id: null,
  name: "",
  photo_url: "",
  phone_number: "",
  address: "",
});
const newPhotoFile = ref(null);
const photoPreview = ref(null);

const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle-2"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>`;

async function fetchSpeakers() {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from("speakers")
      .select("*")
      .order("name");
    if (error) throw error;
    speakers.value = data;
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

function openCreateModal() {
  isEditMode.value = false;
  speakerForm.value = {
    id: null,
    name: "",
    photo_url: "",
    phone_number: "",
    address: "",
  };
  newPhotoFile.value = null;
  photoPreview.value = null;
  isModalOpen.value = true;
}

function openEditModal(speaker) {
  isEditMode.value = true;
  speakerForm.value = { ...speaker };
  newPhotoFile.value = null;
  photoPreview.value = speaker.photo_url;
  isModalOpen.value = true;
}

async function handleSave() {
  isSaving.value = true;
  let finalPhotoUrl = speakerForm.value.photo_url;

  try {
    if (newPhotoFile.value) {
      if (isEditMode.value && speakerForm.value.photo_url) {
        const oldFilePath = new URL(speakerForm.value.photo_url).pathname
          .split("speaker-photos/")
          .pop();
        await supabase.storage.from("speaker-photos").remove([oldFilePath]);
      }

      const fileName = `${Date.now()}-${newPhotoFile.value.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("speaker-photos")
        .upload(fileName, newPhotoFile.value);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("speaker-photos")
        .getPublicUrl(uploadData.path);
      finalPhotoUrl = urlData.publicUrl;
    }

    const payload = { ...speakerForm.value, photo_url: finalPhotoUrl };
    const response = await supabase.functions.invoke("manage-speaker", {
      method: isEditMode.value ? "PATCH" : "POST",
      body: payload,
    });

    if (response.error) throw response.error;

    Swal.fire(
      "Success",
      `Speaker ${isEditMode.value ? "updated" : "created"}!`,
      "success"
    );
    isModalOpen.value = false;
    fetchSpeakers();
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  } finally {
    isSaving.value = false;
  }
}

async function handleDelete(speaker) {
  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: `Delete ${speaker.name}?`,
    icon: "warning",
    showCancelButton: true,
  });
  if (isConfirmed) {
    try {
      const { error } = await supabase.functions.invoke("manage-speaker", {
        method: "DELETE",
        body: { id: speaker.id, photo_url: speaker.photo_url },
      });
      if (error) throw error;
      Swal.fire("Deleted!", "Data has been deleted.", "success");
      fetchSpeakers();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  }
}

onMounted(fetchSpeakers);
</script>

<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <h1 class="text-3xl font-bold">Data Narasumber</h1>
      <button
        @click="openCreateModal"
        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto"
      >
        Create New Speaker
      </button>
    </div>

    <div class="w-full overflow-hidden rounded-lg shadow-md">
      <div class="w-full overflow-x-auto">
        <table class="min-w-full whitespace-nowrap">
          <thead class="bg-gray-50">
            <tr
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <th class="px-6 py-3">Photo</th>
              <th class="px-6 py-3">Name</th>
              <th class="px-6 py-3">Phone Number</th>
              <th class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="4" class="px-6 py-4 text-center">Loading...</td>
            </tr>
            <tr v-else-if="speakers.length === 0">
              <td colspan="4" class="px-6 py-4 text-center">No data found.</td>
            </tr>
            <tr
              v-for="speaker in speakers"
              :key="speaker.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">
                <img
                  :src="speaker.photo_url || defaultAvatar"
                  alt="Photo"
                  class="w-10 h-10 rounded-full object-cover text-gray-300"
                />
              </td>
              <td class="px-6 py-4">{{ speaker.name }}</td>
              <td class="px-6 py-4">{{ speaker.phone_number }}</td>
              <td class="px-6 py-4 text-right">
                <router-link
                  :to="`/admin/speakers/${speaker.id}`"
                  class="text-green-600 hover:text-green-900 mr-4 inline-block align-middle"
                >
                  <Eye class="w-5 h-5" />
                </router-link>
                <button
                  @click="openEditModal(speaker)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4 inline-block align-middle"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  @click="handleDelete(speaker)"
                  class="text-red-600 hover:text-red-900 inline-block align-middle"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <SpeakersModal
      :isOpen="isModalOpen"
      :isEditMode="isEditMode"
      :speakerForm="speakerForm"
      :isSaving="isSaving"
      :photoPreview="photoPreview"
      :defaultAvatar="defaultAvatar"
      @close="isModalOpen = false"
      @save="handleSave"
      @fileChange="onFileChange"
      @update:speakerForm="speakerForm = $event"
    />
  </div>
</template>
