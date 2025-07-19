<script setup>
import { computed } from "vue";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { motion } from "motion-v";
import { useMap } from "../composables/useMap.js";
import { images } from "../assets/assets.js";
import { settings, breakpoints } from "../config/carousel.js";
import photo from "../assets/marker/photo.png";

import "vue3-carousel/carousel.css";

const locationData = {
  coordinates: [-6.334059734631284, 106.7607639436645],
  name: "Masjid Al Mukhlisin",
  address:
    "Masjid Jami Al Mukhlisin, Jl. Talas III No.54, RT.1/RW.2, Pd. Cabe Ilir, Kec. Pamulang, Kota Tangerang Selatan, Banten 15418",
};

const googleMapsUrl = computed(
  () =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      locationData.address
    )}`
);

const popupContent = computed(
  () => `
  <div class="flex flex-col items-center max-w-40">
    <h3 class="text-base font-semibold text-gray-500 mb-3">${locationData.name}</h3>
    <img src="${photo}" alt="Foto ${locationData.name}" class="w-28 h-28 rounded-md shadow-md mb-3" />
    <a href="${googleMapsUrl.value}" target="_blank" rel="noopener noreferrer" class="text-xs text-center hover:underline">
      ${locationData.address}
    </a>
  </div>
`
);

const { mapContainer } = useMap({
  coordinates: locationData.coordinates,
  popupContent: popupContent.value,
});
</script>

<template>
  <motion.div
    class="container mx-auto px-8 py-12"
    :initial="{ opacity: 0 }"
    :whileInView="{ opacity: 1 }"
    :transition="{ duration: 1 }"
  >
    <motion.h1
      class="text-4xl font-bold text-primary mb-5 text-center"
      :initial="{ y: -20, opacity: 0 }"
      :whileInView="{ y: 0, opacity: 1 }"
      :transition="{ delay: 0.3, duration: 0.5 }"
    >
      Selamat Datang di Website Al Mukhlisin 👋
    </motion.h1>
    <motion.p
      class="text-xl text-gray-800 mb-12 text-center"
      :initial="{ y: -20, opacity: 0 }"
      :whileInView="{ y: 0, opacity: 1 }"
      :transition="{ delay: 0.5, duration: 0.5 }"
    >
      Website ini menyediakan berbagai macam informasi kegiatan yang akan
      diselenggarakan di Masjid Al Mukhlisin.
    </motion.p>

    <motion.div
      class="rounded-lg overflow-hidden shadow-2xl"
      :initial="{ opacity: 0 }"
      :whileInView="{ opacity: 1 }"
      :transition="{ delay: 0.7, duration: 0.5 }"
    >
      <Carousel :settings="settings" :breakpoints="breakpoints" dir="ltr">
        <Slide v-for="(image, index) in images" :key="index">
          <div class="w-full h-full">
            <img
              :src="image"
              alt="carousel image"
              class="w-full h-full rounded-lg object-cover cursor-pointer"
            />
          </div>
        </Slide>
        <template #addons>
          <Navigation />
          <Pagination />
        </template>
      </Carousel>
    </motion.div>

    <motion.h1
      class="mt-20 text-4xl font-bold text-primary mb-5 text-center"
      :initial="{ y: -20, opacity: 0 }"
      :whileInView="{ y: 0, opacity: 1 }"
      :transition="{ delay: 0.9, duration: 0.6 }"
    >
      Kunjungi Masjid Al Mukhlisin
    </motion.h1>
    <motion.p
      class="text-xl text-gray-800 mb-12 text-center"
      :initial="{ y: -20, opacity: 0 }"
      :whileInView="{ y: 0, opacity: 1 }"
      :transition="{ delay: 1.1, duration: 0.6 }"
    >
      Gunakan peta interaktif di bawah ini untuk mengetahui lokasi Masjid Al
      Mukhlisin.
    </motion.p>

    <motion.div
      :initial="{ opacity: 0 }"
      :whileInView="{ opacity: 1 }"
      :transition="{ delay: 1.3, duration: 0.6 }"
      class="w-full rounded-lg shadow-2xl overflow-hidden border-2 border-gray-200"
    >
      <div ref="mapContainer" class="w-full h-80 md:h-96"></div>
    </motion.div>
  </motion.div>
</template>
