<template>
  <div class="home">
    <h1>Encuentra los mejores lugares pet-friendly</h1>
    <p class="subtitle">Explora los espacios diseñados para disfrutar con tu mascota.</p>
    <SearchBar @searchQuery="handleSearch" />
    
    <!-- Categorías -->
    <section class="categories">
      <div v-for="category in categories" :key="category.name" class="category" @click="redirectToCategory(category.route)">
        <img :src="category.image" :alt="category.name" class="category-image" />
        <p>{{ category.name }}</p>
      </div>
    </section>
    
    <div v-if="finalRestaurants.length">
      <h2>Lugares sugeridos</h2>
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

    <div class="buttons-container">
      <button @click="redirectToCategory('/restaurantes')" class="category-btn">Ver Restaurantes</button>
      <button @click="redirectToCategory('/hoteles')" class="category-btn">Ver Hoteles</button>
      <button @click="redirectToCategory('/playas')" class="category-btn">Ver Playas</button>
      <button @click="redirectToCategory('/comercios')" class="category-btn">Ver Comercios</button>
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
  name: 'TheHome',
  components: {
    SearchBar,
    FavoriteButton
  },
  data() {
    return {
      restaurants: [
        {
          id: 111,
          name: 'La Huella Canina',
          description: 'Un café acogedor con un menú especial para perros.',
          address: 'Calle Gran Vía, 23, Madrid, España',
          petPolicy: 'Permitidos perros en la terraza.',
          coordinates: { lat: 40.41956, lng: -3.70349 },
          image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg'
        },
        {
          id: 1,
          name: 'Playa de la Malagueta',
          description: 'Playa urbana en Málaga donde los perros son bienvenidos.',
          address: 'Málaga, España',
          petPolicy: 'Permitidos perros en la zona habilitada.',
          coordinates: { lat: 36.7213, lng: -4.4204 },
          image: 'https://fotos.hoteles.net/articulos/playa-barceloneta-barcelona-3153-1.jpg',        },
         {
          id: 333,
          name: 'Mascota Café',
          description: 'Un lugar donde puedes disfrutar de un café junto a tu mascota.',
          address: 'Avenida de la Constitución, 5, Sevilla, España',
          petPolicy: 'Mascotas permitidas solo en la zona exterior.',
          coordinates: { lat: 37.38909, lng: -5.98446 },
          image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg'
        },
        {
          id: 1111,
          name: 'Tienda Mascotas Felices',
          description: 'Tienda especializada en productos para mascotas.',
          address: 'Calle Falsa, 123, Madrid, España',
          petPolicy: 'Permitidos perros con correa.',
          coordinates: { lat: 40.4168, lng: -3.7038 },
          image: 'https://tribekaretail.com/wp-content/uploads/2020/07/como-disenar-el-escaparate-y-la-fachada-de-tu-tienda-de-moda-parfois-completa.jpg'
        },
        {
          id: 2222,
          name: 'El Rincón Animal',
          description: 'Tienda con una gran variedad de productos para mascotas.',
          address: 'Avenida del Mar, 45, Barcelona, España',
          petPolicy: 'Permitidos animales pequeños.',
          coordinates: { lat: 41.3918, lng: 2.1649 },
          image: 'https://tribekaretail.com/wp-content/uploads/2020/07/como-disenar-el-escaparate-y-la-fachada-de-tu-tienda-de-moda-parfois-completa.jpg'
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
      ],
      query: '',
      selectedPolicy: '',
      selectedProvince: '',
      petPolicies: ['Permitidos perros en la terraza.', 'Todas las mascotas permitidas con correa.', 'Mascotas permitidas solo en la zona exterior.', 'Se permiten mascotas dentro y fuera.', 'Perros permitidos con correa en todas las áreas.'],
      map: null,
      provinces: ['Álava', 'Albacete', 'Alicante', 'Almería', 'Asturias', 'Ávila', 'Badajoz', 'Barcelona', 'Burgos', 'Cáceres', 'Cádiz', 'Cantabria', 'Castellón', 'Ceuta', 'Ciudad Real', 'Córdoba', 'Cuenca', 'Gerona', 'Granada', 'Guadalajara', 'Guipúzcoa', 'Huelva', 'Huesca', 'Islas Baleares', 'Jaén', 'La Coruña', 'La Rioja', 'Las Palmas', 'León', 'Lérida', 'Lugo', 'Madrid', 'Málaga', 'Melilla', 'Murcia', 'Navarra', 'Orense', 'Palencia', 'Pontevedra', 'Salamanca', 'Santa Cruz de Tenerife', 'Segovia', 'Sevilla', 'Soria', 'Tarragona', 'Teruel', 'Toledo', 'Valencia', 'Valladolid', 'Vizcaya', 'Zamora', 'Zaragoza'],
      categories: [
        { name: 'Restaurantes', image: 'https://res.cloudinary.com/tf-lab/image/upload/restaurant/57dbdada-c307-4e9d-b0fa-0a822fd36a02/c4809b05-8fc3-4ce2-9bcd-da97ed90488d.jpg', route: '/restaurantes' },
        { name: 'Hoteles', image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg', route: '/hoteles' },
        { name: 'Playas', image: 'https://fotos.hoteles.net/articulos/playa-barceloneta-barcelona-3153-1.jpg', route: '/playas' },
        { name: 'Comercios', image: 'https://tribekaretail.com/wp-content/uploads/2020/07/como-disenar-el-escaparate-y-la-fachada-de-tu-tienda-de-moda-parfois-completa.jpg', route: '/comercios' },
        { name: 'Veterinarios', image: 'https://medios.clinicaveterinariamadrid.es/2_Plaza-de-Castilla-1.jpg', route: '/clinicas' },
        { name: 'Eventos', image: 'https://www.grupobillingham.com/blog/wp-content/uploads/2020/11/calendario-de-mesa-750x410.jpg', route: '/eventos' }
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
.categories {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.category {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #666;
  font-size: 1.2rem;
  transition: transform 0.3s ease, color 0.3s ease;
}

.category:hover {
  color: #0056b3;
  transform: scale(1.1);
}

.category-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 8px;
}

.buttons-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.buttons-container button {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.buttons-container button:hover {
  background-color: #0056b3;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.home {
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
}

.home h1 {
  font-size: 2.5rem;
  color: #007bff;
  margin-bottom: 10px;
}

.home h2 {
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
