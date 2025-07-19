<script setup>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-100">
    <header>
      <Navbar />
    </header>

    <main class="container mx-auto flex-grow p-4 pt-24">
      <RouterView />
    </main>

    <footer>
      <Footer />
    </footer>
  </div>
</template>
