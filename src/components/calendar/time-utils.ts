export const TIME_SLOTS_30_MIN = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

export function plusOneHour(time: string): string {
  const idx = TIME_SLOTS_30_MIN.indexOf(time);
  if (idx === -1) return time;
  const next = Math.min(idx + 2, TIME_SLOTS_30_MIN.length - 1);
  return TIME_SLOTS_30_MIN[next];
}
