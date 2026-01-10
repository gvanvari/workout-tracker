export interface Workout {
  id?: number;
  date: string;
  workoutName: string;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id?: number;
  workoutId?: number;
  name: string;
  sets: number;
  setDetails?: string | Array<{ weight: number; reps: number; rpe: number }> | null;
  notes?: string;
}

export type PageType = 'login' | 'dashboard' | 'add' | 'history' | 'progress' | 'exercise-detail';
