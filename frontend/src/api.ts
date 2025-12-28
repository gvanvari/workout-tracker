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
  return data;
}

export async function getExercises(token: string, filters?: { name?: string; startDate?: string; endDate?: string }): Promise<any[]> {
  const params = new URLSearchParams();
  if (filters?.name) params.append('name', filters.name);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const response = await fetch(`${API_URL}/exercises?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch exercises');
  }
  return data;
}

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

export async function updateExercise(token: string, id: number, exercise: any): Promise<any> {
  const response = await fetch(`${API_URL}/exercises/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(exercise)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update exercise');
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
