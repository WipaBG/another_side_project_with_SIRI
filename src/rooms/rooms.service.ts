import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  addDays,
  formatDate,
  isCheckOutOnDate,
  isReservationActiveToday,
  overlapsDate,
  parseIsoDate,
  startOfLocalDay,
} from '../common/utils/date.utils';
import {
  buildAvailabilitySummary,
  buildRoomStatusSummary,
} from '../common/utils/summary.utils';
import { getMockReservations } from '../data/mock-reservations';
import { mockRooms } from '../data/mock-rooms';
import {
  ApiErrorResponse,
  ApiSuccessResponse,
} from '../types/api-response.types';
import { Reservation } from '../types/reservation.types';
import { RoomStatusItem } from '../types/room.types';

@Injectable()
export class RoomsService {
  private getReservations(): Reservation[] {
    return getMockReservations();
  }

  getRoomStatus(): ApiSuccessResponse<{
    date: string;
    rooms: RoomStatusItem[];
  }> {
    const today = startOfLocalDay(new Date());
    const date = formatDate(today);
    const reservations = this.getReservations();

    const rooms = mockRooms.map((room) => {
      const currentReservation = reservations.find(
        (reservation) =>
          reservation.room === room.name && isReservationActiveToday(reservation, today),
      );
      const nextReservation = reservations.find(
        (reservation) =>
          reservation.room === room.name &&
          reservation.checkIn > date &&
          reservation.status !== 'cancelled',
      );

      if (room.name === 'Room 6') {
        return {
          room: room.name,
          status: 'maintenance',
          currentGuest: null,
          checkOut: null,
          nextGuest: null,
          nextCheckIn: null,
        } as RoomStatusItem;
      }

      if (
        currentReservation &&
        isCheckOutOnDate(currentReservation, today) &&
        room.name === 'Room 1'
      ) {
        return {
          room: room.name,
          status: 'needs_cleaning',
          currentGuest: currentReservation.guestName,
          checkOut: currentReservation.checkOut,
          nextGuest: nextReservation?.guestName ?? null,
          nextCheckIn: nextReservation?.checkIn ?? null,
        } as RoomStatusItem;
      }

      if (currentReservation) {
        return {
          room: room.name,
          status: 'occupied',
          currentGuest: currentReservation.guestName,
          checkOut: currentReservation.checkOut,
          nextGuest: nextReservation?.guestName ?? null,
          nextCheckIn: nextReservation?.checkIn ?? null,
        } as RoomStatusItem;
      }

      if (nextReservation?.checkIn === formatDate(addDays(today, 1))) {
        return {
          room: room.name,
          status: 'reserved',
          currentGuest: null,
          checkOut: null,
          nextGuest: nextReservation.guestName,
          nextCheckIn: nextReservation.checkIn,
        } as RoomStatusItem;
      }

      return {
        room: room.name,
        status: 'available',
        currentGuest: null,
        checkOut: null,
        nextGuest: nextReservation?.guestName ?? null,
        nextCheckIn: nextReservation?.checkIn ?? null,
      } as RoomStatusItem;
    });

    return {
      status: 'success',
      date,
      summary: buildRoomStatusSummary(rooms),
      rooms,
    };
  }

  getAvailability(
    date?: string,
  ): ApiSuccessResponse<{
    date: string;
    availableRooms: string[];
    occupiedRooms: string[];
  }> {
    if (!date) {
      throw new HttpException(
        {
          status: 'error',
          summary: 'Date query parameter is required in YYYY-MM-DD format.',
          error: {
            code: 'MISSING_DATE',
          },
        } satisfies ApiErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }

    const targetDate = parseIsoDate(date);

    if (!targetDate) {
      throw new HttpException(
        {
          status: 'error',
          summary: 'Invalid date format. Use YYYY-MM-DD for room availability.',
          error: {
            code: 'INVALID_DATE',
            details: `Received date "${date}".`,
          },
        } satisfies ApiErrorResponse,
        HttpStatus.BAD_REQUEST,
      );
    }

    const reservations = this.getReservations();
    const occupiedRooms = mockRooms
      .filter((room) => room.name !== 'Room 6')
      .filter((room) =>
        reservations.some(
          (reservation) =>
            reservation.room === room.name && overlapsDate(reservation, targetDate),
        ),
      )
      .map((room) => room.name);
    const availableRooms = mockRooms
      .filter((room) => room.name !== 'Room 6')
      .map((room) => room.name)
      .filter((room) => !occupiedRooms.includes(room));

    return {
      status: 'success',
      date,
      summary: buildAvailabilitySummary(date, availableRooms),
      availableRooms,
      occupiedRooms,
    };
  }
}
