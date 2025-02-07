<template>
  <div class="restaurants-list">
    <h1>Restaurantes pet-friendly</h1>
    <p class="subtitle">Explora restaurantes diseñados para disfrutar con tu mascota.</p>
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
    
    <div v-if="finalRestaurants.length">
      <ul class="results-list">
        <li v-for="restaurant in finalRestaurants" :key="restaurant.id" class="search-result-item">
           <div class="title-container">
            <h2>{{ restaurant.name }}</h2>
            <FavoriteButton :place="restaurant" />
          </div>
          <router-link :to="'/restaurant/' + restaurant.id" class="result-link">
            <img :src="restaurant.image" :alt="restaurant.name" class="restaurant-image" />
            <p class="restaurant-description">{{ restaurant.description }}</p>
            <p class="restaurant-info"><strong>Dirección:</strong> {{ restaurant.address }}</p>
            <p class="restaurant-info"><strong>Política Pet-Friendly:</strong> {{ restaurant.petPolicy }}</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="no-results">No se encontraron resultados para esta búsqueda.</p>
    </div>
    
    <!-- Mapa con los restaurantes -->
    <div id="map" class="map-container"></div>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'RestaurantsList',
  components: {
    SearchBar,
    FavoriteButton
  },
  data() {
    return {
      restaurants: [
        {
          id: 11,
          name: 'La Huella Canina',
          description: 'Un café acogedor con un menú especial para perros.',
          address: 'Calle Gran Vía, 23, Madrid, España',
          petPolicy: 'Permitidos perros en la terraza.',
          coordinates: { lat: 40.41956, lng: -3.70349 },
          image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg'
        },
        {
          id: 22,
          name: 'El Rincón Peludo',
          description: 'Restaurante clásico que da la bienvenida a mascotas de todos los tamaños.',
          address: 'Passeig de Gràcia, 45, Barcelona, España',
          petPolicy: 'Todas las mascotas permitidas con correa.',
          coordinates: { lat: 41.39183, lng: 2.16528 },
          image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg'
        },
         {
          id: 33,
          name: 'Mascota Café',
          description: 'Un lugar donde puedes disfrutar de un café junto a tu mascota.',
          address: 'Avenida de la Constitución, 5, Sevilla, España',
          petPolicy: 'Mascotas permitidas solo en la zona exterior.',
          coordinates: { lat: 37.38909, lng: -5.98446 },
          image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg'
        },
        {
          id: 44,
          name: 'Doggy Deli',
          description: 'Restaurante gourmet con un menú especial para perros y gatos.',
          address: 'Calle Larios, 12, Málaga, España',
          petPolicy: 'Se permiten mascotas dentro y fuera.',
          coordinates: { lat: 36.72127, lng: -4.42140 },
          image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg'
        },
        {
          id: 55,
          name: 'Amigos Peludos',
          description: 'Cafetería con snacks para humanos y mascotas.',
          address: 'Plaza Mayor, 1, Salamanca, España',
          petPolicy: 'Perros permitidos con correa en todas las áreas.',
          coordinates: { lat: 40.96445, lng: -5.66354 },
          image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg'
        }
      ],
      query: '',
      selectedPolicy: '',
      selectedProvince: '',
      petPolicies: ['Permitidos perros en la terraza.', 'Todas las mascotas permitidas con correa.', 'Mascotas permitidas solo en la zona exterior.', 'Se permiten mascotas dentro y fuera.', 'Perros permitidos con correa en todas las áreas.'],
      map: null,
      provinces: ['Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Gerona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga', 'Melilla', 'Murcia', 'Navarra', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'],
      categories: [
        { name: 'Restaurantes', image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg', route: '/restaurantes' },
        { name: 'Playas', image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg', route: '/playas' },
        { name: 'Establecimientos', image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg', route: '/establecimientos' },
        { name: 'Veterinarios', image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg', route: '/veterinarios' }
      ]
    };
  },
  computed: {
    finalRestaurants() {
      return this.restaurants.filter((restaurant) => {
        const matchesQuery = this.query === '' ||
          restaurant.name.toLowerCase().includes(this.query.toLowerCase()) ||
          restaurant.description.toLowerCase().includes(this.query.toLowerCase());
        const matchesPolicy = !this.selectedPolicy || restaurant.petPolicy === this.selectedPolicy;
        const matchesProvince = !this.selectedProvince || restaurant.address.includes(this.selectedProvince);
        return matchesQuery && matchesPolicy && matchesProvince;
      });
    }
  },
  watch: {
    finalRestaurants: {
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
      
      this.finalRestaurants.forEach((restaurant) => {
        if (restaurant.coordinates) {
          L.marker([restaurant.coordinates.lat, restaurant.coordinates.lng], {
            icon: L.icon({
              iconUrl: 'https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1f43e.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })
          }).addTo(this.map)
            .bindPopup(`<b>${restaurant.name}</b><br>${restaurant.address}`);
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

.restaurants-list {
  max-width: 1200px;
  margin: 0 auto;

  padding: 20px;
  text-align: center;
}

.restaurants-list h1 {
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


.restaurant-image {
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

.restaurant-description {
  font-size: 1rem;
  color: #444;
  margin-bottom: 8px;
}

.restaurant-info {
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
