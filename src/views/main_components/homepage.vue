<template>
    <div class="fon-color">
        <p>homepage</p>
        <div>
            {{ store_usermessage.token }}
        </div>
    </div>
</template>

<script setup>
    import { user_store } from '@/stores/store';

    const store_usermessage = user_store()
    
</script>

<style scoped>
    .fon-color {
        color: #FF4F5B;
    }
</style>