<template>
  <div class="main">
    <div v-if="isLoading" class="loader">Загрузка...</div>
    <div v-if="pageError && !isLoading" class="error-display">{{ pageError }}</div>

    <div v-if="!isLoading && !pageError" class="main__wrapper">
      <div class="main__wrapper_block"><h2 class="main__wrapper_title">Запуски</h2></div>
      <div v-if="categoriesForFilter.length > 0" class="main__wrapper_category">
        <h2 class="main__wrapper_title">Категории</h2>
        <button
          v-for="category in categoriesForFilter"
          :key="category.id"
          class="main__wrapper_category_btn"
          :class="{ active: category.id === selectedCategoryId }"
          :style="{ backgroundColor: selectedCategoryId === category.id ? category.color : '#f0f0f0', color: selectedCategoryId === category.id ? getTextColorForBackground(category.color) : '#000000' }"
          @click="handleCategorySelect(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
      <p v-else-if="!isLoading && launchStore.rawLaunches && launchStore.rawLaunches.length > 0" class="info-message">
        Нет доступных категорий для фильтрации.
      </p>
      <div
        v-if="launchesToDisplay.length > 0"
        ref="kanbanBoardRef"
        class="main__wrapper_launch"
        @wheel.prevent="handleWheelScroll"
        @mousedown="handleMouseDown"
      >
        <div
          v-for="launch in launchesToDisplay"
          :key="launch.id"
          class="main__wrapper_launch_column"
        >
          <div class="main__wrapper_launch_column_course">
            <h3 class="course_name">{{ launch.name }}</h3>
            <span
              v-if="launch.categories && launch.categories.length > 0"
              class="course_category_tag"
              :style="{ backgroundColor: launch.categories[0].color, color: getTextColorForBackground(launch.categories[0].color) }"
            >
              {{ launch.categories[0].name }}
            </span>
          </div>
          <div class="main__wrapper_launch_column_content">
            <section v-if="getFormattedGroups(launch.groups).length > 0" class="launch_section">
              <h4>Старт групп</h4>
              <div class="launch_item_card">
                <div class="launch_item_card_date">
                  <span>{{ getFormattedGroups(launch.groups)[0].displayStartDate }}</span>
                  <span>{{ getFormattedGroups(launch.groups)[0].displayDaysOfWeek }}</span>
                </div>
                <div class="time_list">
                  <div v-for="group in getFormattedGroups(launch.groups)" class="time" :key="`group-${group.id}`">
                    <span>{{ group.displayStudyTime }}</span>
                  </div>
                </div>
              </div>
            </section>
            <section
              v-if="groupOpenLessonsByDate(launch.open_lessons).length > 0"
              class="launch_section2"
            >
              <h4>Открытые уроки</h4>
              <div
                v-for="(group, index) in groupOpenLessonsByDate(launch.open_lessons)"
                :key="`lesson-group-${index}`"
                class="launch_item_card_bottom"
              >
                <div class="launch_item_card_bottom_date">
                  <span>{{ group.displayDate }}</span>
                  <span>{{ group.displayDayOfWeek }}</span>
                </div>

                <div class="time_list2">
                  <div
                    v-for="time in group.times"
                    :key="`time-${time.id}`"
                    class="time"
                  >
                    <span>{{ time.displayTime }}</span>
                  </div>
                </div>
              </div>
            </section>
             <p v-if="getFormattedGroups(launch.groups).length === 0 && getFormattedOpenLessons(launch.open_lessons).length === 0" class="no-items-in-column">
                Нет предстоящих запусков или открытых уроков.
            </p>
          </div>
        </div>
      </div>
      <p v-else-if="!isLoading && launchStore.rawLaunches && launchStore.rawLaunches.length > 0 && categoriesForFilter.length > 0" class="info-message">
        Нет запусков для выбранной категории.
      </p>
      <p v-else-if="!isLoading && (!launchStore.rawLaunches || launchStore.rawLaunches.length === 0) && !pageError" class="info-message">
        В данный момент нет доступных запусков.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useLaunchStore } from '../store/launchStore.js';
import { groupOpenLessonsByDate } from "../shared/launchUtils";

const launchStore = useLaunchStore();
const pageError = ref(null);
const kanbanBoardRef = ref(null);

const isLoading = computed(() => launchStore.isLoading);
const categoriesForFilter = computed(() => launchStore.getCategoriesForFilter);
const selectedCategoryId = computed(() => launchStore.selectedCategoryId);
const launchesToDisplay = computed(() => launchStore.getLaunchesToDisplay);

const getFormattedGroups = launchStore.getFormattedSortedGroups;
const getFormattedOpenLessons = launchStore.getFormattedSortedOpenLessons;

const handleCategorySelect = (id) => {
  launchStore.setSelectedCategoryId(id);
}

const getTextColorForBackground = (hex) => {
  if (!hex) return '#000000';
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

onMounted(async () => {
  try {
    pageError.value = null;
    if (!launchStore.rawLaunches?.length || launchStore.error) {
      await launchStore.fetchLaunches();
    }
    pageError.value = launchStore.error || null;
    if (kanbanBoardRef.value) kanbanBoardRef.value.style.cursor = 'grab';
  } catch (err) {
    console.error('Ошибка при монтировании:', err);
    pageError.value = 'Произошла ошибка при загрузке данных.';
  }
});

onUnmounted(() => {
  launchStore.resetState();
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
});


// ================= Drag-to-Scroll ===================
const isDragging = ref(false);
const startX = ref(0);
const scrollLeftStart = ref(0);

const handleMouseDown = (event) => { // старт перемещения
  if (!kanbanBoardRef.value) return;
  event.preventDefault();
  isDragging.value = true;
  startX.value = event.pageX - kanbanBoardRef.value.offsetLeft;
  scrollLeftStart.value = kanbanBoardRef.value.scrollLeft;

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  kanbanBoardRef.value.style.cursor = 'grabbing';
};

const handleMouseMove = (event) => { // перемещение
  if (!isDragging.value || !kanbanBoardRef.value) return;
  const x = event.pageX - kanbanBoardRef.value.offsetLeft;
  kanbanBoardRef.value.scrollLeft = scrollLeftStart.value - (x - startX.value) * 1.5;
};

const handleMouseUp = () => { // завершение
  isDragging.value = false;
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseup', handleMouseUp);
  if (kanbanBoardRef.value) kanbanBoardRef.value.style.cursor = 'grab';
};

// Ctrl + колесо мыши (Wheel Scroll)
const handleWheelScroll = (e) => {
  if (e.ctrlKey && kanbanBoardRef.value) {
    kanbanBoardRef.value.scrollLeft += e.deltaY > 0 ? 100 : -100;
  }
};

</script>
