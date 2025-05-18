import { defineStore } from "pinia";
import {
    formatAndSortGroups,
    formatAndSortOpenLessons
} from "../shared/launchUtils";

export const useLaunchStore = defineStore('launch', {
  state: () => ({
    rawLaunches: [], // сырые данные с API
    allUniqueCategories: [], // уникальные катерогии 
    isLoading: false,
    selectedCategoryId: null, // выбранная категория для фильтрации
    error: null,
  }),
  actions: {
    async fetchLaunches() {
      this.isLoading = true;
      this.error = null;

      try {
        const res = await fetch('https://main.proweb.uz/api/v1/launches/external/course/research/');
        const data = await res.json();
        this.rawLaunches = data.results || [];

        const categoryMap = new Map();

        this.rawLaunches.flatMap(l => l.categories || []).forEach(cat => {
          if (!categoryMap.has(cat.id)) categoryMap.set(cat.id, cat);
        });

        this.allUniqueCategories = Array.from(categoryMap.values()).sort((a, b) => a.id - b.id);

      } catch (err) {
        console.error('Ошибка загрузки:', err);
        this.error = err.message || 'Ошибка загрузки данных.';
        this.rawLaunches = [];
        this.allUniqueCategories = [];
      } finally {
        this.isLoading = false;
      }
    },

    // устанавливает либо сбрасывает выбранную катерогию для фильтрации
    setSelectedCategoryId(categoryId) {
      const id = typeof categoryId === 'object' ? categoryId?.id : categoryId;
      this.selectedCategoryId = this.selectedCategoryId === id ? null : id;
    },
    
    resetState() {
      this.rawLaunches = [];
      this.allUniqueCategories = [];
      this.selectedCategoryId = null;
      this.isLoading = false;
      this.error = null;
    }
  },
  getters: {
    getLaunchesToDisplay: state => {
      if (!state.rawLaunches.length) return []; // если данные ещё не загружены то возвращается пустой массив
      if (!state.selectedCategoryId) return state.rawLaunches; //  если никакая категория не выбрана то показывает все запуски
      return state.rawLaunches.filter(l =>
        l.categories?.some(c => c.id === state.selectedCategoryId)
      ); // фильтрация
    },
    
    getCategoriesForFilter: state => state.allUniqueCategories, // возвращает список уникальных категорий из API (rawLaunches)

    // Возвращает функцию, которая:
        // 1. Форматирует каждую группу (дата, время, дни недели)
        // 2. Сортирует группы по дате и времени начала
    getFormattedSortedGroups: () => formatAndSortGroups,

    // Возвращает функцию, которая:
        // 1. Форматирует каждый открытый урок (дата, время, день недели)
        // 2. Сортирует уроки по дате (по убыванию), затем по времени (по алфавиту)
    getFormattedSortedOpenLessons: () => formatAndSortOpenLessons,
  }
});
