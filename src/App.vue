<template>
  <div class="background-container">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
</script>

<style>
 div#app,body{
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
 }
 html{
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
 }
  .background-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: url('@/images/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

</style>