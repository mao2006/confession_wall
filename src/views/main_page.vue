<template>
    <p>welcome</p>
</template>

<script setup>
    import { login_store } from '@/stores/store';
    import { createPinia } from 'pinia';

    const use_store = login_store()


</script>