<script setup>
import Modal from "../Modal.vue";
import VueMultiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";

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
    <template #header>{{ isEditMode ? "Edit" : "Create" }} Event</template>
    <template #body>
      <form @submit.prevent="$emit('save')" id="event-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Event Photo</label
          >
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
          <label class="block text-sm font-medium text-gray-700"
            >Event Name</label
          >
          <input
            :value="eventForm.name"
            @input="
              $emit('update:eventForm', {
                ...eventForm,
                name: $event.target.value,
              })
            "
            type="text"
            placeholder="e.g., Kajian Subuh"
            required
            class="mt-1 w-full p-2 border rounded-md shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Category</label
          >
          <input
            :value="eventForm.category"
            @input="
              $emit('update:eventForm', {
                ...eventForm,
                category: $event.target.value,
              })
            "
            type="text"
            placeholder="e.g., Kajian Rutin, Tabligh Akbar"
            class="mt-1 w-full p-2 border rounded-md shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Date & Time</label
          >
          <input
            :value="eventForm.event_date"
            @input="
              $emit('update:eventForm', {
                ...eventForm,
                event_date: $event.target.value,
              })
            "
            type="datetime-local"
            required
            class="mt-1 w-full p-2 border rounded-md shadow-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <textarea
            :value="eventForm.description"
            @input="
              $emit('update:eventForm', {
                ...eventForm,
                description: $event.target.value,
              })
            "
            placeholder="Description"
            class="mt-1 w-full p-2 border rounded-md shadow-sm h-24"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Involved Committee</label
          >
          <VueMultiselect
            :model-value="eventForm.committee"
            @update:model-value="
              $emit('update:eventForm', { ...eventForm, committee: $event })
            "
            :options="allCommittee"
            :multiple="true"
            :searchable="false"
            track-by="id"
            label="name"
            placeholder="Select committee members"
            class="mt-1"
          >
          </VueMultiselect>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700"
            >Involved Speakers</label
          >
          <VueMultiselect
            :model-value="eventForm.speakers"
            @update:model-value="
              $emit('update:eventForm', { ...eventForm, speakers: $event })
            "
            :options="allSpeakers"
            :multiple="true"
            :searchable="false"
            track-by="id"
            label="name"
            placeholder="Select speakers"
            class="mt-1"
          >
          </VueMultiselect>
        </div>
      </form>
    </template>
    <template #footer>
      <button
        @click="$emit('close')"
        class="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="event-form"
        :disabled="isSaving"
        class="px-4 py-2 bg-primary text-white rounded-md disabled:bg-gray-400"
      >
        {{ isSaving ? "Saving..." : "Save" }}
      </button>
    </template>
  </Modal>
</template>
