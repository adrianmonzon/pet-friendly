// 2. Vista: Detalle de Restaurante con sección de reseñas y mapa
<template>
  <div class="restaurant-details">
    <h1>{{ selectedRestaurant.name }}</h1>
    <p>{{ selectedRestaurant.description }}</p>
    <p>
      <strong>Address:</strong> {{ selectedRestaurant.address }}
    </p>
    <p>
      <strong>Pet Policy:</strong> {{ selectedRestaurant.petPolicy }}
    </p>
    <!-- Contenedor para el mapa -->
    <div id="map" class="map-container"></div>
    <button @click="goBack" class="back-button">Go Back</button>

    <!-- Sección de reseñas -->
    <div class="reviews-section">
      <ReviewForm v-if="hasVisited" @addReview="addReview" />
      <ul v-if="reviews.length" class="review-list">
      <h3>Reseñas</h3>
        <li v-for="review in reviews" :key="review.id" class="review-card">
          <p>{{ review.text }}</p>
          <p><strong>Valoración:</strong> {{ review.rating }} / 5</p>
        </li>
      </ul>
      <p class="review-list__empty" v-else>No hay reseñas aún.</p>
    </div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ReviewForm from '@/components/ReviewForm.vue';

export default {
  components: { ReviewForm },
  data() {
    return {
      restaurants: [
        {
          id: 1,
          name: 'Paws Café',
          description: 'Cozy café with a dog-friendly menu.',
          address: '1234 Paw Street, New York, USA',
          coordinates: { lat: 40.73061, lng: -73.935242 },
          petPolicy: 'Dogs allowed on terrace.',
        },
        {
          id: 2,
          name: 'Furry Diner',
          description: 'Classic diner welcoming pets of all sizes.',
          address: '5678 Furry Ave, Los Angeles, USA',
          coordinates: { lat: 34.052235, lng: -118.243683 },
          petPolicy: 'All pets allowed with leash.',
        },
        {
          id: 3,
          name: 'PetStop',
          description: 'Quick bites for you and your pet!',
          address: '7890 Pet Rd, Chicago, USA',
          coordinates: { lat: 41.878113, lng: -87.629799 },
          petPolicy: 'Pets allowed only outside.',
        },
      ],
      selectedRestaurant: {},
      map: null,
      reviews: [],
      hasVisited: true,
    };
  },
  mounted() {
    const id = parseInt(this.$route.params.id);
    this.selectedRestaurant = this.restaurants.find((r) => r.id === id);
    if (this.selectedRestaurant) {
      this.$nextTick(() => {
        this.initMap();
        this.loadReviews();
      });
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    initMap() {
      setTimeout(() => {
        const { lat, lng } = this.selectedRestaurant.coordinates;
        this.map = L.map('map').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap',
        }).addTo(this.map);
        L.marker([lat, lng])
          .addTo(this.map)
          .bindPopup(this.selectedRestaurant.name)
          .openPopup();
      }, 500);
    },
    addReview(newReview) {
      this.reviews.push(newReview);
      localStorage.setItem(`reviews-${this.selectedRestaurant.id}`, JSON.stringify(this.reviews));
    },
    loadReviews() {
      const savedReviews = localStorage.getItem(`reviews-${this.selectedRestaurant.id}`);
      this.reviews = savedReviews ? JSON.parse(savedReviews) : [];
    },
  },
};
</script>

<style scoped>
.restaurant-details {
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 768px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.restaurant-details h1 {
  font-size: 30px;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 16px;
}

.map-container {
  width: 100%;
  height: 400px;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.back-button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #0056b3;
}

.reviews-section {
  margin-top: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.review-list {
  margin-top: 20px;
  list-style: none;
  padding: 0;
}

.review-list__empty {
  margin-top: 10px;
}

.review-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.review-card p {
  margin: 5px 0;
}
</style>
