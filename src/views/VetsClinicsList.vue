<template>
  <div class="vet-clinics-list">
    <h1>Clínicas Veterinarias Pet-Friendly</h1>
    <p class="subtitle">Explora clínicas donde puedes llevar a tu mascota.</p>
    <SearchBar @searchQuery="handleSearch" />
    
    <!-- Filtros -->
    <section class="filters">
      <!-- Filtro por política pet-friendly -->
      <div class="filter-container">
        <label for="petPolicy">Filtrar por:</label>
        <select v-model="selectedPolicy" @change="handlePolicyFilter">
          <option value="">Todas las políticas</option>
          <option v-for="policy in petPolicies" :key="policy" :value="policy">{{ policy }}</option>
        </select>
      </div>
    </section>
    
    <div v-if="finalVetClinics.length">
      <ul class="results-list">
        <li v-for="clinic in finalVetClinics" :key="clinic.id" class="search-result-item">
          <div class="title-container">
            <h2>{{ clinic.name }}</h2>
            <FavoriteButton :place="clinic" />
          </div>
          <router-link :to="'/clinic/' + clinic.id" class="result-link">
            <img :src="clinic.image" :alt="clinic.name" class="clinic-image" />
            <p class="clinic-description">{{ clinic.description }}</p>
            <p class="clinic-info"><strong>Dirección:</strong> {{ clinic.address }}</p>
            <p class="clinic-info"><strong>Política Pet-Friendly:</strong> {{ clinic.petPolicy }}</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="no-results">No se encontraron resultados para esta búsqueda.</p>
    </div>
    
    <!-- Mapa con las clínicas -->
    <div id="map" class="map-container"></div>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'VetClinicsList',
  components: {
    SearchBar,
    FavoriteButton
  },
  data() {
    return {
      vetClinics: [
        {
          id: 11111,
          name: 'Clínica Veterinaria San Pedro',
          description: 'Clínica especializada en cuidado de mascotas pequeñas.',
          address: 'Calle Mayor, 123, Madrid, España',
          petPolicy: 'Permitidos perros en la sala de espera.',
          coordinates: { lat: 40.4168, lng: -3.7038 },
          image: 'https://medios.clinicaveterinariamadrid.es/2_Plaza-de-Castilla-1.jpg'
        },
        {
          id: 22222,
          name: 'Clínica Veterinaria Animalia',
          description: 'Servicio completo para el cuidado de tu mascota.',
          address: 'Avenida del Mar, 45, Barcelona, España',
          petPolicy: 'Permitidos gatos y perros.',
          coordinates: { lat: 41.3918, lng: 2.1649 },
          image: 'https://medios.clinicaveterinariamadrid.es/2_Plaza-de-Castilla-1.jpg'
        }
      ],
      query: '',
      selectedPolicy: '',
      petPolicies: ['Permitidos perros en la sala de espera.', 'Permitidos gatos y perros.'],
      map: null
    };
  },
  computed: {
    finalVetClinics() {
      return this.vetClinics.filter((clinic) => {
        const matchesQuery = this.query === '' ||
          clinic.name.toLowerCase().includes(this.query.toLowerCase()) ||
          clinic.description.toLowerCase().includes(this.query.toLowerCase());
        const matchesPolicy = !this.selectedPolicy || clinic.petPolicy === this.selectedPolicy;
        return matchesQuery && matchesPolicy;
      });
    }
  },
  watch: {
    finalVetClinics: {
      handler() {
        this.updateMap();
      },
      deep: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(this.initMap, 500);
    });
  },
  methods: {
    handleSearch(query) {
      this.query = query; 
    },
    handlePolicyFilter() {
      this.updateMap();
    },
    initMap() {
      if (this.map) {
        this.map.remove();
      }
      const mapElement = document.getElementById("map");
      if (!mapElement) return;

      this.map = L.map(mapElement, {
        center: [40.416775, -3.703790],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
      }).addTo(this.map);

      this.updateMap();
    },
    updateMap() {
      if (!this.map) return;

      this.finalVetClinics.forEach((clinic) => {
        if (clinic.coordinates) {
          L.marker([clinic.coordinates.lat, clinic.coordinates.lng], {
            icon: L.icon({
              iconUrl: 'https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1f43e.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          })
            .addTo(this.map)
            .bindPopup(`<b>${clinic.name}</b><br>${clinic.address}`);
        }
      });
      this.map.invalidateSize();
    }
  }
};
</script>

<style scoped>
.filters {
  display: flex;
  align-items: flex-end;
  gap: 15px;
  margin-top: 20px;
}

.filter-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: center;
}

.filter-container label {
  font-size: 1rem;
  margin-right: 10px;
}

.filter-container select {
  padding: 8px;
  font-size: .9rem;
  border-radius: 5px;
}

.vet-clinics-list {
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
}

.vet-clinics-list h1 {
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 20px;
}

.search-info {
  font-size: 1rem;
  color: #555;
  margin-bottom: 15px;
}

.results-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 columnas por defecto */
  gap: 20px;
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.search-result-item {
  position: relative;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  transition: box-shadow 0.3s;
  max-width: 400px;
  margin: 0 auto;
}

.search-result-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.result-link {
  display: block;
  text-decoration: none;
  color: #333;
}

/* Responsividad para pantallas más pequeñas */
@media (max-width: 1024px) {
  .results-list {
    grid-template-columns: repeat(2, 1fr); /* 2 columnas en pantallas medianas */
  }
}

@media (max-width: 768px) {
  .results-list {
    grid-template-columns: 1fr; /* 1 columna en pantallas pequeñas */
  }
}


.clinic-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-bottom: 10px;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.search-result-item h2 {
  font-size: 1.3rem;
  margin-bottom: 8px;
  color: #007bff;
  transition: color 0.3s;
}

.search-result-item:hover h2 {
  color: #0056b3;
}

.clinic-description {
  font-size: 1rem;
  color: #444;
  margin-bottom: 8px;
}

.clinic-info {
  font-size: 0.95rem;
  color: #666;
}

.no-results {
  font-size: 1.1rem;
  color: #777;
  margin-top: 20px;
}

.map-container {
  width: 100%;
  height: 400px;
  margin-top: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}
</style>
