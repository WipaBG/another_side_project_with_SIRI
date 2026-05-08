import { Injectable } from '@nestjs/common';
import { ReservationStatusResponse } from './types/reservation-status-response.type';

@Injectable()
export class ReservationsService {
  getStatus(): ReservationStatusResponse {
    return {
      status: 'success',
      date: '2026-05-08',
      summary: 'Today you have 3 reservations, 2 check-ins, and 1 pending payment.',
      reservations: [
        {
          id: 1,
          guestName: 'Ivan Petrov',
          room: 'Room 2',
          checkIn: '2026-05-08',
          checkOut: '2026-05-10',
          status: 'confirmed',
          paymentStatus: 'paid',
        },
        {
          id: 2,
          guestName: 'Maria Georgieva',
          room: 'Room 4',
          checkIn: '2026-05-08',
          checkOut: '2026-05-09',
          status: 'confirmed',
          paymentStatus: 'pending',
        },
        {
          id: 3,
          guestName: 'John Smith',
          room: 'Room 1',
          checkIn: '2026-05-09',
          checkOut: '2026-05-12',
          status: 'confirmed',
          paymentStatus: 'paid',
        },
      ],
    };
  }
}
