<script setup>
import { onMounted } from "vue";
import { useCrud } from "../../composables/useCrud";
import { Pencil, Trash2 } from "lucide-vue-next";
import ResidentModal from "../../components/admin/ResidentModal.vue";

const config = {
  fetchRpc: "get_all_residents",
  singularName: "warga",
  supabaseFunction: "manage-resident",
};

const {
  items,
  loading,
  isModalOpen,
  isEditMode,
  isSaving,
  form,
  fetchItems,
  saveItem,
  deleteItem,
  openModal,
  openEditModal,
} = useCrud(config);

onMounted(fetchItems);

const initialFormData = {
  id: null,
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
</script>

<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <h1 class="text-3xl font-bold">Data Warga</h1>
      <button
        @click="openModal(initialFormData)"
        class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto cursor-pointer"
      >
        Tambah Data Warga
      </button>
    </div>

    <div class="w-full overflow-hidden rounded-lg shadow-md">
      <div class="w-full overflow-x-auto">
        <table class="min-w-full whitespace-nowrap">
          <thead class="bg-gray-50">
            <tr
              class="text-left text-sm font-bold text-gray-500 uppercase tracking-wider bg-gray-200"
            >
              <th scope="col" class="px-6 py-3">Nama</th>
              <th scope="col" class="px-6 py-3">Email</th>
              <th scope="col" class="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="3" class="px-6 py-4 text-center">Loading...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="3" class="px-6 py-4 text-center">
                Tidak ada data warga yang ditemukan
              </td>
            </tr>
            <tr
              v-for="resident in items"
              :key="resident.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">{{ resident.name }}</td>
              <td class="px-6 py-4">{{ resident.email }}</td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="openEditModal(resident)"
                  class="text-orange-500 hover:text-orange-900 mr-4 cursor-pointer transition-colors"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  @click="deleteItem(resident)"
                  class="text-red-500 hover:text-red-900 cursor-pointer transition-colors"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ResidentModal
      :isOpen="isModalOpen"
      :isEditMode="isEditMode"
      :residentForm="form.data"
      :isSaving="isSaving"
      @close="isModalOpen = false"
      @save="saveItem"
      @update:residentForm="(payload) => (form.data = payload)"
    />
  </div>
</template>
