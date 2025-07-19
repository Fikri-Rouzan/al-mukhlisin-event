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
  siblingCount: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["page-changed", "update:rowsPerPage"]);

const totalPages = computed(() => {
  if (props.totalItems === 0) return 1;
  return Math.ceil(props.totalItems / props.rowsPerPage);
});

const paginationRange = computed(() => {
  const totalVisibleButtons = props.siblingCount + 5;

  if (totalPages.value <= totalVisibleButtons) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(props.currentPage - props.siblingCount, 1);
  const rightSiblingIndex = Math.min(
    props.currentPage + props.siblingCount,
    totalPages.value
  );

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages.value - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages.value;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    let leftItemCount = 3 + 2 * props.siblingCount;
    let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", lastPageIndex];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    let rightItemCount = 3 + 2 * props.siblingCount;
    let rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages.value - rightItemCount + i + 1
    );
    return [firstPageIndex, "...", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    let middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
  }

  return [];
});

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    emit("page-changed", page);
  }
}

function onRowsPerPageChange(event) {
  emit("update:rowsPerPage", Number(event.target.value));
  changePage(1);
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
          <option value="20">20</option>
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

      <template v-for="(item, index) in paginationRange" :key="index">
        <span v-if="typeof item === 'string'" class="px-4 py-2 text-gray-500">
          ...
        </span>

        <button
          v-else
          @click="changePage(item)"
          :class="[
            'px-4 py-2 rounded-md transition-colors cursor-pointer',
            currentPage === item
              ? 'bg-primary text-white font-bold cursor-default'
              : 'bg-white text-gray-700 hover:bg-gray-200',
          ]"
        >
          {{ item }}
        </button>
      </template>

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
