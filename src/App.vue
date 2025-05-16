<template>
  <div class="wrapper">
    <navbar/>
    <div class="main_content">
      <router-view/>
    </div>
  </div>
</template>



<script setup>
import Navbar from './components/Navbar.vue';

</script>
