import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { addDays, formatDate, startOfLocalDay } from '../common/utils/date.utils';
import { calculatePendingAmount, sumAmounts } from '../common/utils/money.utils';
import { buildPendingPaymentsSummary } from '../common/utils/summary.utils';
import { getMockReservations } from '../data/mock-reservations';
import {
  ApiSuccessResponse,
  ApiErrorResponse,
} from '../types/api-response.types';
import {
  PaymentSummaryPeriod,
  PaymentTotals,
  PendingPaymentItem,
} from '../types/payment.types';
import { Reservation } from '../types/reservation.types';

@Injectable()
export class PaymentsService {
  private readonly supportedPeriods: PaymentSummaryPeriod[] = [
    'today',
    'this_week',
    'this_month',
  ];

  private getReservations(): Reservation[] {
    return getMockReservations();
  }

  getPendingPayments(): ApiSuccessResponse<{
    totalPendingAmount: number;
    currency: 'BGN';
    payments: PendingPaymentItem[];
  }> {
    const payments = this.getReservations()
      .filter(
        (reservation) =>
          reservation.status !== 'cancelled' &&
          reservation.paymentStatus !== 'refunded',
      )
      .map((reservation) => ({
        reservationId: reservation.id,
        guestName: reservation.guestName,
        room: reservation.room,
        totalAmount: reservation.totalAmount,
        paidAmount: reservation.paidAmount,
        pendingAmount: calculatePendingAmount(reservation),
        paymentStatus: reservation.paymentStatus,
        dueDate: reservation.checkIn,
        phone: reservation.phone,
      }))
      .filter((payment) => payment.pendingAmount > 0);

    const totalPendingAmount = sumAmounts(
      payments.map((payment) => payment.pendingAmount),
    );

    return {
      status: 'success',
      summary: buildPendingPaymentsSummary(payments, totalPendingAmount, 'BGN'),
      totalPendingAmount,
      currency: 'BGN',
      payments,
    };
  }

  getPaymentSummary(
    period?: string,
  ): ApiSuccessResponse<{
    currency: 'BGN';
    period: PaymentSummaryPeriod;
    totals: PaymentTotals;
  }> {
    const selectedPeriod = this.validatePeriod(period);
    const reservations = this.getReservations();
    const periodReservations = reservations.filter((reservation) =>
      this.belongsToPeriod(reservation, selectedPeriod),
    );
    const filteredReservations = periodReservations.filter(
      (reservation) =>
        reservation.status !== 'cancelled' &&
        reservation.paymentStatus !== 'refunded',
    );

    const totals = filteredReservations.reduce<PaymentTotals>(
      (accumulator, reservation) => {
        accumulator.expectedRevenue += reservation.totalAmount;
        accumulator.paidAmount += reservation.paidAmount;
        accumulator.pendingAmount += calculatePendingAmount(reservation);
        if (reservation.paymentStatus === 'refunded') {
          accumulator.refundedAmount += reservation.totalAmount;
        }
        return accumulator;
      },
      {
        expectedRevenue: 0,
        paidAmount: 0,
        pendingAmount: 0,
        refundedAmount: 0,
      },
    );

    totals.refundedAmount = sumAmounts(
      periodReservations
        .filter((reservation) => reservation.paymentStatus === 'refunded')
        .map((reservation) => reservation.totalAmount),
    );

    const label = this.labelForPeriod(selectedPeriod);

    return {
      status: 'success',
      summary: `${label} you have ${totals.expectedRevenue} BGN expected revenue, ${totals.paidAmount} BGN already paid, and ${totals.pendingAmount} BGN still pending.`,
      currency: 'BGN',
      period: selectedPeriod,
      totals,
    };
  }

  private validatePeriod(period?: string): PaymentSummaryPeriod {
    if (!period) {
      return 'this_week';
    }

    if (this.supportedPeriods.includes(period as PaymentSummaryPeriod)) {
      return period as PaymentSummaryPeriod;
    }

    throw new HttpException(
      {
        status: 'error',
        summary:
          'Invalid period. Use today, this_week, or this_month for payment summary.',
        error: {
          code: 'INVALID_PERIOD',
          details: `Received period "${period}".`,
        },
      } satisfies ApiErrorResponse,
      HttpStatus.BAD_REQUEST,
    );
  }

  private belongsToPeriod(
    reservation: Reservation,
    period: PaymentSummaryPeriod,
  ): boolean {
    const today = startOfLocalDay(new Date());
    const reservationDate = reservation.checkIn;

    if (period === 'today') {
      return reservationDate === formatDate(today);
    }

    if (period === 'this_week') {
      const endOfWeek = formatDate(addDays(today, 6));
      return reservationDate >= formatDate(today) && reservationDate <= endOfWeek;
    }

    const monthStart = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;

    return reservationDate.startsWith(monthStart);
  }

  private labelForPeriod(period: PaymentSummaryPeriod): string {
    if (period === 'today') {
      return 'Today';
    }

    if (period === 'this_week') {
      return 'This week';
    }

    return 'This month';
  }
}
