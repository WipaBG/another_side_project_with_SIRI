export type RoomStatus =
  | 'available'
  | 'occupied'
  | 'reserved'
  | 'needs_cleaning'
  | 'maintenance';

export interface Room {
  id: number;
  name: string;
  capacity: number;
  status?: RoomStatus;
  notes?: string;
}

export interface RoomStatusItem {
  room: string;
  status: RoomStatus;
  currentGuest: string | null;
  checkOut: string | null;
  nextGuest: string | null;
  nextCheckIn: string | null;
}
