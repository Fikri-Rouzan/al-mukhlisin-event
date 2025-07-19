<script setup>
import { ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { Home, Calendar, User, Menu, X, LogIn, LogOut } from "lucide-vue-next";
import Swal from "sweetalert2";

const { user, logout } = useAuth();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

async function handleLogout() {
  closeMenu();
  const result = await Swal.fire({
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
  });

  if (result.isConfirmed) {
    await logout();
  }
}

const navLinks = computed(() => {
  const baseLinks = [
    { text: "Beranda", to: "/", icon: Home, type: "link" },
    { text: "Kegiatan", to: "/events", icon: Calendar, type: "link" },
    { text: "Profil", to: "/profile", icon: User, type: "link" },
  ];

  if (user.value) {
    return [
      ...baseLinks,
      { text: "Logout", action: handleLogout, icon: LogOut, type: "button" },
    ];
  } else {
    return [
      ...baseLinks,
      { text: "Login", to: "/login", icon: LogIn, type: "link" },
    ];
  }
});
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 bg-primary text-white shadow-lg z-[2000]"
  >
    <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
      <RouterLink
        to="/"
        class="text-2xl font-bold hover:text-secondary transition-colors"
        @click="closeMenu"
      >
        Al Mukhlisin
      </RouterLink>

      <div class="hidden md:flex items-center space-x-2">
        <template v-for="link in navLinks" :key="link.text">
          <RouterLink
            v-if="link.type === 'link'"
            :to="link.to"
            class="nav-item flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
          >
            <component :is="link.icon" :size="18" />
            <span>{{ link.text }}</span>
          </RouterLink>
          <button
            v-else
            @click="link.action"
            class="nav-item flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors cursor-pointer"
          >
            <component :is="link.icon" :size="18" />
            <span>{{ link.text }}</span>
          </button>
        </template>
      </div>

      <div class="md:hidden">
        <button @click="toggleMenu" class="focus:outline-none">
          <Menu :size="28" />
        </button>
      </div>
    </nav>
  </header>

  <Transition
    enter-active-class="transition ease-in-out duration-300 transform"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition ease-in-out duration-300 transform"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div
      v-if="isMenuOpen"
      class="fixed top-0 right-0 h-full w-3/4 max-w-sm bg-primary text-white p-6 z-[2000] flex flex-col md:hidden"
    >
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-xl font-bold">Menu</h2>
        <button @click="closeMenu">
          <X :size="28" />
        </button>
      </div>

      <nav class="flex flex-col space-y-6">
        <template v-for="link in navLinks" :key="link.text">
          <RouterLink
            v-if="link.type === 'link'"
            :to="link.to"
            @click="closeMenu"
            class="flex items-center space-x-3 text-lg hover:text-secondary transition-colors"
          >
            <component :is="link.icon" :size="22" />
            <span>{{ link.text }}</span>
          </RouterLink>
          <button
            v-else
            @click="link.action"
            class="flex items-center space-x-3 text-lg hover:text-secondary transition-colors"
          >
            <component :is="link.icon" :size="22" />
            <span>{{ link.text }}</span>
          </button>
        </template>
      </nav>
    </div>
  </Transition>
</template>
