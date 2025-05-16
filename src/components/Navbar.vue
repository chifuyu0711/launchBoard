<template>
    <nav class="nav">
        <div class="nav__box">
            <router-link to='/' class="logo">
                <img :src="logo" alt="">
            </router-link>
            <ul class="nav__box_list">
                <li v-for="page in pages" :key="page.name">
                    <router-link :to="page.url" class="nav__box_list_link">
                        <img :src="page.img" alt="">
                        <span>{{ page.name }}</span>
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import logo from '../assets/images/logo.svg'
import flag from '../assets/images/flag.svg'
import about from '../assets/images/about.svg'
import { ref } from 'vue'

const pages = ref([
    { name: 'Запуски', img: flag, url: '/' }, 
    { name: 'Обо мне', img: about, url: '/about' }, 
])


</script>

