<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";
import { Pencil, Trash2, Eye } from "lucide-vue-next";
import Swal from "sweetalert2";
import CommitteeModal from "../../components/admin/CommitteeModal.vue";

const committeeMembers = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);
const committeeForm = ref({
  id: null,
  name: "",
  photo_url: "",
  position: "",
  phone_number: "",
  address: "",
});
const newPhotoFile = ref(null);
const photoPreview = ref(null);

const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-circle-2"><path d="M18 20a6 6 0 0 0-12 0"/><circle cx="12" cy="10" r="4"/><circle cx="12" cy="12" r="10"/></svg>`;

async function fetchCommitteeMembers() {
  try {
    loading.value = true;
    const { data, error } = await supabase
      .from("committee_members")
      .select("*")
      .order("name");
    if (error) throw error;
    committeeMembers.value = data;
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } finally {
    loading.value = false;
  }
}

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    newPhotoFile.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
}

function openCreateModal() {
  isEditMode.value = false;
  committeeForm.value = {
    id: null,
    name: "",
    photo_url: "",
    position: "",
    phone_number: "",
    address: "",
  };
  newPhotoFile.value = null;
  photoPreview.value = null;
  isModalOpen.value = true;
}

function openEditModal(member) {
  isEditMode.value = true;
  committeeForm.value = { ...member };
  newPhotoFile.value = null;
  photoPreview.value = member.photo_url;
  isModalOpen.value = true;
}

async function handleSave() {
  isSaving.value = true;
  let finalPhotoUrl = committeeForm.value.photo_url;

  try {
    if (newPhotoFile.value) {
      if (isEditMode.value && committeeForm.value.photo_url) {
        const oldFilePath = new URL(committeeForm.value.photo_url).pathname
          .split("/")
          .pop();
        await supabase.storage.from("committee-photos").remove([oldFilePath]);
      }

      const fileName = `${Date.now()}-${newPhotoFile.value.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("committee-photos")
        .upload(fileName, newPhotoFile.value);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("committee-photos")
        .getPublicUrl(uploadData.path);
      finalPhotoUrl = urlData.publicUrl;
    }

    const payload = { ...committeeForm.value, photo_url: finalPhotoUrl };
    const response = await supabase.functions.invoke("manage-committee", {
      method: isEditMode.value ? "PATCH" : "POST",
      body: payload,
    });

    if (response.error) throw response.error;

    Swal.fire({
      toast: true,
      position: "top-end",
      title: "Sukses!",
      text: `Data panitia berhasil ${
        isEditMode.value ? "diperbarui" : "ditambahkan"
      }`,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    isModalOpen.value = false;
    fetchCommitteeMembers();
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  } finally {
    isSaving.value = false;
  }
}

async function handleDelete(member) {
  const { isConfirmed } = await Swal.fire({
    title: "Apa Anda yakin?",
    text: `Anda akan menghapus ${member.name} dari data panitia`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#fb2c36",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Tidak, Batalkan!",
  });
  if (isConfirmed) {
    try {
      const { error } = await supabase.functions.invoke("manage-committee", {
        method: "DELETE",
        body: { id: member.id, photo_url: member.photo_url },
      });
      if (error) throw error;
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Terhapus!",
        text: `Data panitia ${member.name} berhasil dihapus`,
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      fetchCommitteeMembers();
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.message,
        icon: "error",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  }
}

onMounted(fetchCommitteeMembers);
</script>

<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <h1 class="text-3xl font-bold">Data Panitia</h1>
      <button
        @click="openCreateModal"
        class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto cursor-pointer"
      >
        Tambah Data Panitia
      </button>
    </div>

    <div class="w-full overflow-hidden rounded-lg shadow-md">
      <div class="w-full overflow-x-auto">
        <table class="min-w-full whitespace-nowrap">
          <thead class="bg-gray-50">
            <tr
              class="text-left text-sm font-bold text-gray-500 uppercase tracking-wider bg-gray-200"
            >
              <th class="px-6 py-3">Foto</th>
              <th class="px-6 py-3">Nama</th>
              <th class="px-6 py-3">Posisi</th>
              <th class="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="4" class="px-6 py-4 text-center">Loading...</td>
            </tr>
            <tr v-else-if="committeeMembers.length === 0">
              <td colspan="4" class="px-6 py-4 text-center">
                Tidak ada data panitia yang ditemukan
              </td>
            </tr>
            <tr
              v-for="member in committeeMembers"
              :key="member.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <img
                  :src="member.photo_url || defaultAvatar"
                  alt="Photo"
                  class="w-10 h-10 rounded-full object-cover text-gray-300"
                />
              </td>
              <td class="px-6 py-4">{{ member.name }}</td>
              <td class="px-6 py-4">{{ member.position }}</td>
              <td class="px-6 py-4 text-right">
                <router-link
                  :to="`/admin/committee/${member.id}`"
                  class="text-indigo-500 hover:text-indigo-900 mr-4 inline-block align-middle transition-colors"
                >
                  <Eye class="w-5 h-5" />
                </router-link>
                <button
                  @click="openEditModal(member)"
                  class="text-orange-500 hover:text-orange-900 mr-4 inline-block align-middle cursor-pointer transition-colors"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  @click="handleDelete(member)"
                  class="text-red-500 hover:text-red-900 inline-block align-middle cursor-pointer transition-colors"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <CommitteeModal
      :isOpen="isModalOpen"
      :isEditMode="isEditMode"
      :committeeForm="committeeForm"
      :isSaving="isSaving"
      :photoPreview="photoPreview"
      :defaultAvatar="defaultAvatar"
      @close="isModalOpen = false"
      @save="handleSave"
      @fileChange="onFileChange"
      @update:committeeForm="committeeForm = $event"
    />
  </div>
</template>
