<script setup>
import { RouterLink } from "vue-router";
import { useAuth } from "../composables/useAuth";

const { user } = useAuth();
const currentYear = new Date().getFullYear();

const addressText =
  "Masjid Jami Al Mukhlisin, Jl. Talas III No.54, RT.1/RW.2, Pd. Cabe Ilir, Kec. Pamulang, Kota Tangerang Selatan, Banten 15418";

const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  addressText
)}`;
</script>

<template>
  <footer class="text-gray-800 pt-12 pb-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="md:col-span-1">
          <h3 class="text-xl font-bold text-gray-800 mb-4">Al-Mukhlisin</h3>
          <p class="text-base">
            Website informasi kegiatan Masjid Al-Mukhlisin
          </p>
        </div>

        <div class="text-base">
          <h4 class="font-semibold text-gray-800 mb-4 text-xl">Menu</h4>
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
            <li v-if="user">
              <RouterLink
                to="/profile"
                class="hover:text-secondary transition-colors"
                >Profil</RouterLink
              >
            </li>
            <li v-else>
              <RouterLink
                to="/login"
                class="hover:text-secondary transition-colors"
                >Login</RouterLink
              >
            </li>
          </ul>
        </div>

        <div class="text-base">
          <h4 class="font-semibold text-gray-800 mb-4 text-xl">Alamat</h4>
          <ul>
            <li>
              <a
                :href="googleMapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:text-secondary transition-colors"
              >
                {{ addressText }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-12 pt-6 text-center text-base">
        <p>&copy; {{ currentYear }} Al-Mukhlisin. All Rights Reserved</p>
      </div>
    </div>
  </footer>
</template>
