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
const residentForm = ref({
  id: null,
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
const isSaving = ref(false);

async function fetchResidents() {
  try {
    loading.value = true;
    const { data, error } = await supabase.rpc("get_all_residents");
    if (error) throw error;
    residents.value = data;
  } catch (error) {
    Swal.fire("Error", `Gagal mengambil data warga: ${error.message}`, "error");
  } finally {
    loading.value = false;
  }
}

function openCreateModal() {
  isEditMode.value = false;
  residentForm.value = {
    id: null,
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  isModalOpen.value = true;
}
function openEditModal(resident) {
  isEditMode.value = true;
  residentForm.value = { ...resident, password: "", confirmPassword: "" };
  isModalOpen.value = true;
}
function closeModal() {
  isModalOpen.value = false;
}

async function handleSaveResident() {
  if (residentForm.value.password || !isEditMode.value) {
    if (residentForm.value.password !== residentForm.value.confirmPassword) {
      Swal.fire(
        "Error",
        "Password tidak cocok dengan konfirmasi password",
        "error"
      );
      return;
    }
  }

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
      "Sukses",
      `Data warga berhasil ${isEditMode.value ? "diupdate" : "ditambahkan"}`,
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
    title: "Apa Anda Yakin?",
    text: `Anda akan menghapus ${resident.name}. Anda tidak akan dapat mengembalikannya!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#fb2c36",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Tidak, batalkan!",
  });

  if (isConfirmed) {
    try {
      const { error } = await supabase.functions.invoke("manage-resident", {
        method: "DELETE",
        body: { id: resident.id },
      });
      if (error) throw error;
      Swal.fire("Terhapus!", "Data warga berhasil dihapus", "success");
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
      <h1 class="text-3xl font-bold">Data Warga</h1>
      <button
        @click="openCreateModal"
        class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto cursor-pointer"
      >
        Tambah Data Warga
      </button>
    </div>

    <div class="w-full overflow-hidden rounded-lg shadow-md">
      <div class="w-full overflow-x-auto">
        <table class="min-w-full whitespace-nowrap">
          <thead class="bg-gray-50">
            <tr
              class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <th scope="col" class="px-6 py-3">Nama</th>
              <th scope="col" class="px-6 py-3">Email</th>
              <th scope="col" class="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="3" class="px-6 py-4 text-center">Loading...</td>
            </tr>
            <tr v-else-if="residents.length === 0">
              <td colspan="3" class="px-6 py-4 text-center">
                Tidak ada data warga yang ditemukan
              </td>
            </tr>
            <tr
              v-for="resident in residents"
              :key="resident.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">{{ resident.name }}</td>
              <td class="px-6 py-4">{{ resident.email }}</td>
              <td class="px-6 py-4 text-right">
                <button
                  @click="openEditModal(resident)"
                  class="text-indigo-500 hover:text-indigo-900 mr-4 cursor-pointer transition-colors"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  @click="handleDeleteResident(resident)"
                  class="text-red-500 hover:text-red-900 cursor-pointer transition-colors"
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
