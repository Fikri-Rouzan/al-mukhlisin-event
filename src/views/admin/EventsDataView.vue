<script setup>
import { onMounted } from "vue";
import { useEvents } from "../../composables/useEvents";
import { Pencil, Trash2, Eye, Image } from "lucide-vue-next";
import EventModal from "../../components/admin/EventModal.vue";

const {
  events,
  allCommittee,
  allSpeakers,
  loading,
  isModalOpen,
  isEditMode,
  isSaving,
  form,
  photoPreview,
  fetchAllData,
  saveItem,
  deleteItem,
  openModal,
  openEditModal,
  closeModal,
  handleFileChange,
} = useEvents();

onMounted(fetchAllData);

const initialFormData = {
  name: "",
  category: "",
  event_date: "",
  description: "",
  photo_url: "",
  committee: [],
  speakers: [],
};
</script>

<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <h1 class="text-3xl font-bold">Data Kegiatan</h1>
      <button
        @click="openModal(initialFormData)"
        class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto cursor-pointer"
      >
        Tambah Data Kegiatan
      </button>
    </div>

    <div class="w-full overflow-hidden rounded-lg shadow-md">
      <div class="w-full overflow-x-auto">
        <table class="min-w-full whitespace-nowrap">
          <thead class="bg-gray-50">
            <tr
              class="text-left text-sm font-bold text-gray-500 uppercase tracking-wider bg-gray-200"
            >
              <th class="px-6 py-3">Foto</th>
              <th class="px-6 py-3">Nama</th>
              <th class="px-6 py-3">Kategori</th>
              <th class="px-6 py-3">Tanggal & Waktu</th>
              <th class="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-4 text-center">Loading...</td>
            </tr>
            <tr v-else-if="events.length === 0">
              <td colspan="5" class="px-6 py-4 text-center">
                Tidak ada data kegiatan yang ditemukan
              </td>
            </tr>
            <tr
              v-for="event in events"
              :key="event.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div
                  class="w-16 h-10 flex items-center justify-center bg-gray-100 rounded"
                >
                  <img
                    v-if="event.photo_url"
                    :src="event.photo_url"
                    alt="Event Photo"
                    class="w-full h-full object-cover rounded"
                  />
                  <Image v-else class="w-6 h-6 text-gray-400" />
                </div>
              </td>
              <td class="px-6 py-4 font-medium">{{ event.name }}</td>
              <td class="px-6 py-4">{{ event.category }}</td>
              <td class="px-6 py-4">
                {{
                  new Date(event.event_date).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                }}
              </td>
              <td class="px-6 py-4 text-right">
                <router-link
                  :to="`/admin/events/${event.id}`"
                  class="text-indigo-600 hover:text-indigo-900 mr-4 inline-block align-middle transition-colors"
                  ><Eye class="w-5 h-5"
                /></router-link>
                <button
                  @click="openEditModal(event)"
                  class="text-orange-500 hover:text-orange-900 mr-4 inline-block align-middle cursor-pointer transition-colors"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  @click="deleteItem(event)"
                  class="text-red-500 hover:text-red-900 inline-block align-middle cursor-pointer transition-colors"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <EventModal
      :isOpen="isModalOpen"
      :isEditMode="isEditMode"
      :eventForm="form.data"
      :isSaving="isSaving"
      :photoPreview="photoPreview"
      :allCommittee="allCommittee"
      :allSpeakers="allSpeakers"
      @close="closeModal"
      @save="saveItem"
      @fileChange="handleFileChange"
      @update:eventForm="(payload) => (form.data = payload)"
    />
  </div>
</template>
