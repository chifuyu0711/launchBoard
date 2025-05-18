import {
    formatApiDateToDisplay,
    formatApiTimeToDisplay,
    mapApiDaysToShortNames,
    getShortDayOfWeekFromApiDate
} from "./dateUtils";


// функция форматирует и сортирует группы
export function formatAndSortGroups(groups = []) {
    return groups.map(group => ({
      id: group.id,
      originalStartDate: group.start_date,
      originalStudyTime: group.study_time,

      displayStartDate: formatApiDateToDisplay(group.start_date),
      displayStudyTime: formatApiTimeToDisplay(group.study_time),

      displayDaysOfWeek: mapApiDaysToShortNames(group.days),
    })).sort((a, b) => {
        const dateA = new Date(`${a.originalStartDate}T${a.originalStudyTime}`);
        const dateB = new Date(`${b.originalStartDate}T${b.originalStudyTime}`);
        return dateA - dateB;
    });
}


// функция форматирует и сортирует открытые уроки
export function formatAndSortOpenLessons(lessons = []) {
    return lessons.map(launch => ({
      id: launch.id,
      originalDate: launch.date,
      originalTime: launch.time,

      displayDate: formatApiDateToDisplay(launch.date),
      displayTime: formatApiTimeToDisplay(launch.time),
      
      displayDayOfWeek: getShortDayOfWeekFromApiDate(launch.date),
    })).sort((a, b) => {
        const dateA = new Date(a.originalDate);
        const dateB = new Date(b.originalDate);

        return dateA - dateB || a.originalTime.localeCompare(b.originalTime);
    });
}

export function groupOpenLessonsByDate(lessons = []) {
    const formatted = formatAndSortOpenLessons(lessons);
  
    const groups = {};
  
    formatted.forEach(lesson => {
      const key = lesson.displayDate; // группировка по дате
      if (!groups[key]) {
        groups[key] = {
          displayDate: lesson.displayDate,
          displayDayOfWeek: lesson.displayDayOfWeek,
          times: []
        };
      }
      groups[key].times.push({
        id: lesson.id,
        displayTime: lesson.displayTime
      });
    });
  
    // Преобразуем в массив, чтобы можно было использовать в v-for
    return Object.values(groups);
  }
  