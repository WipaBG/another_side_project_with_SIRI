import { Injectable } from '@nestjs/common';
import {
  addDays,
  formatDate,
  isCheckOutOnDate,
  startOfLocalDay,
} from '../common/utils/date.utils';
import { buildCleaningSummary } from '../common/utils/summary.utils';
import { getMockReservations } from '../data/mock-reservations';
import { ApiSuccessResponse } from '../types/api-response.types';
import { CleaningTask } from '../types/task.types';

@Injectable()
export class TasksService {
  getTodayCleaningTasks(): ApiSuccessResponse<{
    date: string;
    tasks: CleaningTask[];
  }> {
    const today = startOfLocalDay(new Date());
    const reservations = getMockReservations();

    const checkoutTasks: CleaningTask[] = reservations
      .filter((reservation) => isCheckOutOnDate(reservation, today))
      .map((reservation) => ({
        room: reservation.room,
        reason: 'Guest checking out today',
        priority: 'high',
        previousGuest: reservation.guestName,
        nextCheckIn: null,
        status: 'pending',
      }));

    const tasks: CleaningTask[] = [
      ...checkoutTasks,
      {
        room: 'Room 5',
        reason: 'Deep cleaning after the last stay',
        priority: 'medium',
        previousGuest: 'Elena Ivanova',
        nextCheckIn: formatDate(addDays(today, 6)),
        status: 'in_progress',
      },
    ];

    return {
      status: 'success',
      date: formatDate(today),
      summary: buildCleaningSummary(tasks),
      tasks,
    };
  }
}
