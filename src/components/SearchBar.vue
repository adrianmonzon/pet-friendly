<template>
  <div class="search-bar">
    <div class="input-container">
      <input
        type="text"
        v-model="searchTerm"
        @keyup.enter="onSearch"
        placeholder="Busca lugares pet friendly..."
      />
      <!-- X para limpiar el input -->
      <span v-if="searchTerm" class="clear-search" @click="clearSearch">×</span>
    </div>
    <button @click="onSearch">Buscar</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      searchTerm: '',
    };
  },
  methods: {
    onSearch() {
      this.$emit('searchQuery', this.searchTerm);
    },
    clearSearch() {
      this.searchTerm = '';
      this.$emit('searchQuery', ''); // Emitir un término vacío para limpiar la búsqueda en el componente principal
    },
  },
};
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  position: relative;
}

.input-container {
  position: relative;
  flex: 1;
}

.search-bar input {
  width: 100%;
  padding: 8px 30px 8px 10px; /* Ajustamos el padding para dejar espacio para la X */
  font-size: 14px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.search-bar button {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.search-bar button:hover {
  background-color: #0056b3;
}

/* Estilo para la X de limpiar la búsqueda dentro del input */
.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  cursor: pointer;
  color: #999;
}

.clear-search:hover {
  color: #333;
}
</style>
