<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="brand-link">Welcome Pets</router-link>
    </div>
    <button class="hamburger" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <!-- Menú de navegación -->
    <ul :class="{ 'menu-active': isMenuOpen }" class="menu">
      <li>
        <router-link to="/">Inicio</router-link>
      </li>
      <li>
        <router-link to="/perfil">Mi Perfil</router-link>
      </li>
      <li>
        <router-link to="/eventos">Eventos</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'TheNavbar',
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  color: #007bff;
  border-bottom: 1px solid #007bff;

}

.brand-link {
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
}

.brand-link:hover {
  color: #0056b3;
}

.menu {
  list-style: none;
  display: flex;
  gap: 20px;
  margin: 0;
  transition: max-height 0.3s ease;
}

.menu li {
  display: flex;
}

.menu li a {
  text-decoration: none;
  color: #007bff;
  font-size: 1rem;
  transition: color 0.3s;
}

.menu li a:hover {
  color: #0056b3;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 25px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 4px;
  background-color: #007bff;
  border-radius: 2px;
  transition: transform 0.3s, opacity 0.3s;
}

/* Responsividad */
@media (max-width: 768px) {
  .menu {
    flex-direction: column;
    position: absolute;
    top: 60px;
    right: 0;
    width: 100%;
    max-height: 0;
    overflow: hidden;
    padding: 0;
  }

  .menu-active {
    max-height: 300px;
  }

  .hamburger {
    display: flex;
  }
}
</style>
