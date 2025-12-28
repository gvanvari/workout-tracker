export function validateExercise(data: any): void {
  // Validate date format (YYYY-MM-DD)
  if (!data.date || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new Error('Invalid date format (YYYY-MM-DD)');
  }

  // Validate name
  if (!data.name || typeof data.name !== 'string' || data.name.length === 0 || data.name.length > 50) {
    throw new Error('Invalid exercise name (1-50 characters)');
  }

  // Validate sets
  if (!Number.isInteger(data.sets) || data.sets < 1 || data.sets > 20) {
    throw new Error('Sets must be between 1 and 20');
  }

  // Validate reps
  if (!data.reps || typeof data.reps !== 'string' || data.reps.length === 0) {
    throw new Error('Invalid reps format');
  }

  // Validate weight
  if (typeof data.weight !== 'number' || data.weight < 0 || data.weight > 1000) {
    throw new Error('Weight must be between 0 and 1000 lbs');
  }

  // Validate RPE
  if (!Number.isInteger(data.rpe) || data.rpe < 1 || data.rpe > 10) {
    throw new Error('RPE must be between 1 and 10');
  }

  // Optional notes validation
  if (data.notes && (typeof data.notes !== 'string' || data.notes.length > 500)) {
    throw new Error('Notes must be less than 500 characters');
  }
}

export function validatePassword(password: string): void {
  if (!password || typeof password !== 'string' || password.length === 0) {
    throw new Error('Password is required');
  }
}
