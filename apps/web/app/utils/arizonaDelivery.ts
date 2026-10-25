/**
 * Arizona: shipping day and delivery window in German time.
 * Orders placed Monday to Friday before 12:00 leave the warehouse in Worms the same day, later orders on the next
 * working day. DHL delivers 1–3 days later (Monday to Saturday). Public holidays: nationwide ones plus those of
 * Rheinland-Pfalz (warehouse) for the shipping day, nationwide ones for the delivery day.
 */
const CUTOFF_HOUR = 12;
const TRANSIT_DAYS = { min: 1, max: 3 };
const WEEKDAYS_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONTHS_SHORT = ['Jan', 'Feb', 'März', 'Apr', 'Mai', 'Juni', 'Juli', 'Aug', 'Sept', 'Okt', 'Nov', 'Dez'];

// Calendar days are handled as UTC midnight, so adding days is unaffected by daylight saving time.
const key = (day: Date) => day.toISOString().slice(0, 10);
const addDays = (day: Date, days: number): Date => new Date(day.getTime() + days * 86_400_000);
const utcDay = (year: number, month: number, date: number): Date => new Date(Date.UTC(year, month, date));

/** Easter Sunday (Gregorian calendar, anonymous algorithm). */
const easterSunday = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const date = ((h + l - 7 * m + 114) % 31) + 1;
  return utcDay(year, month, date);
};

const holidayCache = new Map<string, Set<string>>();

const holidays = (year: number, withWarehouseState: boolean) => {
  const cacheKey = `${year}-${withWarehouseState}`;
  const cached = holidayCache.get(cacheKey);
  if (cached) return cached;

  const easter = easterSunday(year);
  const days = [
    utcDay(year, 0, 1), // Neujahr
    addDays(easter, -2), // Karfreitag
    addDays(easter, 1), // Ostermontag
    utcDay(year, 4, 1), // Tag der Arbeit
    addDays(easter, 39), // Christi Himmelfahrt
    addDays(easter, 50), // Pfingstmontag
    utcDay(year, 9, 3), // Tag der Deutschen Einheit
    utcDay(year, 11, 25), // 1. Weihnachtstag
    utcDay(year, 11, 26), // 2. Weihnachtstag
  ];
  if (withWarehouseState) {
    days.push(addDays(easter, 60), utcDay(year, 10, 1)); // Fronleichnam, Allerheiligen (Rheinland-Pfalz)
  }
  const result = new Set(days.map(key));
  holidayCache.set(cacheKey, result);
  return result;
};

const isShippingDay = (day: Date) =>
  day.getUTCDay() >= 1 && day.getUTCDay() <= 5 && !holidays(day.getUTCFullYear(), true).has(key(day));

const isDeliveryDay = (day: Date) => day.getUTCDay() !== 0 && !holidays(day.getUTCFullYear(), false).has(key(day));

/** Date, hour and minute in Germany, independent of the visitor's time zone. */
const germanNow = (now: Date) => {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );
  return {
    today: utcDay(Number(parts.year), Number(parts.month) - 1, Number(parts.day)),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
};

const nextDay = (from: Date, matches: (day: Date) => boolean) => {
  let day = addDays(from, 1);
  while (!matches(day)) day = addDays(day, 1);
  return day;
};

export const getArizonaShipping = (now = new Date()) => {
  const { today, hour, minute } = germanNow(now);
  const shipsToday = isShippingDay(today) && hour < CUTOFF_HOUR;
  const shippingDay = shipsToday ? today : nextDay(today, isShippingDay);

  let earliest = shippingDay;
  for (let i = 0; i < TRANSIT_DAYS.min; i++) earliest = nextDay(earliest, isDeliveryDay);
  let latest = earliest;
  for (let i = TRANSIT_DAYS.min; i < TRANSIT_DAYS.max; i++) latest = nextDay(latest, isDeliveryDay);

  return {
    shipsToday,
    /** Minutes until the cut-off when the order still ships today. */
    minutesLeft: shipsToday ? (CUTOFF_HOUR - hour) * 60 - minute : 0,
    /** Minutes until the cut-off of the shipping day (today or a later working day). */
    minutesToCutoff:
      Math.round((shippingDay.getTime() - today.getTime()) / 60_000) + CUTOFF_HOUR * 60 - (hour * 60 + minute),
    /** "morgen" or "am Montag" when the order ships on a later day. */
    shippingDayLabel:
      key(shippingDay) === key(addDays(today, 1))
        ? 'morgen'
        : `am ${['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][shippingDay.getUTCDay()]}`,
    earliest,
    latest,
  };
};

/** e.g. "Di, 27. Okt" */
export const formatArizonaDeliveryDay = (day: Date) =>
  `${WEEKDAYS_SHORT[day.getUTCDay()]}, ${day.getUTCDate()}. ${MONTHS_SHORT[day.getUTCMonth()]}`;

/** e.g. "Di, 27. Okt – Mi, 28. Okt" */
export const formatArizonaDeliveryWindow = (now = new Date()) => {
  const { earliest, latest } = getArizonaShipping(now);
  return `${formatArizonaDeliveryDay(earliest)} – ${formatArizonaDeliveryDay(latest)}`;
};

const WEEKDAYS_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MONTHS_LONG = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

/** e.g. "2 Std. 5 Min." or "29 Min." */
export const formatArizonaDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} Std. ${rest} Min.` : `${rest} Min.`;
};

/**
 * Earliest delivery day with the time left to order for it, e.g. { day: "Morgen, 26. Oktober", orderWithin: "29 Min." }
 * or { day: "Dienstag, 27. Oktober", … }.
 */
export const getArizonaDeliveryPromise = (now = new Date()) => {
  const { earliest, minutesToCutoff } = getArizonaShipping(now);
  const { today } = germanNow(now);
  const daysAhead = Math.round((earliest.getTime() - today.getTime()) / 86_400_000);
  const label = daysAhead === 1 ? 'Morgen' : daysAhead === 2 ? 'Übermorgen' : WEEKDAYS_LONG[earliest.getUTCDay()];
  return {
    day: `${label}, ${earliest.getUTCDate()}. ${MONTHS_LONG[earliest.getUTCMonth()]}`,
    orderWithin: formatArizonaDuration(minutesToCutoff),
  };
};
