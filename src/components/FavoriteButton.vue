<template>
  <div :class="['heart', heartClass]" @click.stop="toggleFavorite"></div>
</template>

<script>
export default {
  name: 'FavoriteButton',
  props: {
    place: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isFavorite: false,
    };
  },
  mounted() {
    this.checkIfFavorite();
  },
  methods: {
    checkIfFavorite() {
      let saved = localStorage.getItem('petFriendlyFavorites');
      let favs = saved ? JSON.parse(saved) : [];
      this.isFavorite = favs.some((r) => r.id === this.place.id);
    },
    toggleFavorite() {
      let saved = localStorage.getItem('petFriendlyFavorites');
      let favs = saved ? JSON.parse(saved) : [];

      if (this.isFavorite) {
        // Eliminar de favoritos
        favs = favs.filter((r) => r.id !== this.place.id);
      } else {
        // Agregar a favoritos
        favs.push(this.place);
      }
      localStorage.setItem('petFriendlyFavorites', JSON.stringify(favs));
      this.isFavorite = !this.isFavorite;
    },
  },
  computed: {
    heartClass() {
      return this.isFavorite ? 'heart-filled' : 'heart-empty';
    },
  },
};
</script>

<style scoped>
.heart {
  position: absolute;
  top: 12px;
  right: 8px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s;
}

/* Efecto zoom al pasar el ratón */
.heart:hover {
  transform: scale(1.1);
}

/* Usamos la MISMA fuente, tamaño y line-height para ambos corazones */
.heart::before {
  display: inline-block;
  width: 100%;
  height: 100%;
  font-family: 'Arial Unicode MS', 'Arial', sans-serif; /* Ajusta a tu gusto */
  font-size: 30px;
  line-height: 24px;
  text-align: center;
  color: #f44336; /* Rojo */
}

/* Corazón vacío */
.heart-empty::before {
  content: '♡'; /* U+2661 */
}

/* Corazón relleno */
.heart-filled::before {
  content: '♥'; /* U+2665 */
}
</style>
