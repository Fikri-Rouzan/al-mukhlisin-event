import { ref, computed } from "vue";

export function usePagination(totalItems) {
  const currentPage = ref(1);
  const rowsPerPage = ref(10);

  const offset = computed(() => (currentPage.value - 1) * rowsPerPage.value);
  const totalPages = computed(
    () => Math.ceil(totalItems.value / rowsPerPage.value) || 1
  );

  function changePage(page) {
    if (page > 0 && page <= totalPages.value) {
      currentPage.value = page;
    }
  }

  function resetPage() {
    currentPage.value = 1;
  }

  return {
    currentPage,
    rowsPerPage,
    offset,
    totalPages,
    changePage,
    resetPage,
  };
}
