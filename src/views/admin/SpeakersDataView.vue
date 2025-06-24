<script setup>
import { onMounted } from "vue";
import { useCrud } from "../../composables/useCrud";
import { Pencil, Trash2, Eye, UserCircle2 } from "lucide-vue-next";
import SpeakersModal from "../../components/admin/SpeakersModal.vue";

const config = {
  tableName: "speakers",
  singularName: "narasumber",
  supabaseFunction: "manage-speaker",
  storageName: "speaker-photos",
};

const {
  items,
  loading,
  isModalOpen,
  isEditMode,
  isSaving,
  form,
  photoPreview,
  fetchItems,
  saveItem,
  deleteItem,
  openModal,
  openEditModal,
  handleFileChange,
} = useCrud(config);

onMounted(fetchItems);

const initialFormData = {
  id: null,
  name: "",
  photo_url: "",
  phone_number: "",
  address: "",
};
</script>

<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <h1 class="text-3xl font-bold">Data Narasumber</h1>
      <button
        @click="openModal(initialFormData)"
        class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto cursor-pointer"
      >
        Tambah Data Narasumber
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
              <th class="px-6 py-3">Nomor Telepon</th>
              <th class="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="4" class="px-6 py-4 text-center">Loading...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="4" class="px-6 py-4 text-center">
                Tidak ada data narasumber yang ditemukan
              </td>
            </tr>
            <tr
              v-for="speaker in items"
              :key="speaker.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <img
                  v-if="speaker.photo_url"
                  :src="speaker.photo_url"
                  alt="Photo"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <UserCircle2 v-else class="w-10 h-10 text-gray-400" />
              </td>
              <td class="px-6 py-4">{{ speaker.name }}</td>
              <td class="px-6 py-4">{{ speaker.phone_number }}</td>
              <td class="px-6 py-4 text-right">
                <router-link
                  :to="`/admin/speakers/${speaker.id}`"
                  class="text-indigo-600 hover:text-indigo-900 mr-4 inline-block align-middle transition-colors"
                >
                  <Eye class="w-5 h-5" />
                </router-link>
                <button
                  @click="openEditModal(speaker)"
                  class="text-orange-500 hover:text-orange-900 mr-4 inline-block align-middle cursor-pointer transition-colors"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  @click="deleteItem(speaker)"
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

    <SpeakersModal
      :isOpen="isModalOpen"
      :isEditMode="isEditMode"
      :speakerForm="form.data"
      :isSaving="isSaving"
      :photoPreview="photoPreview"
      @close="isModalOpen = false"
      @save="saveItem"
      @fileChange="handleFileChange"
      @update:speakerForm="(payload) => (form.data = payload)"
    />
  </div>
</template>
