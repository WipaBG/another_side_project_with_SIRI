export type ReservationRecord = {
  id: number;
  guestName: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed';
  paymentStatus: 'paid' | 'pending';
};

export type ReservationStatusResponse = {
  status: 'success';
  date: string;
  summary: string;
  reservations: ReservationRecord[];
};
