import { Reservation } from '../../types/reservation.types';

const ACTIVE_RESERVATION_STATUSES = new Set(['confirmed', 'checked_in']);

function pad(value: number): string {
  return value.toString().padStart(2, '0');
}

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, amount: number): Date {
  const next = startOfLocalDay(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function formatDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
}

export function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return startOfLocalDay(parsed);
}

export function isSameLocalDate(left: string, right: Date): boolean {
  return left === formatDate(right);
}

export function isReservationActiveToday(
  reservation: Reservation,
  referenceDate: Date,
): boolean {
  if (!ACTIVE_RESERVATION_STATUSES.has(reservation.status)) {
    return false;
  }

  return (
    reservation.checkIn <= formatDate(referenceDate) &&
    reservation.checkOut >= formatDate(referenceDate)
  );
}

export function isCheckInOnDate(
  reservation: Reservation,
  referenceDate: Date,
): boolean {
  return (
    reservation.status !== 'cancelled' &&
    isSameLocalDate(reservation.checkIn, referenceDate)
  );
}

export function isCheckOutOnDate(
  reservation: Reservation,
  referenceDate: Date,
): boolean {
  return (
    reservation.status !== 'cancelled' &&
    isSameLocalDate(reservation.checkOut, referenceDate)
  );
}

export function overlapsDate(
  reservation: Reservation,
  referenceDate: Date,
): boolean {
  if (!ACTIVE_RESERVATION_STATUSES.has(reservation.status)) {
    return false;
  }

  const target = formatDate(referenceDate);
  return reservation.checkIn <= target && target < reservation.checkOut;
}
