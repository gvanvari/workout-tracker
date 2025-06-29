import { Exercise } from '../types/exercise';

const STORAGE_KEY = 'workoutData';

export function saveWorkoutData(data: Exercise[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export function getWorkoutData(): Exercise[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export function clearWorkoutData(): void{
    localStorage.removeItem(STORAGE_KEY);
};