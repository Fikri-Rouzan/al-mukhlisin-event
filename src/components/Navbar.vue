<script setup>
import { RouterLink } from "vue-router";
import { useAuth } from "../composables/useAuth";

const { user } = useAuth();
</script>

<template>
  <header class="bg-primary text-white shadow-lg">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
      <RouterLink
        to="/"
        class="text-xl font-bold hover:text-secondary transition-colors"
      >
        al-Mukhlisin
      </RouterLink>
      <div class="flex items-center space-x-6">
        <RouterLink to="/" class="hover:text-secondary transition-colors"
          >Home</RouterLink
        >
        <RouterLink to="/events" class="hover:text-secondary transition-colors"
          >Kegiatan</RouterLink
        >
        <RouterLink
          v-if="user"
          to="/profile"
          class="hover:text-secondary transition-colors"
          >Profile</RouterLink
        >

        <RouterLink
          v-if="!user"
          to="/login"
          class="bg-white text-primary font-semibold px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
        >
          Login
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
