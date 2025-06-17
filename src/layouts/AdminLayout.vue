<script setup>
import { RouterView, RouterLink } from "vue-router";
import { useAuth } from "../composables/useAuth";

const { logout } = useAuth();
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <aside class="w-64 bg-gray-800 text-white flex flex-col">
      <div class="p-4 border-b border-gray-700">
        <h2 class="text-xl font-bold">Admin Menu</h2>
      </div>
      <nav class="flex-1 p-4 space-y-2">
        <RouterLink
          to="/admin/residents"
          class="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >Data Resident</RouterLink
        >
      </nav>
      <div class="p-4 border-t border-gray-700">
        <button
          @click="logout"
          class="w-full text-left p-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>

    <main class="flex-1 p-8">
      <RouterView />
    </main>
  </div>
</template>
