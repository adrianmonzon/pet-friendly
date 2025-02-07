<template>
  <div class="place-details">
    <h1>{{ selectedPlace.name }}</h1>
    <p>{{ selectedPlace.description }}</p>
    <p><strong>Dirección:</strong> {{ selectedPlace.address }}</p>
    <p><strong>Política Pet-Friendly:</strong> {{ selectedPlace.petPolicy }}</p>

    <!-- Contenedor para el mapa -->
    <div id="map" class="map-container"></div>

    <button @click="goBack" class="back-button">Volver</button>

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
      places: [
        {
          id: 1,
          name: 'Playa de la Malagueta',
          description: 'Playa urbana en Málaga donde los perros son bienvenidos.',
          address: 'Málaga, España',
          petPolicy: 'Permitidos perros en la zona habilitada.',
          coordinates: { lat: 36.7213, lng: -4.4204 },
          type: 'playa',
          image: 'https://fotos.hoteles.net/articulos/playa-barceloneta-barcelona-3153-1.jpg',
        },
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
          id: 444444,
          name: 'Hotel Peludo Tenerife',
          description: 'Hotel en Tenerife donde las mascotas son siempre bienvenidas.',
          address: 'Avenida de la Playa, 12, Tenerife, España',
          petPolicy: 'Perros permitidos en todo el hotel.',
          coordinates: { lat: 28.2916, lng: -16.6291 },
          image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg',
        },
      ],
      selectedPlace: {},
      map: null,
      reviews: [],
      hasVisited: true,
    };
  },
  mounted() {
    const id = parseInt(this.$route.params.id);
    this.selectedPlace = this.places.find((place) => place.id === id);
    if (this.selectedPlace) {
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
      const { lat, lng } = this.selectedPlace.coordinates;
      this.map = L.map('map').setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      }).addTo(this.map);
      L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(this.selectedPlace.name)
        .openPopup();
    },
    addReview(newReview) {
      this.reviews.push(newReview);
      localStorage.setItem(`reviews-${this.selectedPlace.id}`, JSON.stringify(this.reviews));
    },
    loadReviews() {
      const savedReviews = localStorage.getItem(`reviews-${this.selectedPlace.id}`);
      this.reviews = savedReviews ? JSON.parse(savedReviews) : [];
    },
  },
};
</script>

<style scoped>
.place-details {
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 768px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.place-details h1 {
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
