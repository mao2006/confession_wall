<template>
      <div class="fon-color"> welcome_page</div>
</template>

<script setup>
import { onMounted } from 'vue';
onMounted(
    () => {
        console.log("挂载成功")
    }
)
</script>

<style scoped>
    .fon-color {
        color: #FF4F5B;
    }
</style>