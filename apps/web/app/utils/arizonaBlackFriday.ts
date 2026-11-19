/**
 * Arizona: Black Week 2026. The deals themselves are today's deals (tagesangebote.json, price 53) plus the SALE
 * category – this file only says when the shop shows the Black Friday look (home page banner, deals page heading).
 * After the end everything falls back to the normal look by itself.
 */
export const ARIZONA_BLACK_WEEK_START = new Date('2026-11-19T00:00:00+01:00').getTime();
/** End of Cyber Monday (30.11.2026, 24:00 German time) */
export const ARIZONA_BLACK_WEEK_END = new Date('2026-12-01T00:00:00+01:00').getTime();

export const isArizonaBlackWeek = (now = Date.now()) =>
  now >= ARIZONA_BLACK_WEEK_START && now < ARIZONA_BLACK_WEEK_END;

/** Remaining time of the Black Week as "3 Tage 05:12:33" (or "05:12:33" on the last day) */
export const arizonaBlackWeekRemaining = (now = Date.now()) => {
  const seconds = Math.max(0, Math.floor((ARIZONA_BLACK_WEEK_END - now) / 1000));
  const days = Math.floor(seconds / 86_400);
  const pad = (n: number) => String(n).padStart(2, '0');
  const time = `${pad(Math.floor((seconds % 86_400) / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`;
  if (!days) return time;
  return `${days} ${days === 1 ? 'Tag' : 'Tage'} ${time}`;
};
