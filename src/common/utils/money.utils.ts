import { Reservation } from '../../types/reservation.types';

export function calculatePendingAmount(
  reservation: Pick<Reservation, 'totalAmount' | 'paidAmount' | 'paymentStatus'>,
): number {
  if (reservation.paymentStatus === 'refunded') {
    return 0;
  }

  return Math.max(reservation.totalAmount - reservation.paidAmount, 0);
}

export function sumAmounts(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}
