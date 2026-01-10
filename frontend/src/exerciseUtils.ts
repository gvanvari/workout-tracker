import type { Workout } from './types';

export const PREDEFINED_EXERCISES = [
  'Chest Press Machine', 'Chest Press Dumbell', 'Chest Press Barbell', 'Incline Chest Press Dumbell',
  'Incline Chest Press Barbell', 'Decline Chest Press Barbell', 'Decline Chest Press Dumbell',
  'Back Lat Pulldown', 'Back Cable Row', 'Back Dumbell Row', 'Back Pull-ups', 'Back Chin-ups',
  'Back Overhead Pulldown', 'Bicep Curls', 'Bicep Hammer Curls', 'Bicep Concentration Curls',
  'Bicep Preacher Curls', 'Tricep Dips', 'Tricep Overhead Extension Dumbell', 'Tricep Rope Pushdown',
  'Shoulder Press', 'Shoulder Rear Delt Fly', 'Shoulder Lateral Raises Dumbell', 'Shoulder Front Raises Dumbell',
  'Squats', 'Pop Squats', 'Leg Press', 'Leg Curl', 'Leg Extension', 'Lunges', 'Side lunges', 'Calf Raises',
  'Deadlifts', 'Single leg deadlifts', 'Hip Thrusts', 'Glute Bridge',
  'Plank', 'Side Plank', 'Crunches', 'Russian Twists', 'Leg Raises',
  'Burpees', 'Mountain Climbers', 'Jumping Jacks'
];

export function normalizeExerciseName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[,!?.]/g, '');
}

export function levenshteinDistance(s1: string, s2: string): number {
  const str1 = normalizeExerciseName(s1);
  const str2 = normalizeExerciseName(s2);

  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

export function calculateSimilarity(input: string, pastExercise: string): number {
  const distance = levenshteinDistance(input, pastExercise);
  const maxLength = Math.max(normalizeExerciseName(input).length, normalizeExerciseName(pastExercise).length);
  if (maxLength === 0) return 100;
  return ((maxLength - distance) / maxLength) * 100;
}

export function getSuggestions(userInput: string, pastExercises: string[]): string[] {
  if (!userInput || userInput.length < 2) return [];

  return pastExercises
    .filter((ex, idx, arr) => arr.indexOf(ex) === idx)
    .map(ex => ({
      name: ex,
      similarity: calculateSimilarity(userInput, ex)
    }))
    .filter(s => s.similarity > 75)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3)
    .map(s => s.name);
}

export function getUniqueExercises(workouts: Workout[]): Array<{ name: string; count: number; maxWeight?: number }> {
  const exerciseMap = new Map<string, { name: string; count: number; maxWeight: number }>();

  workouts.forEach((workout) => {
    (workout.exercises || []).forEach(ex => {
      const normalized = ex.name.toLowerCase().trim();

      let maxWeight = 0;
      if (ex.setDetails) {
        try {
          const setDetails = typeof ex.setDetails === 'string' ? JSON.parse(ex.setDetails) : ex.setDetails;
          if (Array.isArray(setDetails)) {
            maxWeight = Math.max(...setDetails.map((s: { weight?: number; reps?: number; rpe?: number }) => s.weight || 0));
          }
        } catch { }
      }

      let foundKey: string | null = null;
      for (const [key] of exerciseMap) {
        const similarity = calculateSimilarity(normalized, key);
        if (similarity > 85) {
          foundKey = key;
          break;
        }
      }

      if (foundKey) {
        const current = exerciseMap.get(foundKey)!;
        current.count++;
        current.maxWeight = Math.max(current.maxWeight, maxWeight);
        if (ex.name.length > current.name.length) {
          current.name = ex.name;
        }
      } else {
        exerciseMap.set(normalized, { name: ex.name, count: 1, maxWeight });
      }
    });
  });

  const result = Array.from(exerciseMap.entries())
    .map(([_, data]) => data)
    .sort((a, b) => b.count - a.count);

  return result;
}

interface ExerciseHistoryEntry {
  date: string;
  workoutName: string;
  sets: number;
  setDetails: Array<{ weight: number; reps: number; rpe: number }>;
  notes?: string;
}

export function getExerciseHistory(exerciseName: string, workouts: Workout[]): ExerciseHistoryEntry[] {
  const normalized = exerciseName.toLowerCase().trim();
  const history: ExerciseHistoryEntry[] = [];

  workouts.forEach(workout => {
    (workout.exercises || []).forEach(ex => {
      const exNormalized = ex.name.toLowerCase().trim();
      const similarity = calculateSimilarity(exNormalized, normalized);
      if (similarity > 85) {
        try {
          const setDetails = typeof ex.setDetails === 'string' ? JSON.parse(ex.setDetails) : (ex.setDetails || []);
          history.push({
            date: workout.date,
            workoutName: workout.workoutName,
            sets: ex.sets,
            setDetails: Array.isArray(setDetails) ? (setDetails as Array<{ weight: number; reps: number; rpe: number }>) : [],
            notes: ex.notes
          });
        } catch {
          history.push({
            date: workout.date,
            workoutName: workout.workoutName,
            sets: ex.sets,
            setDetails: [],
            notes: ex.notes
          });
        }
      }
    });
  });

  return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
