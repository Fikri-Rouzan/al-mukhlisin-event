import { ref, watch } from "vue";

function debounce(fn, delay = 500) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function useSearch(searchCallback) {
  const searchQuery = ref("");
  watch(
    searchQuery,
    debounce(() => searchCallback())
  );
  return { searchQuery };
}
