import { Module } from '@nestjs/common';
import { GuestsModule } from './guests/guests.module';
import { PaymentsModule } from './payments/payments.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RoomsModule } from './rooms/rooms.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ReservationsModule,
    PaymentsModule,
    RoomsModule,
    TasksModule,
    GuestsModule,
  ],
})
export class AppModule {}
