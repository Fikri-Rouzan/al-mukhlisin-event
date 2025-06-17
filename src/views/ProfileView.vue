<script setup>
import { useAuth } from "../composables/useAuth";

const { user, profile, logout } = useAuth();
</script>

<template>
  <div class="max-w-2xl mx-auto p-8 bg-white shadow-md rounded-lg mt-10">
    <h1 class="text-3xl font-bold text-primary mb-6">My Profile</h1>
    <div v-if="profile" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-500">Name</label>
        <p class="text-lg text-gray-800">{{ profile.name }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-500">Email</label>
        <p class="text-lg text-gray-800">{{ user.email }}</p>
      </div>
      <button
        @click="logout"
        class="mt-6 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
    <div v-else>
      <p>Loading profile...</p>
    </div>
  </div>
</template>
