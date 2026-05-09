import { Controller, Get } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get('status')
  getStatus() {
    return this.reservationsService.getStatus();
  }

  @Get('check-ins/today')
  getTodayCheckIns() {
    return this.reservationsService.getTodayCheckIns();
  }

  @Get('check-outs/today')
  getTodayCheckOuts() {
    return this.reservationsService.getTodayCheckOuts();
  }

  @Get('check-ins/tomorrow')
  getTomorrowCheckIns() {
    return this.reservationsService.getTomorrowCheckIns();
  }
}
