<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["close"]);
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          <slot name="header">Modal Header</slot>
        </h2>
        <button
          @click="emit('close')"
          class="text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
      </div>
      <div>
        <slot name="body">Modal Body</slot>
      </div>
      <div class="mt-6 flex justify-end space-x-4">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>
