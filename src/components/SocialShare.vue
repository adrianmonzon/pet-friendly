<template>
  <div class="social-share">
    <h3>Comparte en redes</h3>
    <button @click="share('facebook')">Facebook</button>
    <button @click="share('twitter')">Twitter</button>
  </div>
</template>

<script>
export default {
  name: 'SocialShare',
  methods: {
    share(platform) {
      const url = encodeURIComponent(window.location.href);
      const text = encodeURIComponent('¡Mira este lugar pet-friendly!');
      let shareUrl = '';

      if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      }

      window.open(shareUrl, '_blank');
    },
  },
};
</script>

<style scoped>
.social-share {
  padding: 10px;
  text-align: center;
}
.social-share button {
  margin: 5px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
