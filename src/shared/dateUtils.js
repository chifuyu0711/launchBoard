const shortDayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
const monthNames = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export function formatApiDateToDisplay(apiDate) {
    if (!apiDate) return '';
    try {
        const date = new Date(apiDate);
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    } catch {
        return apiDate;
    }
}

export function formatApiTimeToDisplay(apiTime) {
  return (apiTime && typeof apiTime === 'string' && apiTime.length >= 5) ? apiTime.slice(0, 5) : '';
}

export function mapApiDaysToShortNames(apiDays) {
  return Array.isArray(apiDays)
    ? apiDays.map(i => shortDayNames[i]).filter(Boolean).join(', ')
    : '';
}

export function getShortDayOfWeekFromApiDate(apiDate) {
  try {
    return shortDayNames[new Date(apiDate).getDay()];
  } catch {
    return '';
  }
}
