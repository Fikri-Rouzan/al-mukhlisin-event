<script setup>
import { onMounted } from "vue";
import { useCrud } from "../../../composables/useCrud";
import { Pencil, Trash2, Search } from "lucide-vue-next";
import Pagination from "../../../components/admin/Pagination.vue";

const config = {
  fetchRpc: "get_all_residents",
  singularName: "warga",
  supabaseFunction: "manage-resident",
};

const {
  items,
  loading,
  fetchItems,
  deleteItem,
  searchQuery,
  currentPage,
  totalItems,
  rowsPerPage,
  changePage,
} = useCrud(config);

onMounted(fetchItems);
</script>

<template>
  <div class="px-6 py-4">
    <div class="mb-8">
      <h1 class="text-4xl font-bold">Data Warga</h1>
    </div>
    <div
      class="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4"
    >
      <router-link
        :to="{ name: 'AdminResidentsCreate' }"
        class="bg-primary hover:bg-secondary text-center text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto cursor-pointer"
      >
        Tambah Data Warga
      </router-link>
    </div>

    <div class="mb-4 flex justify-end">
      <div class="relative w-full sm:w-96">
        <input
          v-model="searchQuery"
          type="text"
          name="search"
          placeholder="Cari berdasarkan nama atau email"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        />
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <Search class="w-5 h-5 text-gray-400" />
        </div>
      </div>
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
                <router-link
                  :to="{
                    name: 'AdminResidentsEdit',
                    params: { id: resident.id },
                  }"
                  class="text-orange-500 hover:text-orange-900 mr-4 cursor-pointer transition-colors inline-block align-middle"
                >
                  <Pencil class="w-5 h-5" />
                </router-link>

                <button
                  @click="deleteItem(resident)"
                  class="text-red-500 hover:text-red-900 cursor-pointer transition-colors inline-block align-middle"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Pagination
      :currentPage="currentPage"
      :totalItems="totalItems"
      v-model:rowsPerPage="rowsPerPage"
      @page-changed="changePage"
    />
  </div>
</template>
