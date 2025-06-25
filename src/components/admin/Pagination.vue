<script setup>
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalItems: {
    type: Number,
    required: true,
  },
  rowsPerPage: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["page-changed", "update:rowsPerPage"]);

const totalPages = computed(() => {
  if (props.totalItems === 0) return 1;
  return Math.ceil(props.totalItems / props.rowsPerPage);
});

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    emit("page-changed", page);
  }
}

function onRowsPerPageChange(event) {
  emit("update:rowsPerPage", Number(event.target.value));
}
</script>

<template>
  <div
    class="flex flex-col sm:flex-row items-center justify-between mt-6 text-sm gap-4"
  >
    <div class="flex items-center gap-x-4">
      <div class="flex items-center gap-x-2">
        <label for="rowsPerPage" class="text-gray-600">Baris</label>
        <select
          id="rowsPerPage"
          :value="rowsPerPage"
          @change="onRowsPerPageChange"
          class="block w-auto py-1.5 pl-2 pr-8 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
        >
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
      </div>
      <span class="text-gray-600 hidden sm:block">
        Menampilkan
        {{
          totalItems > 0
            ? Math.min((currentPage - 1) * rowsPerPage + 1, totalItems)
            : 0
        }}
        - {{ Math.min(currentPage * rowsPerPage, totalItems) }} dari
        {{ totalItems }} data
      </span>
    </div>

    <div v-if="totalPages > 1" class="flex items-center space-x-1">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Halaman Sebelumnya"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-4 py-2 rounded-md transition-colors cursor-pointer',
          currentPage === page
            ? 'bg-primary text-white font-bold cursor-default'
            : 'bg-white text-gray-700 hover:bg-gray-200',
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Halaman Selanjutnya"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
    <div v-else class="h-9"></div>
  </div>
</template>
