<script setup>
import { ref } from "vue";
import Modal from "../Modal.vue";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-vue-next";

defineProps({
  isOpen: Boolean,
  isEditMode: Boolean,
  residentForm: Object,
  isSaving: Boolean,
});

const emit = defineEmits(["close", "save", "update:residentForm"]);

const showPassword = ref(false);
const showConfirmPassword = ref(false);
</script>

<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <template #header>{{
      isEditMode ? "Edit Data Warga" : "Buat Data Warga Baru"
    }}</template>
    <template #body>
      <form
        @submit.prevent="$emit('save')"
        id="resident-form"
        class="space-y-4"
      >
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Nama</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <User class="w-5 h-5 text-gray-400" />
            </div>
            <input
              :value="residentForm.name"
              @input="
                $emit('update:residentForm', {
                  ...residentForm,
                  name: $event.target.value,
                })
              "
              type="text"
              id="name"
              autocomplete="name"
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Mail class="w-5 h-5 text-gray-400" />
            </div>
            <input
              :value="residentForm.email"
              @input="
                $emit('update:residentForm', {
                  ...residentForm,
                  email: $event.target.value,
                })
              "
              type="email"
              id="email"
              autocomplete="email"
              :disabled="isEditMode"
              :required="!isEditMode"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Lock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              :value="residentForm.password"
              @input="
                $emit('update:residentForm', {
                  ...residentForm,
                  password: $event.target.value,
                })
              "
              :type="showPassword ? 'text' : 'password'"
              id="password"
              :placeholder="
                isEditMode ? 'Biarkan kosong untuk tidak mengubah' : ''
              "
              :required="!isEditMode"
              class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 cursor-pointer"
            >
              <EyeOff v-if="showPassword" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700"
            >Konfirmasi Password</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Lock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              :value="residentForm.confirmPassword"
              @input="
                $emit('update:residentForm', {
                  ...residentForm,
                  confirmPassword: $event.target.value,
                })
              "
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              :placeholder="
                isEditMode ? 'Biarkan kosong untuk tidak mengubah' : ''
              "
              :required="!isEditMode && residentForm.password"
              class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 cursor-pointer"
            >
              <EyeOff v-if="showConfirmPassword" class="w-5 h-5" />
              <Eye v-else class="w-5 h-5" />
            </button>
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
        form="resident-form"
        :disabled="isSaving"
        class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
      >
        {{ isSaving ? "Menyimpan..." : "Simpan" }}
      </button>
    </template>
  </Modal>
</template>
