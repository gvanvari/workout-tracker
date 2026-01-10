import type { Workout } from './types';
import { updateNavButtons } from './loginPage';

export function renderDashboard(
  app: HTMLElement,
  workouts: Workout[]
): void {
  const lastWorkout = workouts.length > 0 ? workouts[0] : null;

  app.innerHTML = `
    <div class="header">
      <h1>💪 Workout Tracker</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>

    <div class="nav">
      <button class="nav-btn active" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn" onclick="goToPage('add')">Start Workout</button>
      <button class="nav-btn" onclick="goToPage('history')">History</button>
      <button class="nav-btn" onclick="goToPage('progress')">Progress</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <h3>Total Workouts</h3>
        <div class="value">${workouts.length}</div>
      </div>
      ${lastWorkout ? `
      <div class="stat-card">
        <h3>Last Workout</h3>
        <div class="value">${lastWorkout.workoutName}</div>
      </div>
      <div class="stat-card">
        <h3>Last Date</h3>
        <div class="value">${lastWorkout.date}</div>
      </div>
      ` : ''}
    </div>

    ${workouts.length === 0 ? `
    <div class="empty-state">
      <p>No workouts logged yet. Start by clicking "Start Workout"!</p>
    </div>
    ` : `
    <div class="workouts-list">
      <h2>Recent Workouts</h2>
      ${workouts.slice(0, 2).map(workout => `
        <div class="workout-card">
          <div class="workout-header">
            <h3>${workout.workoutName}</h3>
            <span class="workout-date">${workout.date}</span>
          </div>
          <div class="workout-exercises">
            ${(workout.exercises || []).map(ex => `
              <div class="exercise-item">
                <span class="exercise-name">${ex.name}</span>
                <span class="exercise-info">${ex.sets} sets</span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
    `}
  `;

  updateNavButtons('dashboard');
}
