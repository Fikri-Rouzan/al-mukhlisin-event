<script setup>
import Modal from "../Modal.vue";
import { User, Phone, MapPin, UserCircle2 } from "lucide-vue-next";

defineProps({
  isOpen: Boolean,
  isEditMode: Boolean,
  speakerForm: Object,
  isSaving: Boolean,
  photoPreview: String,
});

const emit = defineEmits(["close", "save", "fileChange", "update:speakerForm"]);

function handleFileChange(event) {
  emit("fileChange", event);
}
</script>

<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <template #header
      >{{ isEditMode ? "Edit " : "Buat " }} Data Narasumber
    </template>
    <template #body>
      <form @submit.prevent="$emit('save')" id="speaker-form" class="space-y-4">
        <div>
          <p class="block text-sm font-medium text-gray-700">Foto</p>
          <div class="mt-1 flex items-center space-x-4">
            <div class="w-20 h-20 flex-shrink-0">
              <img
                v-if="photoPreview"
                :src="photoPreview"
                alt="Preview"
                class="w-full h-full rounded-full object-cover"
              />
              <UserCircle2 v-else class="w-full h-full text-gray-300" />
            </div>
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
            for="speaker-name"
            class="block text-sm font-medium text-gray-700"
            >Nama</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <User class="w-5 h-5 text-gray-400" />
            </div>
            <input
              :value="speakerForm.name"
              @input="
                $emit('update:speakerForm', {
                  ...speakerForm,
                  name: $event.target.value,
                })
              "
              type="text"
              id="speaker-name"
              :placeholder="'Masukkan nama ' + (isEditMode ? 'baru' : '')"
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label
            for="speaker-phone"
            class="block text-sm font-medium text-gray-700"
            >Nomor Telepon</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Phone class="w-5 h-5 text-gray-400" />
            </div>
            <input
              :value="speakerForm.phone_number"
              @input="
                $emit('update:speakerForm', {
                  ...speakerForm,
                  phone_number: $event.target.value,
                })
              "
              type="number"
              min="0"
              id="speaker-phone"
              :placeholder="
                'Masukkan nomor telepon ' + (isEditMode ? 'baru' : '')
              "
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label
            for="speaker-address"
            class="block text-sm font-medium text-gray-700"
            >Alamat</label
          >
          <div class="relative mt-1">
            <div
              class="absolute top-0 left-0 pt-3 pl-3 flex items-center pointer-events-none"
            >
              <MapPin class="w-5 h-5 text-gray-400" />
            </div>
            <textarea
              :value="speakerForm.address"
              @input="
                $emit('update:speakerForm', {
                  ...speakerForm,
                  address: $event.target.value,
                })
              "
              id="speaker-address"
              required
              rows="3"
              :placeholder="'Masukkan alamat ' + (isEditMode ? 'baru' : '')"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
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
        form="speaker-form"
        :disabled="isSaving"
        class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
      >
        {{ isSaving ? "Menyimpan..." : "Simpan" }}
      </button>
    </template>
  </Modal>
</template>
