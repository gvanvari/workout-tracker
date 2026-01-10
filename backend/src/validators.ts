export function validateWorkout(data: { date?: unknown; workoutName?: unknown }): void {
  // Validate date format (YYYY-MM-DD)
  if (!data.date || typeof data.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new Error('Invalid date format (YYYY-MM-DD)');
  }

  // Validate workout name
  if (!data.workoutName || typeof data.workoutName !== 'string' || data.workoutName.length === 0) {
    throw new Error('Workout name is required');
  }
}

export function validateExercise(data: { name?: unknown; sets?: unknown; setDetails?: unknown; notes?: unknown }): void {
  // Validate name
  if (!data.name || typeof data.name !== 'string' || data.name.length === 0 || data.name.length > 50) {
    throw new Error('Invalid exercise name (1-50 characters)');
  }

  // Validate sets
  if (typeof data.sets !== 'number' || !Number.isInteger(data.sets) || data.sets < 1 || data.sets > 20) {
    throw new Error('Sets must be between 1 and 20');
  }

  // Validate per-set data (required)
  if (!data.setDetails || !Array.isArray(data.setDetails)) {
    throw new Error('setDetails must be an array');
  }

  validateSetDetails(data.setDetails, data.sets);

  // Optional notes validation
  if (data.notes && (typeof data.notes !== 'string' || data.notes.length > 500)) {
    throw new Error('Notes must be less than 500 characters');
  }
}

// Validate per-set data structure
function validateSetDetails(setDetails: unknown, expectedSets: number): void {
  if (!Array.isArray(setDetails) || setDetails.length !== expectedSets) {
    throw new Error(`Must provide exactly ${expectedSets} sets of data`);
  }

  (setDetails as Array<{ reps?: unknown; weight?: unknown; rpe?: unknown }>).forEach((set: unknown, index: number) => {
    const typedSet = set as { reps?: unknown; weight?: unknown; rpe?: unknown };
    
    // Validate reps
    if (typeof typedSet.reps !== 'number' || !Number.isInteger(typedSet.reps) || typedSet.reps <= 0) {
      throw new Error(`Set ${index + 1}: Reps must be a positive integer`);
    }

    // Validate weight - MUST be > 0
    if (typeof typedSet.weight !== 'number' || typedSet.weight <= 0 || typedSet.weight > 1000) {
      throw new Error(`Set ${index + 1}: Weight must be greater than 0 and not exceed 1000 lbs`);
    }

    // Validate RPE
    if (typeof typedSet.rpe !== 'number' || !Number.isInteger(typedSet.rpe) || typedSet.rpe < 1 || typedSet.rpe > 10) {
      throw new Error(`Set ${index + 1}: RPE must be between 1 and 10`);
    }
  });
}

export function validatePassword(password: string): void {
  if (!password || typeof password !== 'string' || password.length === 0) {
    throw new Error('Password is required');
  }
}
