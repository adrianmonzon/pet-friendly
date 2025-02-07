<template>
  <div class="hotels-list">
    <h1>Hoteles Pet-Friendly</h1>
    <p class="subtitle">Explora los hoteles de España donde puedes disfrutar con tu mascota.</p>
    <SearchBar @searchQuery="handleSearch" />
    
    <!-- Filtros -->
    <section class="filters">
      <!-- Filtro por provincia -->
      <div class="filter-container">
        <label for="province">Filtrar por:</label>
        <select v-model="selectedProvince" @change="handleProvinceFilter">
          <option value="">Todas las provincias</option>
          <option v-for="province in provinces" :key="province" :value="province">{{ province }}</option>
        </select>
      </div>
      
      <!-- Filtro por política pet-friendly -->
      <div class="filter-container">
        <select v-model="selectedPolicy" @change="handlePolicyFilter">
          <option value="">Todas las políticas</option>
          <option v-for="policy in petPolicies" :key="policy" :value="policy">{{ policy }}</option>
        </select>
      </div>
    </section>
    
    <div v-if="finalHotels.length">
      <ul class="results-list">
        <li v-for="hotel in finalHotels" :key="hotel.id" class="search-result-item">
          <div class="title-container">
            <h2>{{ hotel.name }}</h2>
            <FavoriteButton :place="hotel" />
          </div>
          <router-link :to="'/hotel/' + hotel.id" class="result-link">
            <img :src="hotel.image" :alt="hotel.name" class="hotel-image" />
            <p class="hotel-description">{{ hotel.description }}</p>
            <p class="hotel-info"><strong>Dirección:</strong> {{ hotel.address }}</p>
            <p class="hotel-info"><strong>Política Pet-Friendly:</strong> {{ hotel.petPolicy }}</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="no-results">No se encontraron resultados para esta búsqueda.</p>
    </div>
    
    <!-- Mapa con los hoteles -->
    <div id="map" class="map-container"></div>
    
    <!-- Botones de ver más -->
    <div class="view-more-buttons">
      <button @click="redirectToCategory('/hoteles')">Ver Hoteles</button>
      <button @click="redirectToCategory('/playas')">Ver Playas</button>
      <button @click="redirectToCategory('/tiendas')">Ver Tiendas</button>
    </div>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'HotelsList',
  components: {
    SearchBar,
    FavoriteButton
  },
  data() {
    return {
      hotels: [
        {
          id: 111111,
          name: 'Hotel Pet-Friendly Madrid',
          description: 'Hotel moderno que acepta mascotas de cualquier tamaño.',
          address: 'Calle Falsa, 123, Madrid, España',
          petPolicy: 'Permitidos perros y gatos.',
          coordinates: { lat: 40.4168, lng: -3.7038 },
          image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg',
        },
        {
          id: 222222,
          name: 'Hotel Mascotas Barcelona',
          description: 'Un hotel boutique en el centro de Barcelona, ideal para tus mascotas.',
          address: 'Passeig de Gràcia, 45, Barcelona, España',
          petPolicy: 'Mascotas permitidas solo en algunas áreas.',
          coordinates: { lat: 41.3918, lng: 2.1649 },
          image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg',
        },
        {
          id: 333333,
          name: 'Hotel Animal Loco',
          description: 'Hotel de lujo con zonas especiales para tus mascotas.',
          address: 'Calle Real, 45, Valencia, España',
          petPolicy: 'Permitidos perros y animales pequeños.',
          coordinates: { lat: 39.4699, lng: -0.3763 },
          image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg',
        },
        {
          id: 444444,
          name: 'Hotel Peludo Tenerife',
          description: 'Hotel en Tenerife donde las mascotas son siempre bienvenidas.',
          address: 'Avenida de la Playa, 12, Tenerife, España',
          petPolicy: 'Perros permitidos en todo el hotel.',
          coordinates: { lat: 28.2916, lng: -16.6291 },
          image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg',
        },
        {
          id: 555555,
          name: 'Hotel Canino Sevilla',
          description: 'Un refugio para perros y sus dueños en el corazón de Sevilla.',
          address: 'Calle del Sol, 78, Sevilla, España',
          petPolicy: 'Permite perros y gatos en todas las habitaciones.',
          coordinates: { lat: 37.38909, lng: -5.98446 },
          image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg',
        }
      ],
      query: '',
      selectedPolicy: '',
      selectedProvince: '',
      petPolicies: ['Permitidos perros y gatos.', 'Mascotas permitidas solo en algunas áreas.', 'Perros permitidos en todo el hotel.'],
      map: null,
      provinces: ['Madrid', 'Barcelona', 'Valencia', 'Tenerife', 'Sevilla']
    };
  },
  computed: {
    finalHotels() {
      return this.hotels.filter((hotel) => {
        const matchesQuery = this.query === '' ||
          hotel.name.toLowerCase().includes(this.query.toLowerCase()) ||
          hotel.description.toLowerCase().includes(this.query.toLowerCase());
        const matchesPolicy = !this.selectedPolicy || hotel.petPolicy === this.selectedPolicy;
        const matchesProvince = !this.selectedProvince || hotel.address.includes(this.selectedProvince);
        return matchesQuery && matchesPolicy && matchesProvince;
      });
    }
  },
  watch: {
    finalHotels: {
      handler() {
        this.updateMap();
      },
      deep: true,
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(this.initMap, 500);
    });
  },
  methods: {
    redirectToCategory(route) {
      this.$router.push(route);
    },
    handleProvinceFilter() {
      this.updateMap();
    },
    handlePolicyFilter() {
      this.updateMap();
    },
    handleSearch(query) {
      this.query = query;
    },
    initMap() {
      if (this.map) {
        this.map.remove();
      }
      const mapElement = document.getElementById('map');
      if (!mapElement) return;

      this.map = L.map(mapElement, {
        center: [40.416775, -3.703790],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(this.map);

      this.updateMap();
    },
    updateMap() {
      if (!this.map) return;

      this.finalHotels.forEach((hotel) => {
        if (hotel.coordinates) {
          L.marker([hotel.coordinates.lat, hotel.coordinates.lng], {
            icon: L.icon({
              iconUrl: 'https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1f43e.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })
          }).addTo(this.map)
            .bindPopup(`<b>${hotel.name}</b><br>${hotel.address}`);
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

.hotels-list {
  max-width: 1200px;
  margin: 0 auto;

  padding: 20px;
  text-align: center;
}

.hotels-list h1 {
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 10px;
}

.hotels-list h2 {
  font-size: 2rem;
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


.hotel-image {
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

.hotel-description {
  font-size: 1rem;
  color: #444;
  margin-bottom: 8px;
}

.hotel-info {
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

.view-more-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.view-more-buttons button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.view-more-buttons button:hover {
  background-color: #0056b3;
}
</style>
