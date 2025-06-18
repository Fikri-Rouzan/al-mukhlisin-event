<script setup>
import Modal from "../Modal.vue";

defineProps({
  isOpen: Boolean,
  isEditMode: Boolean,
  speakerForm: Object,
  isSaving: Boolean,
  photoPreview: String,
  defaultAvatar: String,
});

const emit = defineEmits(["close", "save", "fileChange", "update:speakerForm"]);

function handleFileChange(event) {
  emit("fileChange", event);
}
</script>

<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <template #header>{{ isEditMode ? "Edit" : "Create" }} Speaker</template>
    <template #body>
      <form @submit.prevent="$emit('save')" id="speaker-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Photo</label>
          <div class="mt-1 flex items-center space-x-4">
            <img
              :src="photoPreview || defaultAvatar"
              alt="Preview"
              class="w-20 h-20 rounded-full object-cover bg-gray-100"
            />
            <input
              type="file"
              @change="handleFileChange"
              accept="image/*"
              class="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100"
            />
          </div>
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
          placeholder="Name"
          required
          class="w-full p-2 border rounded"
        />
        <input
          :value="speakerForm.phone_number"
          @input="
            $emit('update:speakerForm', {
              ...speakerForm,
              phone_number: $event.target.value,
            })
          "
          type="text"
          placeholder="Phone Number"
          class="w-full p-2 border rounded"
        />
        <textarea
          :value="speakerForm.address"
          @input="
            $emit('update:speakerForm', {
              ...speakerForm,
              address: $event.target.value,
            })
          "
          placeholder="Address"
          class="w-full p-2 border rounded"
        ></textarea>
      </form>
    </template>
    <template #footer>
      <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded">
        Cancel
      </button>
      <button
        type="submit"
        form="speaker-form"
        :disabled="isSaving"
        class="px-4 py-2 bg-primary text-white rounded disabled:bg-gray-400"
      >
        {{ isSaving ? "Saving..." : "Save" }}
      </button>
    </template>
  </Modal>
</template>
