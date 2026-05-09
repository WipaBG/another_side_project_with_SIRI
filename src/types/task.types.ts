export type CleaningTaskStatus = 'pending' | 'in_progress' | 'completed';

export interface CleaningTask {
  room: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  previousGuest: string | null;
  nextCheckIn: string | null;
  status: CleaningTaskStatus;
}
