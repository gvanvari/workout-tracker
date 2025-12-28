const API_URL = 'http://localhost:4000/api';

export async function login(password: string): Promise<{ token: string; success: boolean }> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  localStorage.setItem('token', data.token);
  return data;
}

// ===== WORKOUT API =====

export async function getWorkouts(token: string): Promise<any[]> {
  const response = await fetch(`${API_URL}/workouts`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch workouts');
  }
  return data;
}

export async function createWorkout(token: string, workout: any): Promise<any> {
  const response = await fetch(`${API_URL}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(workout)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create workout');
  }
  return data;
}

export async function finishWorkout(token: string, workoutId: number, endTime?: string): Promise<any> {
  const response = await fetch(`${API_URL}/workouts/${workoutId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ endTime })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to finish workout');
  }
  return data;
}

export async function deleteWorkout(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/workouts/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete workout');
  }
}

// ===== EXERCISE API =====

export async function addExercise(token: string, exercise: any): Promise<any> {
  const response = await fetch(`${API_URL}/exercises`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(exercise)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to add exercise');
  }
  return data;
}

export async function deleteExercise(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/exercises/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to delete exercise');
  }
}

export async function exportData(token: string): Promise<Blob> {
  const response = await fetch(`${API_URL}/backup/export`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error('Failed to export data');
  }
  return await response.blob();
}
