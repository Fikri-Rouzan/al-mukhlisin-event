<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { supabase } from "../../../lib/supabase";
import Swal from "sweetalert2";
import VueMultiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { Type, Tag, CalendarClock, FileText, Image } from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

const isEditMode = ref(false);
const eventForm = ref({
  name: "",
  category: "",
  event_date: "",
  description: "",
  photo_url: "",
  committee: [],
  speakers: [],
});
const isSaving = ref(false);
const newPhotoFile = ref(null);
const photoPreview = ref(null);
const allCommittee = ref([]);
const allSpeakers = ref([]);
const isLoading = ref(true);

const eventId = route.params.id;
if (eventId) {
  isEditMode.value = true;
}

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    newPhotoFile.value = file;
    photoPreview.value = URL.createObjectURL(file);
  }
}

async function fetchInitialData() {
  try {
    isLoading.value = true;
    const [committeeRes, speakersRes] = await Promise.all([
      supabase.from("committee_members").select("id, name"),
      supabase.from("speakers").select("id, name"),
    ]);
    if (committeeRes.error) throw committeeRes.error;
    if (speakersRes.error) throw speakersRes.error;
    allCommittee.value = committeeRes.data;
    allSpeakers.value = speakersRes.data;

    if (isEditMode.value) {
      const { data, error } = await supabase.rpc("get_event_details", {
        p_event_id: eventId,
      });
      if (error) throw error;

      if (data) {
        const eventDetails = data.details;
        if (eventDetails.event_date) {
          eventDetails.event_date = eventDetails.event_date.slice(0, 16);
        }
        eventForm.value = {
          ...eventDetails,
          committee: data.committee,
          speakers: data.speakers,
        };
        photoPreview.value = eventDetails.photo_url;
      } else {
        throw new Error("Data kegiatan tidak ditemukan.");
      }
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: error.message,
      icon: "error",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    router.push({ name: "AdminEvents" });
  } finally {
    isLoading.value = false;
  }
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

    const payloadBody = {
      ...eventForm.value,
      id: isEditMode.value ? eventId : undefined,
      photo_url: finalPhotoUrl,
      committee_ids: eventForm.value.committee.map((c) => c.id),
      speaker_ids: eventForm.value.speakers.map((s) => s.id),
    };
    delete payloadBody.committee;
    delete payloadBody.speakers;
    delete payloadBody.created_at;

    const { error } = await supabase.functions.invoke("manage-event", {
      method: isEditMode.value ? "PATCH" : "POST",
      body: payloadBody,
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
    router.push({ name: "AdminEvents" });
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

onMounted(fetchInitialData);
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-4xl font-bold">
        {{ isEditMode ? "Edit Data Kegiatan" : "Tambah Data Kegiatan" }}
      </h1>
    </div>

    <div v-if="isLoading" class="text-center p-12">Loading...</div>
    <div v-else class="bg-white p-6 rounded-lg shadow-md">
      <form @submit.prevent="handleSave" id="event-form" class="space-y-4">
        <div>
          <p class="block text-sm font-medium text-gray-700">Foto</p>
          <div
            class="mt-1 flex flex-col items-start sm:flex-row sm:items-center gap-4"
          >
            <div
              class="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded"
            >
              <img
                v-if="photoPreview"
                :src="photoPreview"
                alt="Preview"
                class="w-full h-full rounded object-cover"
              />
              <Image v-else class="w-10 h-10 text-gray-400" />
            </div>
            <input
              type="file"
              @change="onFileChange"
              accept="image/*"
              class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100"
            />
          </div>
        </div>

        <div>
          <label
            for="event-name"
            class="block text-sm font-medium text-gray-700"
            >Nama</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Type class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="eventForm.name"
              type="text"
              id="event-name"
              required
              placeholder="Masukkan nama"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <div>
          <label
            for="event-category"
            class="block text-sm font-medium text-gray-700"
            >Kategori</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Tag class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="eventForm.category"
              type="text"
              id="event-category"
              required
              placeholder="Masukkan kategori"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <div>
          <label
            for="event-date"
            class="block text-sm font-medium text-gray-700"
            >Tanggal & Waktu</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <CalendarClock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="eventForm.event_date"
              type="datetime-local"
              id="event-date"
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        <div>
          <label
            for="event-description"
            class="block text-sm font-medium text-gray-700"
            >Deskripsi</label
          >
          <div class="relative mt-1">
            <div
              class="absolute top-0 left-0 pt-3 pl-3 flex items-center pointer-events-none"
            >
              <FileText class="w-5 h-5 text-gray-400" />
            </div>
            <textarea
              v-model="eventForm.description"
              id="event-description"
              required
              placeholder="Masukkan deskripsi"
              class="block w-full pl-10 pr-3 py-2 h-24 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
        </div>

        <div>
          <p class="block text-sm font-medium text-gray-700">Panitia</p>
          <VueMultiselect
            v-model="eventForm.committee"
            :options="allCommittee"
            :multiple="true"
            :searchable="true"
            track-by="id"
            label="name"
            placeholder="Pilih panitia"
            name="committee"
            class="mt-1"
          />
        </div>

        <div>
          <p class="block text-sm font-medium text-gray-700">Narasumber</p>
          <VueMultiselect
            v-model="eventForm.speakers"
            :options="allSpeakers"
            :multiple="true"
            :searchable="true"
            track-by="id"
            label="name"
            placeholder="Pilih narasumber"
            name="speakers"
            class="mt-1"
          />
        </div>

        <div class="flex justify-end md:justify-start items-center gap-4 pt-4">
          <router-link
            :to="{ name: 'AdminEvents' }"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer transition-colors"
          >
            Batal
          </router-link>
          <button
            type="submit"
            :disabled="isSaving"
            class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            {{ isSaving ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
