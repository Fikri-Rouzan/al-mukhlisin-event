import { ref, reactive, watch } from "vue";
import { supabase } from "../../lib/supabase";
import { useNotifications } from "./useNotifications";
import { usePagination } from "./usePagination";
import { useSearch } from "./useSearch";
import { usePhotoUpload } from "./usePhotoUpload";

export function useCrud(options) {
  const items = ref([]);
  const form = reactive({ data: {} });
  const loading = ref(true);
  const isModalOpen = ref(false);
  const isEditMode = ref(false);
  const isSaving = ref(false);
  const totalItems = ref(0);
  const allRpcItems = ref([]);

  const { showSuccessToast, showErrorAlert, showConfirmDialog } =
    useNotifications();
  const {
    uploadPhoto,
    deletePhoto,
    handleFileChange,
    resetPhotoState,
    ...photoState
  } = usePhotoUpload(options.storageName);
  const { currentPage, rowsPerPage, offset, changePage, resetPage } =
    usePagination(totalItems);
  const { searchQuery } = useSearch(() => {
    resetPage();
    fetchItems();
  });

  const fetchItems = async () => {
    loading.value = true;
    try {
      if (options.fetchRpc) {
        if (allRpcItems.value.length === 0) {
          const { data, error } = await supabase.rpc(options.fetchRpc);
          if (error) throw error;
          allRpcItems.value = data || [];
        }
        let filteredItems = allRpcItems.value;
        if (searchQuery.value && options.searchColumns?.length) {
          const query = searchQuery.value.toLowerCase();
          filteredItems = allRpcItems.value.filter((item) =>
            options.searchColumns.some(
              (column) =>
                item[column] &&
                String(item[column]).toLowerCase().includes(query)
            )
          );
        }
        totalItems.value = filteredItems.length;
        items.value = filteredItems.slice(
          offset.value,
          offset.value + rowsPerPage.value
        );
      } else if (options.tableName) {
        let query = supabase
          .from(options.tableName)
          .select(options.selectQuery || "*", { count: "exact" })
          .order(options.order || "name", {
            ascending: options.ascending !== false,
          })
          .range(offset.value, offset.value + rowsPerPage.value - 1);

        if (searchQuery.value && options.searchColumn) {
          query = query.ilike(options.searchColumn, `%${searchQuery.value}%`);
        }
        const { data, error, count } = await query;
        if (error) throw error;
        items.value = data;
        totalItems.value = count;
      } else {
        throw new Error(
          "Konfigurasi useCrud harus menyertakan 'tableName' atau 'fetchRpc'."
        );
      }
    } catch (error) {
      showErrorAlert(error.message);
      items.value = [];
      totalItems.value = 0;
    } finally {
      loading.value = false;
    }
  };

  watch([currentPage, rowsPerPage], fetchItems);

  const saveItem = async () => {
    if (
      form.data.password &&
      form.data.password !== form.data.confirmPassword
    ) {
      return showErrorAlert("Password tidak cocok dengan konfirmasi password.");
    }
    isSaving.value = true;
    try {
      let finalPhotoUrl = form.data.photo_url || null;
      if (photoState.newPhotoFile.value) {
        if (isEditMode.value && form.data.photo_url) {
          await deletePhoto(form.data.photo_url);
        }
        finalPhotoUrl = await uploadPhoto();
      }

      const payload = { ...form.data, photo_url: finalPhotoUrl };
      delete payload.confirmPassword;

      const { error } = await supabase.functions.invoke(
        options.supabaseFunction,
        {
          method: isEditMode.value ? "PATCH" : "POST",
          body: payload,
        }
      );

      if (error) throw error;
      showSuccessToast(
        `Data berhasil ${isEditMode.value ? "diperbarui" : "ditambahkan"}`
      );
      closeModal();
      if (options.fetchRpc) allRpcItems.value = [];
      fetchItems();
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      isSaving.value = false;
    }
  };

  const deleteItem = async (item) => {
    const { isConfirmed } = await showConfirmDialog(
      "Anda Yakin?",
      `Data "${item.name}" akan dihapus permanen.`
    );
    if (!isConfirmed) return;
    try {
      const { error } = await supabase.functions.invoke(
        options.supabaseFunction,
        {
          method: "DELETE",
          body: { id: item.id, photo_url: item.photo_url },
        }
      );
      if (error) throw error;
      showSuccessToast(`Data "${item.name}" berhasil dihapus.`);
      if (options.fetchRpc) allRpcItems.value = [];
      fetchItems();
    } catch (error) {
      showErrorAlert(error.message);
    }
  };

  const openModal = (initialData = {}) => {
    isEditMode.value = false;
    form.data = { ...initialData };
    resetPhotoState();
    isModalOpen.value = true;
  };

  const openEditModal = (itemToEdit) => {
    isEditMode.value = true;
    form.data = { ...itemToEdit };
    resetPhotoState();
    if (itemToEdit.photo_url) {
      photoState.photoPreview.value = itemToEdit.photo_url;
    }
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  return {
    items,
    loading,
    isModalOpen,
    isEditMode,
    isSaving,
    form,
    searchQuery,
    currentPage,
    rowsPerPage,
    totalItems,
    changePage,
    fetchItems,
    saveItem,
    deleteItem,
    openModal,
    openEditModal,
    closeModal,
    handleFileChange,
    ...photoState,
  };
}
