<script setup>
import Modal from "../Modal.vue";
import VueMultiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";
import { Type, Tag, CalendarClock, FileText } from "lucide-vue-next";

defineProps({
  isOpen: Boolean,
  isEditMode: Boolean,
  eventForm: Object,
  isSaving: Boolean,
  photoPreview: String,
  defaultAvatar: String,
  allCommittee: Array,
  allSpeakers: Array,
});

const emit = defineEmits(["close", "save", "fileChange", "update:eventForm"]);

function handleFileChange(event) {
  emit("fileChange", event);
}
</script>

<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <template #header
      >{{ isEditMode ? "Edit " : "Buat " }} Data Kegiatan</template
    >
    <template #body>
      <form @submit.prevent="$emit('save')" id="event-form" class="space-y-4">
        <div>
          <p class="block text-sm font-medium text-gray-700">Foto</p>
          <div class="mt-1 flex items-center space-x-4">
            <img
              :src="photoPreview || defaultAvatar"
              alt="Preview"
              class="w-20 h-20 rounded object-cover bg-gray-100"
            />
            <input
              type="file"
              @change="handleFileChange"
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
              :value="eventForm.name"
              @input="
                $emit('update:eventForm', {
                  ...eventForm,
                  name: $event.target.value,
                })
              "
              type="text"
              id="event-name"
              required
              :placeholder="'Masukkan nama ' + (isEditMode ? ' baru' : '')"
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
              :value="eventForm.category"
              @input="
                $emit('update:eventForm', {
                  ...eventForm,
                  category: $event.target.value,
                })
              "
              type="text"
              id="event-category"
              required
              :placeholder="'Masukkan kategori ' + (isEditMode ? 'baru' : '')"
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
              :value="eventForm.event_date"
              @input="
                $emit('update:eventForm', {
                  ...eventForm,
                  event_date: $event.target.value,
                })
              "
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
              :value="eventForm.description"
              @input="
                $emit('update:eventForm', {
                  ...eventForm,
                  description: $event.target.value,
                })
              "
              id="event-description"
              required
              :placeholder="'Masukkan deskripsi ' + (isEditMode ? ' baru' : '')"
              class="block w-full pl-10 pr-3 py-2 h-24 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
        </div>

        <div>
          <p class="block text-sm font-medium text-gray-700">Panitia</p>
          <VueMultiselect
            :model-value="eventForm.committee"
            @update:model-value="
              $emit('update:eventForm', { ...eventForm, committee: $event })
            "
            :options="allCommittee"
            :multiple="true"
            :searchable="true"
            track-by="id"
            name="committee"
            label="name"
            :placeholder="'Pilih panitia ' + (isEditMode ? 'baru' : '')"
            open-direction="below"
            class="mt-1"
            :required="true"
          >
          </VueMultiselect>
        </div>

        <div>
          <p class="block text-sm font-medium text-gray-700">Narasumber</p>
          <VueMultiselect
            :model-value="eventForm.speakers"
            @update:model-value="
              $emit('update:eventForm', { ...eventForm, speakers: $event })
            "
            :options="allSpeakers"
            :multiple="true"
            :searchable="true"
            track-by="id"
            name="speakers"
            label="name"
            :placeholder="'Pilih narasumber ' + (isEditMode ? 'baru' : '')"
            open-direction="below"
            class="mt-1"
            :required="true"
          >
          </VueMultiselect>
        </div>
      </form>
    </template>
    <template #footer>
      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 cursor-pointer transition-colors"
      >
        Batal
      </button>
      <button
        type="submit"
        form="event-form"
        :disabled="isSaving"
        class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
      >
        {{ isSaving ? "Menyimpan..." : "Simpan" }}
      </button>
    </template>
  </Modal>
</template>
