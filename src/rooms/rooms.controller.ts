import { Controller, Get, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('status')
  getRoomStatus() {
    return this.roomsService.getRoomStatus();
  }

  @Get('availability')
  getAvailability(@Query('date') date?: string) {
    return this.roomsService.getAvailability(date);
  }
}
