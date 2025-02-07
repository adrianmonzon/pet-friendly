<template>
  <div class="beaches-list">
    <h1>Playas Pet-Friendly</h1>
    <p class="subtitle">Explora las playas de España donde puedes disfrutar con tu mascota.</p>
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
    
    <div v-if="finalBeaches.length">
      <ul class="results-list">
        <li v-for="beach in finalBeaches" :key="beach.id" class="search-result-item">
           <div class="title-container">
            <h2>{{ beach.name }}</h2>
            <FavoriteButton :place="beach" />
          </div>
          <router-link :to="'/beach/' + beach.id" class="result-link">
            <img :src="beach.image" :alt="beach.name" class="beach-image" />
            <p class="beach-description">{{ beach.description }}</p>
            <p class="beach-info"><strong>Dirección:</strong> {{ beach.address }}</p>
            <p class="beach-info"><strong>Política Pet-Friendly:</strong> {{ beach.petPolicy }}</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="no-results">No se encontraron resultados para esta búsqueda.</p>
    </div>
    
    <!-- Mapa con las playas -->
    <div id="map" class="map-container"></div>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'BeachesList',
  components: {
    SearchBar,
    FavoriteButton
  },
  data() {
    return {
      beaches: [
        {
          id: 1,
          name: 'Playa de la Malagueta',
          description: 'Playa urbana en Málaga donde los perros son bienvenidos.',
          address: 'Málaga, España',
          petPolicy: 'Permitidos perros en la zona habilitada.',
          coordinates: { lat: 36.7213, lng: -4.4204 },
          image: 'https://fotos.hoteles.net/articulos/playa-barceloneta-barcelona-3153-1.jpg',
        },
        {
          id: 2,
          name: 'Playa de la Barceloneta',
          description: 'Una de las playas más famosas de Barcelona que permite perros.',
          address: 'Barcelona, España',
          petPolicy: 'Permitidos perros con correa en algunas zonas.',
          coordinates: { lat: 41.3784, lng: 2.1917 },
          image: 'https://fotos.hoteles.net/articulos/playa-barceloneta-barcelona-3153-1.jpg',
        },
        {
          id: 3,
          name: 'Playa de Punta Umbría',
          description: 'Playa natural en Huelva con acceso para perros.',
          address: 'Huelva, España',
          petPolicy: 'Zona habilitada para perros.',
          coordinates: { lat: 37.1947, lng: -7.0702 },
          image: 'https://fotos.hoteles.net/articulos/playa-barceloneta-barcelona-3153-1.jpg',
        },
        {
          id: 4,
          name: 'Playa de Gorrondatxe',
          description: 'Playa en Bizkaia donde se permiten perros en la parte habilitada.',
          address: 'Bizkaia, España',
          petPolicy: 'Perros permitidos en algunas zonas.',
          coordinates: { lat: 43.4190, lng: -3.0163 },
          image: 'https://fotos.hoteles.net/articulos/playa-barceloneta-barcelona-3153-1.jpg',
        },
        {
          id: 5,
          name: 'Playa de la Barrosa',
          description: 'Playa en Chiclana de la Frontera donde se permite el acceso de perros.',
          address: 'Chiclana, Cádiz, España',
          petPolicy: 'Permitidos perros en la zona especial.',
          coordinates: { lat: 36.3413, lng: -6.1502 },
          image: 'https://fotos.hoteles.net/articulos/playa-barceloneta-barcelona-3153-1.jpg',
        }
      ],
      query: '',
      selectedPolicy: '',
      selectedProvince: '',
      petPolicies: ['Permitidos perros en la zona habilitada.', 'Permitidos perros con correa.', 'Zona habilitada para perros.', 'Perros permitidos en algunas zonas.'],
      map: null,
      provinces: ['Málaga', 'Barcelona', 'Huelva', 'Bizkaia', 'Cádiz']
    };
  },
  computed: {
    finalBeaches() {
      return this.beaches.filter((beach) => {
        const matchesQuery = this.query === '' ||
          beach.name.toLowerCase().includes(this.query.toLowerCase()) ||
          beach.description.toLowerCase().includes(this.query.toLowerCase());
        const matchesPolicy = !this.selectedPolicy || beach.petPolicy === this.selectedPolicy;
        const matchesProvince = !this.selectedProvince || beach.address.includes(this.selectedProvince);
        return matchesQuery && matchesPolicy && matchesProvince;
      });
    }
  },
  watch: {
    finalBeaches: {
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
    handleSearch(query) {
      this.query = query; 
    },
    handleProvinceFilter() {
      this.updateMap();
    },
    handlePolicyFilter() {
      this.updateMap();
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

      this.finalBeaches.forEach((beach) => {
        if (beach.coordinates) {
          L.marker([beach.coordinates.lat, beach.coordinates.lng], {
            icon: L.icon({
              iconUrl: 'https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1f43e.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })
          }).addTo(this.map)
            .bindPopup(`<b>${beach.name}</b><br>${beach.address}`);
        }
      });
      this.map.invalidateSize();
    },
  },
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

.beaches-list {
  max-width: 1200px;
  margin: 0 auto;

  padding: 20px;
  text-align: center;
}

.beaches-list h1 {
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


.beach-image {
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

.beach-description {
  font-size: 1rem;
  color: #444;
  margin-bottom: 8px;
}

.beach-info {
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
