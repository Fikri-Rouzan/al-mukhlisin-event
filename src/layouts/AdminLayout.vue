<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { Menu } from "lucide-vue-next";
import AdminSidebar from "../components/AdminSidebar.vue";

const { logout } = useAuth();
const isSidebarOpen = ref(false);

const closeSidebar = () => {
  isSidebarOpen.value = false;
};
</script>

<template>
  <div class="relative min-h-screen bg-gray-50">
    <div
      v-if="isSidebarOpen"
      @click="closeSidebar"
      class="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
    ></div>

    <AdminSidebar
      :is-open="isSidebarOpen"
      :logout="logout"
      :close-sidebar="closeSidebar"
    />

    <div class="flex flex-col md:ml-64">
      <header class="p-4 bg-white shadow-md md:hidden sticky top-0 z-10">
        <button @click="isSidebarOpen = true">
          <Menu class="w-6 h-6" />
        </button>
      </header>

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <RouterView />
      </main>
    </div>
  </div>
</template>
