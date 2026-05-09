import { Room } from '../types/room.types';

export const mockRooms: Room[] = [
  { id: 1, name: 'Room 1', capacity: 2 },
  { id: 2, name: 'Room 2', capacity: 3 },
  { id: 3, name: 'Room 3', capacity: 2, notes: 'Prepared for tomorrow arrival.' },
  { id: 4, name: 'Room 4', capacity: 4 },
  { id: 5, name: 'Room 5', capacity: 2, notes: 'Available after standard cleaning.' },
  { id: 6, name: 'Room 6', capacity: 2, notes: 'Air conditioning maintenance.' },
];
