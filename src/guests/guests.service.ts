import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { calculatePendingAmount, sumAmounts } from '../common/utils/money.utils';
import { mockGuests } from '../data/mock-guests';
import { getMockReservations } from '../data/mock-reservations';
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from '../types/api-response.types';
import {
  Guest,
  GuestContactCard,
  GuestCurrentStay,
  GuestDetail,
  GuestDetailReservation,
  GuestReservationSummary,
  GuestSearchResult,
} from '../types/guest.types';
import { GuestPaymentRecord } from '../types/payment.types';
import { Reservation } from '../types/reservation.types';

@Injectable()
export class GuestsService {
  private getReservations(): Reservation[] {
    return getMockReservations();
  }

  searchGuests(
    name?: string,
  ): ApiSuccessResponse<{
    guests: GuestSearchResult[];
  }> {
    if (!name) {
      throw new HttpException(
        {
          status: 'error',
          summary: 'Name query parameter is required for guest search.',
          error: {
            code: 'MISSING_NAME',
          },
        } satisfies ApiErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }

    const matchedGuests = mockGuests.filter(
      (guest) => guest.fullName.toLowerCase() === name.trim().toLowerCase(),
    );

    if (matchedGuests.length === 0) {
      return {
        status: 'success',
        summary: `No guest found matching ${name}.`,
        guests: [],
      };
    }

    const guests = matchedGuests.map((guest) => this.buildGuestSearchResult(guest));
    const firstGuest = guests[0];
    const currentReservation = firstGuest.currentReservation;

    const summary = currentReservation
      ? `Found ${firstGuest.guestName}. ${firstGuest.guestName} is staying in ${currentReservation.room} from ${currentReservation.checkIn} to ${currentReservation.checkOut}. Phone number is ${firstGuest.phone}.`
      : `Found ${firstGuest.guestName}. Phone number is ${firstGuest.phone}.`;

    return {
      status: 'success',
      summary,
      guests,
    };
  }

  getGuestById(
    id: string,
  ): ApiSuccessResponse<{
    guest: GuestDetail;
  }> {
    const guestId = this.parseGuestId(id);
    const guest = this.requireGuest(guestId);
    const reservations = this.getReservations()
      .filter((reservation) => reservation.guestId === guest.id)
      .map((reservation) => this.toGuestDetailReservation(reservation));

    const totalSpent = sumAmounts(
      reservations.map((reservation) => reservation.paidAmount),
    );
    const totalPendingAmount = sumAmounts(
      reservations.map((reservation) => reservation.pendingAmount),
    );

    return {
      status: 'success',
      summary: `${guest.fullName} has ${reservations.length} reservations. Total spent is ${totalSpent} BGN, and pending amount is ${totalPendingAmount} BGN.`,
      guest: {
        id: guest.id,
        fullName: guest.fullName,
        phone: guest.phone,
        email: guest.email,
        nationality: guest.nationality,
        documentNumberLast4: this.getDocumentNumberLast4(guest.documentNumber),
        notes: guest.notes,
        reservations,
        totalSpent,
        totalPendingAmount,
      },
    };
  }

  getCurrentStay(
    id: string,
  ): ApiSuccessResponse<{
    currentStay: GuestCurrentStay | null;
  }> {
    const guestId = this.parseGuestId(id);
    const guest = this.requireGuest(guestId);
    const reservation = this.getReservations().find(
      (item) => item.guestId === guestId && item.status === 'checked_in',
    );

    if (!reservation) {
      return {
        status: 'success',
        summary: `${guest.fullName} does not have a current stay.`,
        currentStay: null,
      };
    }

    const currentStay = this.toGuestReservationSummary(reservation);

    return {
      status: 'success',
      summary: `${guest.fullName} is currently staying in ${currentStay.room} until ${currentStay.checkOut}. Pending payment is ${currentStay.pendingAmount} BGN.`,
      currentStay,
    };
  }

  getGuestPayments(
    id: string,
  ): ApiSuccessResponse<{
    payments: GuestPaymentRecord[];
    totals: {
      paidAmount: number;
      pendingAmount: number;
      currency: 'BGN';
    };
  }> {
    const guestId = this.parseGuestId(id);
    const guest = this.requireGuest(guestId);
    const payments = this.getReservations()
      .filter((reservation) => reservation.guestId === guestId)
      .map((reservation) => ({
        reservationId: reservation.id,
        room: reservation.room,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        totalAmount: reservation.totalAmount,
        paidAmount: reservation.paidAmount,
        pendingAmount: calculatePendingAmount(reservation),
        paymentStatus: reservation.paymentStatus,
        currency: reservation.currency,
      }));

    const totals = {
      paidAmount: sumAmounts(payments.map((payment) => payment.paidAmount)),
      pendingAmount: sumAmounts(
        payments.map((payment) => payment.pendingAmount),
      ),
      currency: 'BGN' as const,
    };

    return {
      status: 'success',
      summary: `${guest.fullName} has paid ${totals.paidAmount} BGN and still owes ${totals.pendingAmount} BGN.`,
      payments,
      totals,
    };
  }

  getContactCard(
    id: string,
  ): ApiSuccessResponse<{
    contact: GuestContactCard;
  }> {
    const guestId = this.parseGuestId(id);
    const guest = this.requireGuest(guestId);
    const currentStay = this.getReservations().find(
      (reservation) =>
        reservation.guestId === guestId && reservation.status === 'checked_in',
    );

    const contact: GuestContactCard = {
      guestName: guest.fullName,
      phone: guest.phone,
      email: guest.email,
      currentRoom: currentStay?.room ?? null,
      currentStayDates: currentStay
        ? `${currentStay.checkIn} to ${currentStay.checkOut}`
        : null,
    };

    const summary = currentStay
      ? `${guest.fullName} is in ${currentStay.room}. Phone number is ${guest.phone}. Email is ${guest.email ?? 'not available'}.`
      : `${guest.fullName} is not currently checked in. Phone number is ${guest.phone}. Email is ${guest.email ?? 'not available'}.`;

    return {
      status: 'success',
      summary,
      contact,
    };
  }

  private requireGuest(id: number): Guest {
    const guest = mockGuests.find((item) => item.id === id);

    if (!guest) {
      throw new HttpException(
        {
          status: 'error',
          summary: `Guest with ID ${id} was not found.`,
          error: {
            code: 'GUEST_NOT_FOUND',
          },
        } satisfies ApiErrorResponse,
        HttpStatus.NOT_FOUND,
      );
    }

    return guest;
  }

  private parseGuestId(id: string): number {
    const parsed = Number(id);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new HttpException(
        {
          status: 'error',
          summary: 'Guest ID must be a positive integer.',
          error: {
            code: 'INVALID_GUEST_ID',
            details: `Received id "${id}".`,
          },
        } satisfies ApiErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }

    return parsed;
  }

  private buildGuestSearchResult(guest: Guest): GuestSearchResult {
    const reservations = this.getReservations().filter(
      (reservation) => reservation.guestId === guest.id,
    );

    return {
      guestName: guest.fullName,
      phone: guest.phone,
      email: guest.email,
      currentReservation:
        reservations
          .filter((reservation) => reservation.status === 'checked_in')
          .map((reservation) => this.toGuestReservationSummary(reservation))[0] ??
        null,
      upcomingReservations: reservations
        .filter((reservation) => reservation.status === 'confirmed')
        .map((reservation) => this.toGuestReservationSummary(reservation)),
      pastReservations: reservations
        .filter((reservation) => reservation.status === 'checked_out')
        .map((reservation) => this.toGuestReservationSummary(reservation)),
    };
  }

  private toGuestReservationSummary(
    reservation: Reservation,
  ): GuestReservationSummary {
    return {
      reservationId: reservation.id,
      room: reservation.room,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      paymentStatus: reservation.paymentStatus,
      pendingAmount: calculatePendingAmount(reservation),
    };
  }

  private toGuestDetailReservation(
    reservation: Reservation,
  ): GuestDetailReservation {
    return {
      ...this.toGuestReservationSummary(reservation),
      status: reservation.status,
      totalAmount: reservation.totalAmount,
      paidAmount: reservation.paidAmount,
      currency: reservation.currency,
    };
  }

  private getDocumentNumberLast4(documentNumber?: string): string | null {
    if (!documentNumber) {
      return null;
    }

    return documentNumber.slice(-4);
  }
}
