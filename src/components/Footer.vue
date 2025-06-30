<script setup>
import { RouterLink } from "vue-router";
const currentYear = new Date().getFullYear();

const address =
  "Masjid Jami Al Mukhlisin, Jl. Talas III No.54, RT.1/RW.2, Pd. Cabe Ilir, Kec. Pamulang, Kota Tangerang Selatan, Banten 15418";

const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
  address
)}`;
</script>

<template>
  <footer class="text-gray-800 pt-12 pb-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-lg font-bold text-gray-800 mb-4">Al Mukhlisin</h3>
          <p class="text-sm">Website informasi kegiatan Masjid Al Mukhlisin</p>
        </div>

        <div class="text-sm">
          <h4 class="font-semibold text-gray-800 mb-4 text-lg">Menu</h4>
          <ul class="space-y-2">
            <li>
              <RouterLink to="/" class="hover:text-secondary transition-colors"
                >Beranda</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/events"
                class="hover:text-secondary transition-colors"
                >Kegiatan</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/profile"
                class="hover:text-secondary transition-colors"
                >Profil</RouterLink
              >
            </li>
          </ul>
        </div>

        <div class="text-sm">
          <h4 class="font-semibold text-gray-800 mb-4 text-lg">Alamat</h4>
          <ul>
            <li>
              <a
                :href="googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-secondary transition-colors"
              >
                {{ address }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-gray-300 pt-6 text-center text-sm">
        <p>© {{ currentYear }} Al Mukhlisin. All Rights Reserved</p>
      </div>
    </div>
  </footer>
</template>
