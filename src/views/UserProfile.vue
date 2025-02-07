<template>
  <div class="user-profile">
    <h2>Mi Perfil</h2>
    <section class="profile-section">
      <h3>Mis Lugares Visitados</h3>
      <ul v-if="visitedPlaces.length">
        <li v-for="place in visitedPlaces" :key="place.id">{{ place.name }}</li>
      </ul>
      <p v-else class="empty-message">Aún no has visitado ningún lugar.</p>
    </section>
    <section class="profile-section">
      <h3>Lista de Deseos</h3>
      <ul v-if="wishlist.length">
        <li v-for="place in wishlist" :key="place.id">{{ place.name }}</li>
      </ul>
      <p v-else class="empty-message">Tu lista de deseos está vacía.</p>
    </section>
    <section class="favorites-section">
      <h3>Mis Favoritos</h3>
        <div v-if="favorites.length" class="favorites-grid">
      <RestaurantCard 
        v-for="restaurant in favorites" 
        :key="restaurant.id" 
        :restaurant="restaurant" 
        @removeFavorite="removeFavorite"
      />
    </div>
    <div v-else>
      <p>You have no favorite places yet!</p>
    </div>
    </section>
  </div>
</template>

<script>
import RestaurantCard from '@/components/RestaurantCard.vue';

export default {
  name: 'UserProfile',
  components: { RestaurantCard },
  data() {
    return {
      visitedPlaces: [
        { id: 1, name: 'La Huella Canina - Madrid' },
        { id: 2, name: 'El Rincón Peludo - Barcelona' },
        { id: 3, name: 'Mascota Café - Sevilla' }
      ],
      wishlist: [
        { id: 1, name: 'Doggy Deli - Málaga' },
        { id: 2, name: 'Amigos Peludos - Salamanca' }
      ],
      favorites: []
    };
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      this.visitedPlaces = JSON.parse(localStorage.getItem('visitedPlaces')) || [];
      this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      const saved = localStorage.getItem('petFriendlyFavorites');
      this.favorites = saved ? JSON.parse(saved) : [];
    },
    clearFavorites() {
      this.favorites = [];
      localStorage.removeItem('petFriendlyFavorites');
    },
    removeFavorite(restaurantId) {
      this.favorites = this.favorites.filter(r => r.id !== restaurantId);
      localStorage.setItem('petFriendlyFavorites', JSON.stringify(this.favorites));
    }
  },
};
</script>

<style scoped>
.user-profile {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 20px;
}

h3 {
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
  font-size: 1.5rem;
  color: #0056b3;
  margin-bottom: 15px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #f8f9fa;
  padding: 10px;
  margin: 8px 0;
  border-radius: 5px;
  font-size: 1.1rem;
  color: #333;
}

.empty-message {
  font-size: 1rem;
  color: #777;
}

.profile-section {
  padding: 20px 0;
  border-bottom: 1px solid #ddd;
}

.favorites-section {
  margin-top: 30px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.favorites-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.favorites-link:hover {
  background-color: #0056b3;
}
</style>
