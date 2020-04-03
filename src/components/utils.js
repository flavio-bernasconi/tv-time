const minutesInADays = 1440;

export function timeConvert(totalMinutesCounter) {
  const minutesInAMonth = minutesInADays * 30;

  const monthsCounter = Math.floor(totalMinutesCounter / minutesInAMonth);
  const minutesR = totalMinutesCounter - monthsCounter * minutesInAMonth;
  const daysCounter = Math.floor(minutesR / minutesInADays);
  const hoursCounter = Math.floor(
    (minutesR - daysCounter * minutesInADays) / 60
  );
  const minutesCounter = Math.round(minutesR % 60);

  const daysHourMinutes = {
    monthsCounter,
    daysCounter,
    hoursCounter,
    minutesCounter
  };

  return daysHourMinutes;
}

export function getDays(totalMinutesCounter) {
  const days = totalMinutesCounter / minutesInADays;
  return days;
}
