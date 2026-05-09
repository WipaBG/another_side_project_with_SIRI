import { Controller, Get, Param, Query } from '@nestjs/common';
import { GuestsService } from './guests.service';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Get('search')
  searchGuests(@Query('name') name?: string) {
    return this.guestsService.searchGuests(name);
  }

  @Get(':id')
  getGuestById(@Param('id') id: string) {
    return this.guestsService.getGuestById(id);
  }

  @Get(':id/current-stay')
  getCurrentStay(@Param('id') id: string) {
    return this.guestsService.getCurrentStay(id);
  }

  @Get(':id/payments')
  getGuestPayments(@Param('id') id: string) {
    return this.guestsService.getGuestPayments(id);
  }

  @Get(':id/contact-card')
  getContactCard(@Param('id') id: string) {
    return this.guestsService.getContactCard(id);
  }
}
