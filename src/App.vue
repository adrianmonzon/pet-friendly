<template>
  <div class="grid-container">
    <TheNavbar />
    <router-view />
    <TheFooter />
  </div>
</template>

<script>
import TheNavbar from './components/TheNavbar.vue';
import TheFooter from './components/TheFooter.vue';

export default {
  components: {
    TheNavbar,
    TheFooter
  },
};
</script>

<style>
/* Estilos generales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: 'Inter', sans-serif;
  height: 100%;
  background-color: #f5f5f5;
  color: #333;
}

.grid-container {
  display: grid;
  grid-template-areas:
    "navbar"
    "main"
    "footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr;
  height: 100vh;
  width: 100%;
}
.grid-container > *:nth-child(1) { grid-area: navbar; }
.grid-container > *:nth-child(2) { grid-area: main; }
.grid-container > *:nth-child(3) { grid-area: footer; }
</style>
