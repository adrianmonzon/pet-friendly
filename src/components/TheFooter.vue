<template>
  <footer class="footer">
    <p>© 2024 Mi Sitio Web. Todos los derechos reservados.</p>
    <ul>
      <li><a href="#">Facebook</a></li>
      <li><a href="#">Twitter</a></li>
      <li><a href="#">LinkedIn</a></li>
    </ul>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter',
};
</script>

<style scoped>
.footer {
  background-color: #333;
  color: #fff;
  text-align: center;
  padding: 20px;
  margin-top: auto; /* Para asegurar su posición inferior */
}

.footer ul {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap; /* Envuelve enlaces si no caben */
  margin-top: 10px;
}

.footer a {
  color: #fff;
  text-decoration: none;
  transition: color 0.3s;
}

.footer a:hover {
  color: #007bff;
}
</style>
