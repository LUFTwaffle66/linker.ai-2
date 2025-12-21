import { add, differenceInCalendarDays, formatDistanceToNow } from 'date-fns';

export type DurationUnit = 'days' | 'weeks' | 'months';

/**
 * Convert duration value/unit into a readable label like "4 weeks"
 */
export function formatDurationLabel(
  value?: number | null,
  unit?: DurationUnit | null
): string {
  if (!value || !unit) return '';
  const baseUnit = unit === 'months' ? 'month' : unit === 'weeks' ? 'week' : 'day';
  const suffix = value === 1 ? baseUnit : `${baseUnit}s`;
  return `${value} ${suffix}`;
}

/**
 * Calculate a relative deadline based on duration and a start date
 * Returns the computed deadline, remaining days, and a human-readable relative string
 */
export function calculateTimeLeft(
  value?: number | null,
  unit?: DurationUnit | null,
  startDate?: string | Date | null
) {
  if (!value || !unit) return null;

  const start = startDate ? new Date(startDate) : new Date();
  if (isNaN(start.getTime())) return null;

  const multiplier = unit === 'months' ? 30 : unit === 'weeks' ? 7 : 1;
  const deadline = add(start, { days: value * multiplier });
  const daysRemaining = Math.max(0, differenceInCalendarDays(deadline, new Date()));
  const relativeText =
    daysRemaining === 0
      ? 'Due now'
      : formatDistanceToNow(deadline, { addSuffix: true });

  return {
    deadline,
    daysRemaining,
    relativeText,
  };
}
