<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";
import { Pencil, Trash2, UserCircle2 } from "lucide-vue-next";
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
    Swal.fire("Error", `Failed to fetch data: ${error.message}`, "error");
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

    Swal.fire(
      "Success",
      `Committee member ${isEditMode.value ? "updated" : "created"}!`,
      "success"
    );
    isModalOpen.value = false;
    fetchCommitteeMembers();
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  } finally {
    isSaving.value = false;
  }
}

async function handleDelete(member) {
  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: `Delete ${member.name}?`,
    icon: "warning",
    showCancelButton: true,
  });
  if (isConfirmed) {
    try {
      const { error } = await supabase.functions.invoke("manage-committee", {
        method: "DELETE",
        body: { id: member.id, photo_url: member.photo_url },
      });
      if (error) throw error;
      Swal.fire("Deleted!", "Data has been deleted.", "success");
      fetchCommitteeMembers();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  }
}

onMounted(fetchCommitteeMembers);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Data Panitia</h1>
      <button
        @click="openCreateModal"
        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
      >
        + Create New Member
      </button>
    </div>

    <div class="bg-white shadow-md rounded-lg overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Photo
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Name
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
            >
              Position
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="loading">
            <td colspan="4" class="text-center p-4">Loading...</td>
          </tr>
          <tr v-else-if="committeeMembers.length === 0">
            <td colspan="4" class="text-center p-4">No data found.</td>
          </tr>
          <tr
            v-for="member in committeeMembers"
            :key="member.id"
            class="hover:bg-gray-50"
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
              <button
                @click="openEditModal(member)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                <Pencil class="w-5 h-5" />
              </button>
              <button
                @click="handleDelete(member)"
                class="text-red-600 hover:text-red-900"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
