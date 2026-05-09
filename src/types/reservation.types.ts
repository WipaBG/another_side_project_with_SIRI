import { PaymentStatus } from './payment.types';

export type ReservationStatus =
  | 'confirmed'
  | 'pending'
  | 'cancelled'
  | 'checked_in'
  | 'checked_out';

export interface Reservation {
  id: number;
  guestId: number;
  guestName: string;
  phone: string;
  email?: string;
  room: string;
  guestsCount: number;
  checkIn: string;
  checkOut: string;
  arrivalTime?: string;
  departureTime?: string;
  status: ReservationStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  paidAmount: number;
  currency: 'BGN' | 'EUR';
  notes?: string;
}
