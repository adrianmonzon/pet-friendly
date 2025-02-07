<template>
  <div class="shops-list">
    <h1>Establecimientos Pet-Friendly</h1>
    <p class="subtitle">Explora establecimientos donde puedes ir con tu mascota.</p>
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
    
    <div v-if="finalShops.length">
      <ul class="results-list">
        <li v-for="shop in finalShops" :key="shop.id" class="search-result-item">
          <div class="title-container">
            <h2>{{ shop.name }}</h2>
            <FavoriteButton :place="shop" />
          </div>
          <router-link :to="'/shop/' + shop.id" class="result-link">
            <img :src="shop.image" :alt="shop.name" class="shop-image" />
            <p class="shop-description">{{ shop.description }}</p>
            <p class="shop-info"><strong>Dirección:</strong> {{ shop.address }}</p>
            <p class="shop-info"><strong>Política Pet-Friendly:</strong> {{ shop.petPolicy }}</p>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="no-results">No se encontraron resultados para esta búsqueda.</p>
    </div>
    
    <!-- Mapa con las establecimientos -->
    <div id="map" class="map-container"></div>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar.vue';
import FavoriteButton from '@/components/FavoriteButton.vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'ShopsList',
  components: {
    SearchBar,
    FavoriteButton
  },
  data() {
    return {
      shops: [
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
          id: 3333,
          name: 'Zoolandia',
          description: 'Todo lo que tu mascota necesita, desde comida hasta juguetes.',
          address: 'Calle del Sol, 67, Valencia, España',
          petPolicy: 'Permiten mascotas en todo el local.',
          coordinates: { lat: 39.4699, lng: -0.3763 },
          image: 'https://tribekaretail.com/wp-content/uploads/2020/07/como-disenar-el-escaparate-y-la-fachada-de-tu-tienda-de-moda-parfois-completa.jpg'
        }
      ],
      query: '',
      selectedPolicy: '',
      petPolicies: ['Permitidos perros con correa.', 'Permitidos animales pequeños.', 'Permiten mascotas en todo el local.'],
      map: null
    };
  },
  computed: {
    finalShops() {
      return this.shops.filter((shop) => {
        const matchesQuery = this.query === '' ||
          shop.name.toLowerCase().includes(this.query.toLowerCase()) ||
          shop.description.toLowerCase().includes(this.query.toLowerCase());
        const matchesPolicy = !this.selectedPolicy || shop.petPolicy === this.selectedPolicy;
        return matchesQuery && matchesPolicy;
      });
    }
  },
  watch: {
    finalShops: {
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

      this.finalShops.forEach((shop) => {
        if (shop.coordinates) {
          L.marker([shop.coordinates.lat, shop.coordinates.lng], {
            icon: L.icon({
              iconUrl: 'https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1f43e.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34]
            })
          })
            .addTo(this.map)
            .bindPopup(`<b>${shop.name}</b><br>${shop.address}`);
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

.shops-list {
  max-width: 1200px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
}

.shops-list h1 {
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


.shop-image {
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

.shop-description {
  font-size: 1rem;
  color: #444;
  margin-bottom: 8px;
}

.shop-info {
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

