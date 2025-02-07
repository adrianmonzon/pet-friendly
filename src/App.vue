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
  color: #333;
}

body {
  background-image: url('./assets/background3.jpg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  min-height: 100vh;
  background-attachment: fixed;
  height: 100%;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
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
