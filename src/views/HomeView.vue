<script setup>
import { onMounted, ref } from "vue";
import L from "leaflet";
import markerIcon from "../assets/marker/marker-icon-2x.png";
import markerIcon2x from "../assets/marker/marker-icon.png";
import markerShadow from "../assets/marker/marker-shadow.png";
import photo from "../assets/marker/photo.png";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import { images } from "../assets/assets.js";
import { motion } from "motion-v";

const coordinates = [-6.334059734631284, 106.7607639436645];
const name = "Masjid Al Mukhlisin";
const address =
  "Masjid Jami Al Mukhlisin, Jl. Talas III No.54, RT.1/RW.2, Pd. Cabe Ilir, Kec. Pamulang, Kota Tangerang Selatan, Banten 15418";

const googleMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(
  address
)}`;

const mapContainer = ref(null);

onMounted(() => {
  if (mapContainer.value) {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "© OpenStreetMap contributors",
      }
    );

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "© OpenStreetMap contributors",
      }
    );

    const darkLayer = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "© OpenStreetMap contributors",
      }
    );

    const baseLayers = {
      Standar: osmLayer,
      Satelit: satelliteLayer,
      "Mode Gelap": darkLayer,
    };

    const map = L.map(mapContainer.value, {
      layers: [osmLayer],
    }).setView(coordinates, 17);

    L.control.layers(baseLayers, null).addTo(map);

    const popupContent = `
      <div class="flex flex-col items-center max-w-40">
        <h3 class="text-base font-semibold text-gray-500 mb-3">
          ${name}
        </h3>
        <img
          src="${photo}"
          alt="Foto ${name}"
          class="w-28 h-28 rounded-md shadow-md mb-3"
        />
        <a
          href="${googleMapsUrl}"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs hover:underline"
        >
          ${address}
        </a>
      </div>
    `;

    L.marker(coordinates).addTo(map).bindPopup(popupContent);
  }
});

const settings = {
  itemsToShow: 1,
  snapAlign: "center",
  autoplay: 7000,
  wrapAround: true,
  transition: 800,
};

const breakpoints = {
  1024: {
    itemsToShow: 2,
    snapAlign: "center",
    autoplay: 7000,
    wrapAround: true,
    transition: 800,
    gap: 6,
  },
};
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
      diselenggarakan di Masjid Al Mukhlisin
    </motion.p>

    <motion.div
      class="rounded-lg overflow-hidden shadow-2xl"
      :initial="{ opacity: 0 }"
      :whileInView="{ opacity: 1 }"
      :transition="{ duration: 0.6, delay: 0.9 }"
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
      :transition="{ delay: 1.1, duration: 0.9 }"
    >
      Kunjungi Masjid Al Mukhlisin
    </motion.h1>
    <motion.p
      class="text-xl text-gray-800 mb-12 text-center"
      :initial="{ y: -20, opacity: 0 }"
      :whileInView="{ y: 0, opacity: 1 }"
      :transition="{ delay: 1.3, duration: 0.9 }"
    >
      Gunakan peta interaktif dibawah ini untuk mengetahui lokasi Masjid Al
      Mukhlisin
    </motion.p>

    <motion.div
      :initial="{ opacity: 0 }"
      :whileInView="{ opacity: 1 }"
      :transition="{ duration: 1, delay: 1.7 }"
      class="w-full rounded-lg shadow-2xl overflow-hidden border-2 border-gray-200"
    >
      <div ref="mapContainer" class="w-full h-80 md:h-96"></div>
    </motion.div>
  </motion.div>
</template>
