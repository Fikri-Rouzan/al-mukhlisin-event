<script setup>
import Navbar from "../components/Navbar.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />
    <main class="container mx-auto p-4 pt-24">
      <RouterView />
    </main>
  </div>
</template>
