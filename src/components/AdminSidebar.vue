<script setup>
import { RouterLink } from "vue-router";
import { Users, Shield, Mic, CalendarDays, LogOut, X } from "lucide-vue-next";
import Swal from "sweetalert2";

const props = defineProps({
  isOpen: Boolean,
  logout: Function,
  closeSidebar: Function,
});

const confirmLogout = () => {
  props.closeSidebar();
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Anda akan keluar dari sesi admin ini.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Logout!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      props.logout();
    }
  });
};

const emit = defineEmits(["close"]);
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-30 w-64 bg-primary text-white flex flex-col transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'md:relative md:translate-x-0',
    ]"
  >
    <div class="p-4 border-b border-gray-700 flex justify-between items-center">
      <RouterLink
        to="/admin/residents"
        @click="closeSidebar"
        class="text-xl font-bold hover:text-secondary transition-colors cursor-pointer"
      >
        Dashboard Admin
      </RouterLink>
      <button @click="closeSidebar" class="md:hidden">
        <X class="w-6 h-6" />
      </button>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <RouterLink
        to="/admin/residents"
        @click="closeSidebar"
        class="admin-nav-item flex items-center p-2 space-x-3 rounded-lg hover:bg-secondary transition-colors"
      >
        <Users :size="20" /><span>Data Warga</span>
      </RouterLink>
      <RouterLink
        to="/admin/committee"
        @click="closeSidebar"
        class="admin-nav-item flex items-center p-2 space-x-3 rounded-lg hover:bg-secondary transition-colors"
      >
        <Shield :size="20" /><span>Data Panitia</span>
      </RouterLink>
      <RouterLink
        to="/admin/speakers"
        @click="closeSidebar"
        class="admin-nav-item flex items-center p-2 space-x-3 rounded-lg hover:bg-secondary transition-colors"
      >
        <Mic :size="20" /><span>Data Narasumber</span>
      </RouterLink>
      <RouterLink
        to="/admin/events"
        @click="closeSidebar"
        class="admin-nav-item flex items-center p-2 space-x-3 rounded-lg hover:bg-secondary transition-colors"
      >
        <CalendarDays :size="20" /><span>Data Kegiatan</span>
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-gray-700">
      <button
        @click="confirmLogout"
        class="w-full flex items-center p-2 space-x-3 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
      >
        <LogOut :size="20" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>
