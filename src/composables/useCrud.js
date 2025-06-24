import { ref, reactive } from "vue";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";

export function useCrud(options) {
  const items = ref([]);
  const loading = ref(true);
  const isModalOpen = ref(false);
  const isEditMode = ref(false);
  const isSaving = ref(false);

  const form = reactive({ data: {} });

  const newPhotoFile = ref(null);
  const photoPreview = ref(null);

  async function fetchItems() {
    try {
      loading.value = true;
      let response;
      if (options.fetchRpc) {
        response = await supabase.rpc(options.fetchRpc);
      } else {
        response = await supabase
          .from(options.tableName)
          .select("*")
          .order("name");
      }

      if (response.error) throw response.error;
      items.value = response.data;
    } catch (error) {
      showErrorAlert(error.message);
    } finally {
      loading.value = false;
    }
  }

  async function saveItem() {
    if (
      form.data.password &&
      form.data.password !== form.data.confirmPassword
    ) {
      showErrorAlert("Password tidak cocok dengan konfirmasi password");
      return;
    }

    isSaving.value = true;
    let finalPhotoUrl = form.data.photo_url || null;

    try {
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
        {
          method: isEditMode.value ? "PATCH" : "POST",
          body: payload,
        }
      );

      if (error) throw error;

      showSuccessAlert(
        `Data ${options.singularName} berhasil ${
          isEditMode.value ? "diperbarui" : "ditambahkan"
        }`
      );
      closeModal();
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
          {
            method: "DELETE",
            body: { id: item.id, photo_url: item.photo_url },
          }
        );
        if (error) throw error;
        showSuccessAlert(
          `Data ${options.singularName} ${item.name} berhasil dihapus.`
        );
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
    fetchItems,
    saveItem,
    deleteItem,
    openModal,
    openEditModal,
    closeModal,
    handleFileChange,
  };
}
