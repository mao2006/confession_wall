<template>
  <div class="background-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
</script>


<style scoped>
  .background-container {
  width: 100vh;
  height: 100vh;
  background-image: url('@/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  min-width:100vh ;
}

</style>