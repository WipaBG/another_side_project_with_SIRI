import { Controller, Get } from '@nestjs/common';
import { ReservationStatusResponse } from './types/reservation-status-response.type';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('status')
  getStatus(): ReservationStatusResponse {
    return this.reservationsService.getStatus();
  }
}
