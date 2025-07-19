import { onMounted, onUnmounted, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "../assets/marker/marker-icon.png";
import markerIcon2x from "../assets/marker/marker-icon-2x.png";
import markerShadow from "../assets/marker/marker-shadow.png";

export function useMap(options) {
  const mapContainer = ref(null);
  let mapInstance = null;

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
        { attribution: "© OpenStreetMap contributors" }
      );
      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "© OpenStreetMap contributors" }
      );
      const darkLayer = L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { attribution: "© OpenStreetMap contributors" }
      );

      const baseLayers = {
        Standar: osmLayer,
        Satelit: satelliteLayer,
        "Mode Gelap": darkLayer,
      };

      mapInstance = L.map(mapContainer.value, {
        layers: [osmLayer],
      }).setView(options.coordinates, 17);

      L.control.layers(baseLayers, null).addTo(mapInstance);

      L.marker(options.coordinates)
        .addTo(mapInstance)
        .bindPopup(options.popupContent);
    }
  });

  onUnmounted(() => {
    if (mapInstance) {
      mapInstance.remove();
      mapInstance = null;
    }
  });

  return {
    mapContainer,
  };
}
