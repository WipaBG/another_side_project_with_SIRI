import { Injectable } from '@nestjs/common';
import { ApiSuccessResponse } from '../types/api-response.types';
import { getMockReservations } from '../data/mock-reservations';
import { Reservation } from '../types/reservation.types';
import {
  addDays,
  formatDate,
  isCheckInOnDate,
  isCheckOutOnDate,
  isReservationActiveToday,
  startOfLocalDay,
} from '../common/utils/date.utils';
import { calculatePendingAmount } from '../common/utils/money.utils';
import {
  buildCheckInSummary,
  buildCheckOutSummary,
  buildReservationStatusSummary,
} from '../common/utils/summary.utils';

@Injectable()
export class ReservationsService {
  private getReservations(): Reservation[] {
    return getMockReservations();
  }

  getStatus(): ApiSuccessResponse<{
    date: string;
    stats: {
      activeReservations: number;
      checkInsToday: number;
      checkOutsToday: number;
      pendingPayments: number;
      occupiedRooms: number;
      availableRooms: number;
      roomsNeedingCleaning: number;
    };
  }> {
    const today = startOfLocalDay(new Date());
    const todayIso = formatDate(today);
    const reservations = this.getReservations();

    const activeReservations = reservations.filter((reservation) =>
      isReservationActiveToday(reservation, today),
    );
    const checkInsToday = reservations.filter((reservation) =>
      isCheckInOnDate(reservation, today),
    );
    const checkOutsToday = reservations.filter((reservation) =>
      isCheckOutOnDate(reservation, today),
    );
    const pendingPayments = reservations.filter(
      (reservation) => calculatePendingAmount(reservation) > 0,
    );

    const stats = {
      activeReservations: activeReservations.length,
      checkInsToday: checkInsToday.length,
      checkOutsToday: checkOutsToday.length,
      pendingPayments: pendingPayments.length,
      occupiedRooms: 2,
      availableRooms: 1,
      roomsNeedingCleaning: 1,
    };

    return {
      status: 'success',
      date: todayIso,
      summary: buildReservationStatusSummary(stats),
      stats,
    };
  }

  getTodayCheckIns(): ApiSuccessResponse<{
    date: string;
    checkIns: Reservation[];
  }> {
    return this.buildCheckInResponse(startOfLocalDay(new Date()), 'Today');
  }

  getTomorrowCheckIns(): ApiSuccessResponse<{
    date: string;
    checkIns: Reservation[];
  }> {
    const tomorrow = addDays(startOfLocalDay(new Date()), 1);
    return this.buildCheckInResponse(tomorrow, 'Tomorrow');
  }

  getTodayCheckOuts(): ApiSuccessResponse<{
    date: string;
    checkOuts: Reservation[];
  }> {
    const today = startOfLocalDay(new Date());
    const date = formatDate(today);
    const checkOuts = this.getReservations().filter((reservation) =>
      isCheckOutOnDate(reservation, today),
    );

    return {
      status: 'success',
      date,
      summary: buildCheckOutSummary(checkOuts),
      checkOuts,
    };
  }

  private buildCheckInResponse(
    targetDate: Date,
    label: 'Today' | 'Tomorrow',
  ): ApiSuccessResponse<{
    date: string;
    checkIns: Reservation[];
  }> {
    const date = formatDate(targetDate);
    const checkIns = this.getReservations().filter((reservation) =>
      isCheckInOnDate(reservation, targetDate),
    );

    return {
      status: 'success',
      date,
      summary: buildCheckInSummary(label, checkIns),
      checkIns,
    };
  }
}
