import { ref } from "vue";
import { supabase } from "../../lib/supabase";

export function usePhotoUpload(storageName) {
  const newPhotoFile = ref(null);
  const photoPreview = ref(null);
  const isUploading = ref(false);

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      newPhotoFile.value = file;
      photoPreview.value = URL.createObjectURL(file);
    }
  }

  function resetPhotoState() {
    if (photoPreview.value && photoPreview.value.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview.value);
    }
    newPhotoFile.value = null;
    photoPreview.value = null;
  }

  async function uploadPhoto() {
    if (!newPhotoFile.value || !storageName) return null;
    isUploading.value = true;
    try {
      const fileName = `${Date.now()}-${newPhotoFile.value.name}`;
      const { data, error } = await supabase.storage
        .from(storageName)
        .upload(fileName, newPhotoFile.value);
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from(storageName)
        .getPublicUrl(data.path);
      return urlData.publicUrl;
    } finally {
      isUploading.value = false;
    }
  }

  async function deletePhoto(photoUrl) {
    if (!photoUrl || !storageName) return;
    try {
      const oldFilePath = new URL(photoUrl).pathname
        .split(`/${storageName}/`)
        .pop();
      if (oldFilePath) {
        await supabase.storage.from(storageName).remove([oldFilePath]);
      }
    } catch (error) {
      console.error("Gagal menghapus foto lama:", error.message);
    }
  }

  return {
    newPhotoFile,
    photoPreview,
    isUploading,
    handleFileChange,
    resetPhotoState,
    uploadPhoto,
    deletePhoto,
  };
}
