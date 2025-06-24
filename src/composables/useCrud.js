import { ref, reactive, watch } from "vue";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";

function debounce(fn, delay = 500) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function useCrud(options) {
  const items = ref([]);
  const allRpcItems = ref([]);
  const form = reactive({ data: {} });
  const loading = ref(true);
  const isModalOpen = ref(false);
  const isEditMode = ref(false);
  const isSaving = ref(false);
  const newPhotoFile = ref(null);
  const photoPreview = ref(null);

  const searchQuery = ref("");
  const currentPage = ref(1);
  const rowsPerPage = ref(10);
  const totalItems = ref(0);

  async function fetchItems() {
    try {
      loading.value = true;

      if (options.fetchRpc) {
        if (allRpcItems.value.length === 0) {
          const { data, error } = await supabase.rpc(options.fetchRpc);
          if (error) throw error;
          allRpcItems.value = data || [];
        }

        let filteredItems = allRpcItems.value;
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase();
          filteredItems = allRpcItems.value.filter(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              (item.email && item.email.toLowerCase().includes(query))
          );
        }

        totalItems.value = filteredItems.length;
        const from = (currentPage.value - 1) * rowsPerPage.value;
        const to = from + rowsPerPage.value;
        items.value = filteredItems.slice(from, to);
      } else {
        const from = (currentPage.value - 1) * rowsPerPage.value;
        const to = from + rowsPerPage.value - 1;

        let query = supabase
          .from(options.tableName)
          .select("*", { count: "exact" })
          .order("name");

        if (searchQuery.value) {
          query = query.ilike("name", `%${searchQuery.value}%`);
        }

        const { data, error, count } = await query.range(from, to);

        if (error) throw error;
        items.value = data;
        totalItems.value = count;
      }
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      loading.value = false;
    }
  }

  watch(
    searchQuery,
    debounce(() => {
      currentPage.value = 1;
      fetchItems();
    })
  );

  watch(rowsPerPage, () => {
    currentPage.value = 1;
    fetchItems();
  });

  function changePage(page) {
    if (page > 0 && page <= Math.ceil(totalItems.value / rowsPerPage.value)) {
      currentPage.value = page;
      fetchItems();
    }
  }

  async function saveItem() {
    isSaving.value = true;
    let finalPhotoUrl = form.data.photo_url || null;
    try {
      if (
        form.data.password &&
        form.data.password !== form.data.confirmPassword
      ) {
        showErrorAlert("Password tidak cocok dengan konfirmasi password");
        return;
      }
      if (newPhotoFile.value && options.storageName) {
        if (isEditMode.value && form.data.photo_url) {
          const oldFilePath = new URL(form.data.photo_url).pathname
            .split(`${options.storageName}/`)
            .pop();
          await supabase.storage
            .from(options.storageName)
            .remove([oldFilePath]);
        }

        const fileName = `${Date.now()}-${newPhotoFile.value.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(options.storageName)
          .upload(fileName, newPhotoFile.value);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from(options.storageName)
          .getPublicUrl(uploadData.path);
        finalPhotoUrl = urlData.publicUrl;
      }

      const payload = { ...form.data, photo_url: finalPhotoUrl };
      delete payload.confirmPassword;

      const { error } = await supabase.functions.invoke(
        options.supabaseFunction,
        { method: isEditMode.value ? "PATCH" : "POST", body: payload }
      );

      if (error) throw error;

      showSuccessAlert(
        `Data ${options.singularName} berhasil ${
          isEditMode.value ? "diperbarui" : "ditambahkan"
        }`
      );
      closeModal();
      if (options.fetchRpc) {
        allRpcItems.value = [];
      }
      fetchItems();
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      isSaving.value = false;
    }
  }

  /**
   * @param {object} item
   */
  async function deleteItem(item) {
    const { isConfirmed } = await showConfirmAlert(item.name);

    if (isConfirmed) {
      try {
        const { error } = await supabase.functions.invoke(
          options.supabaseFunction,
          { method: "DELETE", body: { id: item.id, photo_url: item.photo_url } }
        );
        if (error) throw error;
        showSuccessAlert(
          `Data ${options.singularName} ${item.name} berhasil dihapus.`
        );
        if (options.fetchRpc) {
          allRpcItems.value = [];
        }
        fetchItems();
      } catch (error) {
        showErrorAlert(error.message);
      }
    }
  }

  /**
   * @param {object} initialData
   */
  function openModal(initialData = {}) {
    isEditMode.value = false;
    form.data = { ...initialData };
    resetPhotoState();
    isModalOpen.value = true;
  }

  /**
   * @param {object} itemToEdit
   */
  function openEditModal(itemToEdit) {
    isEditMode.value = true;
    form.data = { ...itemToEdit };
    resetPhotoState();
    if (itemToEdit.photo_url) {
      photoPreview.value = itemToEdit.photo_url;
    }
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
  }

  /**
   * @param {Event} event
   */
  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      newPhotoFile.value = file;
      photoPreview.value = URL.createObjectURL(file);
    }
  }

  function resetPhotoState() {
    newPhotoFile.value = null;
    photoPreview.value = null;
  }

  function showSuccessAlert(text) {
    Swal.fire({
      toast: true,
      position: "top-end",
      title: "Sukses!",
      text: text,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }

  function showErrorAlert(text) {
    Swal.fire({
      title: "Error!",
      text: text,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }

  function showConfirmAlert(name) {
    return Swal.fire({
      title: "Apa Anda Yakin?",
      text: `Anda akan menghapus ${name} dari data ${options.singularName}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fb2c36",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Tidak, Batalkan!",
    });
  }

  return {
    items,
    loading,
    isModalOpen,
    isEditMode,
    isSaving,
    form,
    newPhotoFile,
    photoPreview,
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
  };
}
