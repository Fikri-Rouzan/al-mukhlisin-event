<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const address =
  "Masjid Jami Al Mukhlisin, Jl. Talas III No.54, RT.1/RW.2, Pd. Cabe Ilir, Kec. Pamulang, Kota Tangerang Selatan, Banten 15418";

const menuLinks = [
  { text: "Beranda", to: "/" },
  { text: "Kegiatan", to: "/events" },
  { text: "Profil", to: "/profile" },
];

const currentYear = new Date().getFullYear();

const googleMapsUrl = computed(
  () =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`
);
</script>

<template>
  <footer class="bg-white text-gray-800 pt-12 pb-8 shadow-inner">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Al Mukhlisin</h3>
          <p class="text-sm">
            Website informasi kegiatan Masjid Jami Al Mukhlisin.
          </p>
        </div>

        <div class="text-sm">
          <h4 class="text-lg font-semibold text-gray-800 mb-4">Menu</h4>
          <ul class="space-y-2">
            <li v-for="link in menuLinks" :key="link.to">
              <RouterLink
                :to="link.to"
                class="hover:text-secondary transition-colors"
              >
                {{ link.text }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="text-sm">
          <h4 class="text-lg font-semibold text-gray-800 mb-4">Alamat</h4>
          <a
            :href="googleMapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="hover:text-secondary transition-colors"
          >
            {{ address }}
          </a>
        </div>
      </div>

      <div class="mt-10 border-t border-gray-300 pt-6 text-center text-sm">
        <p>&copy; {{ currentYear }} Al Mukhlisin. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
</template>
