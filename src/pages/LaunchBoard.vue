<template>
  <div class="main">
    
  </div>
</template>


<script setup>
import { useLaunchStore } from '../store/launchStore.js';
import { ref, onMounted, computed } from 'vue';

const launchStore = useLaunchStore()
const error = ref(null)

// Получаем уникальные категории для кнопок фильтрации
const uniqueCategories = computed(() => {
    return [...new Set(launchStore.launches.map(launch => launch.category))]
})

onMounted(async () => {
  try {
    await launchStore.fetchLaunches();
  } catch (err) {
    error.value = 'Ошибка при загрузке данных';
    console.error(err);
  }
});

</script>
