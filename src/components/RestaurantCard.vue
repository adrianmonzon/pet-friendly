<template>
  <div class="restaurant-card">
    <!-- Botón de favoritos en la esquina superior derecha -->
    <button class="favorite-button" @click.stop="toggleFavorite">
      {{ isFavorite ? '♥' : '♡' }}
    </button>

    <!-- Contenido de la tarjeta -->
    <router-link :to="'/restaurant/' + restaurant.id" class="result-link">
      <img :src="restaurant.image" :alt="restaurant.name" class="restaurant-image" />
      <h2>{{ restaurant.name }}</h2>
      <p>{{ restaurant.description }}</p>
      <p><strong>Address:</strong> {{ restaurant.address }}</p>
      <p><strong>Pet Policy:</strong> {{ restaurant.petPolicy }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'RestaurantCard',
  props: {
    restaurant: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isFavorite: true,
    };
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      let savedFavorites = JSON.parse(localStorage.getItem('petFriendlyFavorites')) || [];
      
      if (!this.isFavorite) {
        savedFavorites = savedFavorites.filter(r => r.id !== this.restaurant.id);
        localStorage.setItem('petFriendlyFavorites', JSON.stringify(savedFavorites));
        this.$emit('removeFavorite', this.restaurant.id);
      }
    },
  },
};
</script>

<style scoped>
.restaurant-card {
  position: relative;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  transition: box-shadow 0.3s;
}

.restaurant-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.favorite-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 35px;
  cursor: pointer;
  color: #f44336;
}

.favorite-button:hover {
  transform: scale(1.1);
}

.result-link {
  display: block;
  text-decoration: none;
  color: #333;
}

.restaurant-card h2 {
  font-size: 1.3rem;
  margin-bottom: 8px;
  color: #007bff;
  transition: color 0.3s;
}

.restaurant-card:hover h2 {
  color: #0056b3;
}

.restaurant-card p {
  margin: 4px 0;
  font-size: 0.95rem;
  color: #444;
}

.restaurant-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  margin-bottom: 10px;
}
</style>
