<script setup>
import NavBar from './components/NavBar.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

</script>

<template>
    <div class="dark:bg-gray-900">
        <NavBar />
        <router-view class="pt-20"/> 
    </div>
</template>