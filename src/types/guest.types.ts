import { PaymentStatus } from './payment.types';

export interface Guest {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  nationality?: string;
  documentNumber?: string;
  notes?: string;
}

export interface GuestReservationSummary {
  reservationId: number;
  room: string;
  checkIn: string;
  checkOut: string;
  paymentStatus: PaymentStatus;
  pendingAmount: number;
}

export interface GuestSearchResult {
  guestName: string;
  phone: string;
  email?: string;
  currentReservation: GuestReservationSummary | null;
  upcomingReservations: GuestReservationSummary[];
  pastReservations: GuestReservationSummary[];
}

export interface GuestDetailReservation extends GuestReservationSummary {
  status: string;
  totalAmount: number;
  paidAmount: number;
  currency: 'BGN' | 'EUR';
}

export interface GuestDetail {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  nationality?: string;
  documentNumberLast4: string | null;
  notes?: string;
  reservations: GuestDetailReservation[];
  totalSpent: number;
  totalPendingAmount: number;
}

export interface GuestCurrentStay {
  reservationId: number;
  room: string;
  checkIn: string;
  checkOut: string;
  paymentStatus: PaymentStatus;
  pendingAmount: number;
}

export interface GuestContactCard {
  guestName: string;
  phone: string;
  email?: string;
  currentRoom: string | null;
  currentStayDates: string | null;
}
