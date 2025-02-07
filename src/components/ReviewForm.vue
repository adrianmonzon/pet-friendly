<template>
  <div class="review-form">
    <h3>Añadir una Reseña</h3>
    <form @submit.prevent="submitReview">
      <label for="reviewText">Tu reseña:</label>
      <textarea id="reviewText" v-model="reviewText" required></textarea>

      <label for="rating">Calificación:</label>
      <select id="rating" v-model="rating" required>
        <option value="5">5 - Excelente</option>
        <option value="4">4 - Muy bueno</option>
        <option value="3">3 - Normal</option>
        <option value="2">2 - Malo</option>
        <option value="1">1 - Terrible</option>
      </select>

      <button type="submit">Enviar Reseña</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "ReviewForm",
  data() {
    return {
      reviewText: "",
      rating: 5,
    };
  },
  methods: {
    submitReview() {
      if (this.reviewText.trim() === "") {
        alert("Escribe una reseña antes de enviarla.");
        return;
      }
      const newReview = {
        text: this.reviewText,
        rating: this.rating,
        id: Date.now(),
      };
      this.$emit("addReview", newReview);
      this.reviewText = "";
      this.rating = 5;
    },
  },
};
</script>

<style scoped>
.review-form {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.review-form label {
  font-weight: bold;
  display: block;
  margin-top: 10px;
}

.review-form textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.review-form select {
  width: 100%;
  padding: 5px;
  border-radius: 5px;
}

.review-form button {
  margin-top: 15px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.review-form button:hover {
  background-color: #0056b3;
}
</style>
