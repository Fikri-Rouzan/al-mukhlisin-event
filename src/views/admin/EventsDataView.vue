<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../../lib/supabase";
import { Pencil, Trash2, Eye, Image } from "lucide-vue-next";
import Swal from "sweetalert2";
import EventModal from "../../components/admin/EventModal.vue";

const events = ref([]);
const allCommittee = ref([]);
const allSpeakers = ref([]);
const loading = ref(true);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);
const eventForm = ref({});
const newPhotoFile = ref(null);
const photoPreview = ref(null);

async function fetchAllData() {
  try {
    loading.value = true;
    const [eventsRes, committeeRes, speakersRes] = await Promise.all([
      supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false }),
      supabase.from("committee_members").select("id, name"),
      supabase.from("speakers").select("id, name"),
    ]);
    if (eventsRes.error) throw eventsRes.error;
    if (committeeRes.error) throw committeeRes.error;
    if (speakersRes.error) throw speakersRes.error;

    events.value = eventsRes.data;
    allCommittee.value = committeeRes.data;
    allSpeakers.value = speakersRes.data;
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

async function openCreateModal() {
  isEditMode.value = false;
  eventForm.value = {
    name: "",
    category: "",
    event_date: "",
    description: "",
    photo_url: "",
    committee: [],
    speakers: [],
  };
  newPhotoFile.value = null;
  photoPreview.value = null;
  isModalOpen.value = true;
}

async function openEditModal(event) {
  isEditMode.value = true;
  const { data, error } = await supabase.rpc("get_event_details", {
    p_event_id: event.id,
  });
  if (error) {
    return Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }

  const eventDetails = data.details;
  if (eventDetails.event_date) {
    eventDetails.event_date = eventDetails.event_date.slice(0, 16);
  }

  eventForm.value = {
    ...eventDetails,
    committee: data.committee,
    speakers: data.speakers,
  };
  newPhotoFile.value = null;
  photoPreview.value = event.photo_url;
  isModalOpen.value = true;
}

async function handleSave() {
  isSaving.value = true;
  let finalPhotoUrl = eventForm.value.photo_url;
  try {
    if (newPhotoFile.value) {
      if (isEditMode.value && eventForm.value.photo_url) {
        const oldFilePath = new URL(eventForm.value.photo_url).pathname
          .split("event-photos/")
          .pop();
        await supabase.storage.from("event-photos").remove([oldFilePath]);
      }

      const fileName = `${Date.now()}-${newPhotoFile.value.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("event-photos")
        .upload(fileName, newPhotoFile.value);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("event-photos")
        .getPublicUrl(uploadData.path);
      finalPhotoUrl = urlData.publicUrl;
    }

    const payload = {
      ...eventForm.value,
      photo_url: finalPhotoUrl,
      committee_ids: eventForm.value.committee.map((c) => c.id),
      speaker_ids: eventForm.value.speakers.map((s) => s.id),
    };
    delete payload.committee;
    delete payload.speakers;
    delete payload.created_at;

    const { error } = await supabase.functions.invoke("manage-event", {
      method: isEditMode.value ? "PATCH" : "POST",
      body: payload,
    });

    if (error) throw error;
    Swal.fire({
      toast: true,
      position: "top-end",
      title: "Sukses!",
      text: `Data kegiatan berhasil ${
        isEditMode.value ? "diperbarui" : "ditambahkan"
      }`,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    isModalOpen.value = false;
    fetchAllData();
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

async function handleDelete(event) {
  const { isConfirmed } = await Swal.fire({
    title: "Apa Anda Yakin?",
    text: `Anda akan menghapus ${event.name} dari data kegiatan`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#fb2c36",
    confirmButtonText: "Ya, Hapus!",
    cancelButtonText: "Tidak, Batalkan!",
  });
  if (isConfirmed) {
    try {
      const { error } = await supabase.functions.invoke("manage-event", {
        method: "DELETE",
        body: { id: event.id, photo_url: event.photo_url },
      });
      if (error) throw error;
      Swal.fire({
        toast: true,
        position: "top-end",
        title: "Terhapus!",
        text: `Data kegiatan ${event.name} berhasil dihapus`,
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      fetchAllData();
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

onMounted(fetchAllData);
</script>

<template>
  <div>
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4"
    >
      <h1 class="text-3xl font-bold">Data Kegiatan</h1>
      <button
        @click="openCreateModal"
        class="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors w-full sm:w-auto cursor-pointer"
      >
        Tambah Data Kegiatan
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
              <th class="px-6 py-3">Kategori</th>
              <th class="px-6 py-3">Tanggal & Waktu</th>
              <th class="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-4 text-center">Loading...</td>
            </tr>
            <tr v-else-if="events.length === 0">
              <td colspan="5" class="px-6 py-4 text-center">
                Tidak ada data kegiatan yang ditemukan
              </td>
            </tr>
            <tr
              v-for="event in events"
              :key="event.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div
                  class="w-16 h-10 flex items-center justify-center bg-gray-100 rounded"
                >
                  <img
                    v-if="event.photo_url"
                    :src="event.photo_url"
                    alt="Event Photo"
                    class="w-full h-full object-cover rounded"
                  />
                  <Image v-else class="w-6 h-6 text-gray-400" />
                </div>
              </td>
              <td class="px-6 py-4 font-medium">{{ event.name }}</td>
              <td class="px-6 py-4">{{ event.category }}</td>
              <td class="px-6 py-4">
                {{
                  new Date(event.event_date).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                }}
              </td>
              <td class="px-6 py-4 text-right">
                <router-link
                  :to="`/admin/events/${event.id}`"
                  class="text-indigo-600 hover:text-indigo-900 mr-4 inline-block align-middle transition-colors"
                  ><Eye class="w-5 h-5"
                /></router-link>
                <button
                  @click="openEditModal(event)"
                  class="text-orange-500 hover:text-orange-900 mr-4 inline-block align-middle cursor-pointer transition-colors"
                >
                  <Pencil class="w-5 h-5" />
                </button>
                <button
                  @click="handleDelete(event)"
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

    <EventModal
      :isOpen="isModalOpen"
      :isEditMode="isEditMode"
      :eventForm="eventForm"
      :isSaving="isSaving"
      :photoPreview="photoPreview"
      :allCommittee="allCommittee"
      :allSpeakers="allSpeakers"
      @close="isModalOpen = false"
      @save="handleSave"
      @fileChange="onFileChange"
      @update:eventForm="eventForm = $event"
    />
  </div>
</template>
