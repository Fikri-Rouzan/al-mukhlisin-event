<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";
import { Pencil, Trash2 } from "lucide-vue-next";
import Swal from "sweetalert2";
import ResidentModal from "../../components/admin/ResidentModal.vue";

const residents = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const residentForm = ref({ id: null, name: "", email: "", password: "" });
const isSaving = ref(false);

async function fetchResidents() {
  try {
    loading.value = true;
    const { data, error } = await supabase.rpc("get_all_residents");
    if (error) throw error;
    residents.value = data;
  } catch (error) {
    Swal.fire("Error", `Failed to fetch residents: ${error.message}`, "error");
  } finally {
    loading.value = false;
  }
}

function openCreateModal() {
  isEditMode.value = false;
  residentForm.value = { id: null, name: "", email: "", password: "" };
  isModalOpen.value = true;
}
function openEditModal(resident) {
  isEditMode.value = true;
  residentForm.value = { ...resident, password: "" };
  isModalOpen.value = true;
}
function closeModal() {
  isModalOpen.value = false;
}

async function handleSaveResident() {
  isSaving.value = true;
  try {
    let response;
    if (isEditMode.value) {
      response = await supabase.functions.invoke("manage-resident", {
        method: "PATCH",
        body: {
          id: residentForm.value.id,
          name: residentForm.value.name,
          password: residentForm.value.password || undefined,
        },
      });
    } else {
      response = await supabase.functions.invoke("manage-resident", {
        method: "POST",
        body: {
          email: residentForm.value.email,
          password: residentForm.value.password,
          name: residentForm.value.name,
        },
      });
    }

    if (response.error) throw response.error;
    Swal.fire(
      "Success",
      `Resident ${isEditMode.value ? "updated" : "created"} successfully!`,
      "success"
    );
    closeModal();
    fetchResidents();
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  } finally {
    isSaving.value = false;
  }
}

async function handleDeleteResident(resident) {
  const { isConfirmed } = await Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete ${resident.name}. You won't be able to revert this!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (isConfirmed) {
    try {
      const { error } = await supabase.functions.invoke("manage-resident", {
        method: "DELETE",
        body: { id: resident.id },
      });
      if (error) throw error;
      Swal.fire("Deleted!", "The resident has been deleted.", "success");
      fetchResidents();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  }
}

onMounted(() => {
  fetchResidents();
});
</script>

<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <h1 class="text-3xl font-bold">Data Resident</h1>
      <button
        @click="openCreateModal"
        class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto"
      >
        Create New Resident
      </button>
    </div>

    <div class="w-full overflow-hidden rounded-lg shadow-md">
      <div class="w-full overflow-x-auto">
        <table class="min-w-full whitespace-nowrap">
          <thead class="bg-gray-50">
            <tr
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <th scope="col" class="px-6 py-3">Name</th>
              <th scope="col" class="px-6 py-3">Email</th>
              <th scope="col" class="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="3" class="px-6 py-4 text-center">Loading...</td>
            </tr>
            <tr v-else-if="residents.length === 0">
              <td colspan="3" class="px-6 py-4 text-center">
                No residents found.
              </td>
            </tr>
            <tr
              v-for="resident in residents"
              :key="resident.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4">{{ resident.name }}</td>
              <td class="px-6 py-4">{{ resident.email }}</td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="openEditModal(resident)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  @click="handleDeleteResident(resident)"
                  class="text-red-600 hover:text-red-900"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ResidentModal
      :isOpen="isModalOpen"
      :isEditMode="isEditMode"
      :residentForm="residentForm"
      :isSaving="isSaving"
      @close="isModalOpen = false"
      @save="handleSaveResident"
      @update:residentForm="residentForm = $event"
    />
  </div>
</template>
