<script setup>
import Modal from "../Modal.vue";

defineProps({
  isOpen: Boolean,
  isEditMode: Boolean,
  residentForm: Object,
  isSaving: Boolean,
});

const emit = defineEmits(["close", "save", "update:residentForm"]);
</script>

<template>
  <Modal :isOpen="isOpen" @close="$emit('close')">
    <template #header>{{
      isEditMode ? "Edit Resident" : "Create New Resident"
    }}</template>
    <template #body>
      <form
        @submit.prevent="$emit('save')"
        id="resident-form"
        class="space-y-4"
      >
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
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
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
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
            :disabled="isEditMode"
            :required="!isEditMode"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700"
            >Password</label
          >
          <input
            :value="residentForm.password"
            @input="
              $emit('update:residentForm', {
                ...residentForm,
                password: $event.target.value,
              })
            "
            type="password"
            id="password"
            :placeholder="isEditMode ? 'Leave blank to keep unchanged' : ''"
            :required="!isEditMode"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
      </form>
    </template>
    <template #footer>
      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="resident-form"
        :disabled="isSaving"
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:bg-gray-400"
      >
        {{ isSaving ? "Saving..." : "Save" }}
      </button>
    </template>
  </Modal>
</template>
