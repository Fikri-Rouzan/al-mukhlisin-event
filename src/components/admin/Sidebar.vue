<script setup>
import { RouterLink } from "vue-router";
import {
  Users,
  Shield,
  Mic,
  CalendarDays,
  HelpCircle,
  LogOut,
  X,
} from "lucide-vue-next";
import Swal from "sweetalert2";

defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(["close", "logout"]);

const navItems = [
  { to: "/admin/residents", icon: Users, label: "Data Warga" },
  { to: "/admin/committee", icon: Shield, label: "Data Panitia" },
  { to: "/admin/speakers", icon: Mic, label: "Data Narasumber" },
  { to: "/admin/events", icon: CalendarDays, label: "Data Kegiatan" },
];

const confirmLogout = () => {
  emit("close");

  Swal.fire({
    title: "Ingin Logout?",
    text: "Anda akan keluar dari akun ini.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#006a4e",
    confirmButtonText: "Ya, Logout!",
    cancelButtonText: "Batal!",
    customClass: {
      container: "swal-container",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      emit("logout");
    }
  });
};
</script>

<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-30 w-64 bg-primary text-white flex flex-col transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'md:translate-x-0',
    ]"
  >
    <div class="p-4 border-b border-gray-700 flex justify-between items-center">
      <RouterLink
        to="/admin/residents"
        @click="$emit('close')"
        class="text-xl font-bold hover:text-secondary transition-colors cursor-pointer"
      >
        Dashboard Admin
      </RouterLink>
      <button @click="$emit('close')" class="md:hidden">
        <X class="w-6 h-6" />
      </button>
    </div>

    <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        @click="$emit('close')"
        class="admin-nav-item flex items-center p-2 space-x-3 rounded-lg hover:bg-secondary transition-colors"
      >
        <component :is="item.icon" :size="20" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-gray-700 space-y-2">
      <RouterLink
        :to="{ name: 'AdminHelp' }"
        @click="$emit('close')"
        class="admin-help w-full flex items-center p-2 space-x-3 rounded-lg hover:bg-gray-600 transition-colors"
      >
        <HelpCircle :size="20" />
        <span>Panduan</span>
      </RouterLink>

      <button
        @click="confirmLogout"
        class="w-full flex items-center p-2 bg-red-500 space-x-3 rounded-lg hover:bg-red-800 transition-colors cursor-pointer"
      >
        <LogOut :size="20" />
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>
