export function timeConvert(totalMinutesCounter, hourSpentWatching = 24) {
  const minutesInAMonth = hourSpentWatching * 60 * 30;

  const minutesInAyear = hourSpentWatching * 60 * 365;

  const yearsCounter = Math.floor(totalMinutesCounter / minutesInAyear);
  const restYearMinutes = totalMinutesCounter - yearsCounter * minutesInAyear;

  const monthsCounter = Math.floor(restYearMinutes / minutesInAMonth);
  const minutesR = restYearMinutes - monthsCounter * minutesInAMonth;
  const daysCounter = Math.floor(minutesR / (hourSpentWatching * 60));
  const hoursCounter = Math.floor(
    (minutesR - daysCounter * (hourSpentWatching * 60)) / 60
  );

  console.log(yearsCounter);

  const minutesCounter = Math.round(minutesR % 60);

  const daysHourMinutes = {
    yearsCounter,
    monthsCounter,
    daysCounter,
    hoursCounter,
    minutesCounter
  };

  return daysHourMinutes;
}

export function getDays(totalMinutesCounter, hourSpentWatching = 24) {
  const days = totalMinutesCounter / (hourSpentWatching * 60);
  return days;
}
