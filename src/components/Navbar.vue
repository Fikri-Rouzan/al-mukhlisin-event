<script setup>
import { ref } from "vue";
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
    text: "Anda akan keluar dari akun ini",
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
        <RouterLink
          to="/"
          class="nav-item flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          <Home :size="18" />
          <span>Beranda</span>
        </RouterLink>
        <RouterLink
          to="/events"
          class="nav-item flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          <Calendar :size="18" />
          <span>Kegiatan</span>
        </RouterLink>
        <RouterLink
          to="/profile"
          class="nav-item flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          <User :size="18" />
          <span>Profil</span>
        </RouterLink>
        <RouterLink
          v-if="!user"
          to="/login"
          class="nav-item flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors"
        >
          <LogIn :size="18" />
          <span>Login</span>
        </RouterLink>
        <button
          v-else
          @click="handleLogout"
          class="nav-item flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-secondary transition-colors cursor-pointer"
        >
          <LogOut :size="18" /> <span>Logout</span>
        </button>
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
        <RouterLink
          to="/"
          @click="closeMenu"
          class="flex items-center space-x-3 text-lg hover:text-secondary transition-colors"
        >
          <Home :size="22" />
          <span>Beranda</span>
        </RouterLink>
        <RouterLink
          to="/events"
          @click="closeMenu"
          class="flex items-center space-x-3 text-lg hover:text-secondary transition-colors"
        >
          <Calendar :size="22" />
          <span>Kegiatan</span>
        </RouterLink>
        <RouterLink
          to="/profile"
          @click="closeMenu"
          class="flex items-center space-x-3 text-lg hover:text-secondary transition-colors"
        >
          <User :size="22" />
          <span>Profil</span>
        </RouterLink>
        <RouterLink
          v-if="!user"
          to="/login"
          @click="closeMenu"
          class="flex items-center space-x-3 text-lg hover:text-secondary transition-colors"
        >
          <LogIn :size="22" />
          <span>Login</span>
        </RouterLink>
        <button
          v-else
          @click="handleLogout"
          class="flex items-center space-x-3 text-lg hover:text-secondary transition-colors"
        >
          <LogOut :size="22" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  </Transition>
</template>
