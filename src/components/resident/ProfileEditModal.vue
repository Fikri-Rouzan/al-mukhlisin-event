<script setup>
import { ref, watch } from "vue";
import Modal from "../Modal.vue";
import { Eye, EyeOff, User, Lock } from "lucide-vue-next";

const props = defineProps({
  isOpen: Boolean,
  profileData: Object,
  isSaving: Boolean,
});

const emit = defineEmits(["close", "save"]);

const form = ref({
  name: "",
  newPassword: "",
  confirmPassword: "",
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      form.value.name = props.profileData?.name || "";
      form.value.newPassword = "";
      form.value.confirmPassword = "";
    }
  }
);

function handleSubmit() {
  emit("save", { ...form.value });
}
</script>

<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <template #header>Edit Profil Saya</template>
    <template #body>
      <form
        @submit.prevent="handleSubmit"
        id="profile-edit-form"
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
              v-model="form.name"
              type="text"
              id="name"
              autocomplete="name"
              placeholder="Masukkan nama baru"
              required
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label
            for="new-password"
            class="block text-sm font-medium text-gray-700"
            >Password Baru</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Lock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="form.newPassword"
              :type="showPassword ? 'text' : 'password'"
              id="new-password"
              placeholder="Biarkan kosong jika tidak ingin mengubah"
              class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 cursor-pointer"
            >
              <Eye v-if="!showPassword" class="h-5 w-5" />
              <EyeOff v-else class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label
            for="confirm-password"
            class="block text-sm font-medium text-gray-700"
            >Konfirmasi Password Baru</label
          >
          <div class="relative mt-1">
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <Lock class="w-5 h-5 text-gray-400" />
            </div>
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirm-password"
              placeholder="Biarkan kosong jika tidak ingin mengubah"
              class="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 cursor-pointer"
            >
              <Eye v-if="!showConfirmPassword" class="h-5 w-5" />
              <EyeOff v-else class="h-5 w-5" />
            </button>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors cursor-pointer"
      >
        Batal
      </button>
      <button
        type="submit"
        form="profile-edit-form"
        :disabled="isSaving"
        class="px-4 py-2 bg-primary hover:bg-secondary text-white rounded-md disabled:bg-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        {{ isSaving ? "Menyimpan..." : "Simpan Perubahan" }}
      </button>
    </template>
  </Modal>
</template>
