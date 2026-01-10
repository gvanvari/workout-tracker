import * as API from './api';
import type { Workout } from './types';
import { updateNavButtons } from './loginPage';

export function renderHistoryPage(app: HTMLElement, workouts: Workout[]): void {
  app.innerHTML = `
    <div class="header">
      <h1>💪 Workout Tracker</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>

    <div class="nav">
      <button class="nav-btn" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn" onclick="goToPage('add')">Start Workout</button>
      <button class="nav-btn active" onclick="goToPage('history')">History</button>
      <button class="nav-btn" onclick="goToPage('progress')">Progress</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>

    <div class="table-container">
      ${workouts.length === 0 ? `
        <div class="empty-state">
          <p>No workout history yet.</p>
        </div>
      ` : `
        <div class="history-list">
          ${workouts.map(workout => `
            <div class="workout-history-card">
              <div class="workout-history-header">
                <h3>${workout.date} - ${workout.workoutName}</h3>
                <button class="btn-danger" onclick="handleDeleteWorkout(${workout.id})" style="padding: 5px 10px; font-size: 12px;">Delete</button>
              </div>
              <div class="workout-history-exercises">
                ${(workout.exercises || []).length === 0 ? `
                  <p style="color: #999;">No exercises recorded</p>
                ` : (workout.exercises || []).map(ex => `
                  <div class="exercise-detail-card">
                    <h4>${ex.name}</h4>
                    ${(() => {
                      try {
                        const setDetails = typeof ex.setDetails === 'string' ? JSON.parse(ex.setDetails) : ex.setDetails;
                        if (Array.isArray(setDetails) && setDetails.length > 0) {
                          return setDetails.map((set, idx) => `
                            <div class="set-detail">
                              <span class="set-label">Set ${idx + 1}:</span>
                              <span class="set-info">${set.weight} lbs, ${set.reps} reps, @RPE ${set.rpe}</span>
                            </div>
                          `).join('');
                        }
                        return '<p style="color: #999; font-size: 12px;">No set details</p>';
                      } catch {
                        return '<p style="color: #999; font-size: 12px;">No set details</p>';
                      }
                    })()}
                    ${ex.notes ? `<p class="exercise-notes"><small>Notes: ${ex.notes}</small></p>` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  updateNavButtons('history');
}

export async function handleDeleteWorkout(
  token: string,
  workoutId: number
): Promise<void> {
  if (!confirm('Delete this entire workout?')) return;

  await API.deleteWorkout(token, workoutId);
}
