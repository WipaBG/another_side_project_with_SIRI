import { Controller, Get, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('pending')
  getPendingPayments() {
    return this.paymentsService.getPendingPayments();
  }

  @Get('summary')
  getPaymentSummary(@Query('period') period?: string) {
    return this.paymentsService.getPaymentSummary(period);
  }
}
