export type PaymentStatus =
  | 'paid'
  | 'partial'
  | 'unpaid'
  | 'deposit_paid'
  | 'refunded';

export type PaymentSummaryPeriod = 'today' | 'this_week' | 'this_month';

export interface PendingPaymentItem {
  reservationId: number;
  guestName: string;
  room: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  phone: string;
}

export interface PaymentTotals {
  expectedRevenue: number;
  paidAmount: number;
  pendingAmount: number;
  refundedAmount: number;
}

export interface GuestPaymentRecord {
  reservationId: number;
  room: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentStatus: PaymentStatus;
  currency: 'BGN' | 'EUR';
}
