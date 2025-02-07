<template>
  <div class="map-container">
    <h2>Encuentra lugares pet-friendly</h2>
    <FilterOptions @filter="applyFilters" />
    <div id="map"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import FilterOptions from '@/components/FilterOptions.vue';

export default {
  name: 'InteractiveMap',
  components: { FilterOptions },
  data() {
    return {
      map: null,
      businesses: [],
      filteredBusinesses: [],
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      this.map = L.map('map').setView([40.4168, -3.7038], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    },
    applyFilters(filters) {
      // Filtrar negocios según las opciones seleccionadas
      this.filteredBusinesses = this.businesses.filter(b =>
        (!filters.category || b.category === filters.category) &&
        (!filters.rating || b.rating >= filters.rating)
      );
    },
  },
};
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
}
#map {
  width: 100%;
  height: 100%;
}
</style>
