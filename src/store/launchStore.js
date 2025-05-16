import { defineStore } from "pinia";

export const useLaunchStore = defineStore('launch', {
    state: () => ({
        launches: [],                   // список всех запусков (заполняется с API)
        isLoading: false,               // индикатор загрузки данных (true/false)
        selectedCategory: null,         // выбранная категория для фильтрации
    }),
    actions: {
        async fetchLaunches() {
            this.isLoading = true   // показываем загрузку 
            try {
                const res = await fetch('https://main.proweb.uz/api/v1/launches/external/course/research/')
                const data = await res.json()
                this.launches = data       // сохраняем полученные данные
            } catch (error) {
                console.log('Ошибка загрузки данных: ', error);
            } finally {
                this.isLoading = false // скрываем загрузку
            }
        },
        // Функция выбора категории
        setSelectedCategory(category) {
            // Если нажали повторно на уже активную категорию сбрасываем
            this.selectedCategory = this.selectedCategory === category ? null : category
        }
    },
    getters: {
        filteredLaunches: (state) => {
            if (!state.selectedCategory) return state.launches
            return state.launches.filter(launch => launch.category == state.selectedCategory)
        }
    }
      
})


