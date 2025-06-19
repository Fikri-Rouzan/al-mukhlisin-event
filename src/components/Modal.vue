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
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
    @click.self="emit('close')"
  >
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div class="flex justify-center items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">
          <slot name="header">Modal Header</slot>
        </h2>
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
