import { PendingPaymentItem } from '../../types/payment.types';
import { Reservation } from '../../types/reservation.types';
import { RoomStatusItem } from '../../types/room.types';
import { CleaningTask } from '../../types/task.types';

export function pluralize(
  count: number,
  singular: string,
  plural = `${singular}s`,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function joinWithAnd(items: string[]): string {
  if (items.length === 0) {
    return '';
  }

  if (items.length === 1) {
    return items[0];
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

export function buildReservationStatusSummary(stats: {
  activeReservations: number;
  checkInsToday: number;
  checkOutsToday: number;
  pendingPayments: number;
  occupiedRooms: number;
  availableRooms: number;
  roomsNeedingCleaning: number;
}): string {
  return `Today you have ${pluralize(
    stats.activeReservations,
    'active reservation',
  )}, ${pluralize(stats.checkInsToday, 'check-in')}, ${pluralize(
    stats.checkOutsToday,
    'check-out',
  )}, ${pluralize(stats.pendingPayments, 'pending payment')}, ${pluralize(
    stats.occupiedRooms,
    'occupied room',
  )}, ${pluralize(stats.availableRooms, 'available room')}, and ${pluralize(
    stats.roomsNeedingCleaning,
    'room needing cleaning',
    'rooms needing cleaning',
  )}.`;
}

export function buildCheckInSummary(
  label: 'Today' | 'Tomorrow',
  reservations: Reservation[],
): string {
  if (reservations.length === 0) {
    return `${label} you have no check-ins.`;
  }

  const details = reservations.map(
    (reservation) => `${reservation.guestName} in ${reservation.room}`,
  );

  return `${label} you have ${pluralize(
    reservations.length,
    'check-in',
  )}: ${joinWithAnd(details)}.`;
}

export function buildCheckOutSummary(reservations: Reservation[]): string {
  if (reservations.length === 0) {
    return 'Today you have no check-outs.';
  }

  const details = reservations.map(
    (reservation) => `${reservation.guestName} from ${reservation.room}`,
  );

  return `Today you have ${pluralize(
    reservations.length,
    'check-out',
  )}: ${joinWithAnd(details)}.`;
}

export function buildPendingPaymentsSummary(
  payments: PendingPaymentItem[],
  totalPendingAmount: number,
  currency: string,
): string {
  if (payments.length === 0) {
    return `You have no pending payments.`;
  }

  return `You have ${pluralize(
    payments.length,
    'pending payment',
  )} with a total outstanding amount of ${totalPendingAmount} ${currency}.`;
}

export function buildRoomStatusSummary(rooms: RoomStatusItem[]): string {
  const occupied = rooms.filter((room) => room.status === 'occupied').length;
  const available = rooms.filter((room) => room.status === 'available').length;
  const needsCleaning = rooms.filter(
    (room) => room.status === 'needs_cleaning',
  ).length;

  return `You have ${pluralize(
    occupied,
    'occupied room',
  )}, ${pluralize(available, 'available room')}, and ${pluralize(
    needsCleaning,
    'room needing cleaning',
    'rooms needing cleaning',
  )}.`;
}

export function buildAvailabilitySummary(
  date: string,
  availableRooms: string[],
): string {
  if (availableRooms.length === 0) {
    return `On ${date} you have no available rooms.`;
  }

  return `On ${date} you have ${pluralize(
    availableRooms.length,
    'available room',
  )}: ${joinWithAnd(availableRooms)}.`;
}

export function buildCleaningSummary(tasks: CleaningTask[]): string {
  if (tasks.length === 0) {
    return 'Today no rooms need cleaning.';
  }

  return `Today ${pluralize(tasks.length, 'room')} need cleaning: ${joinWithAnd(
    tasks.map((task) => task.room),
  )}.`;
}
