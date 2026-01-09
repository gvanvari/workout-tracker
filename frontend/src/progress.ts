import type { Workout } from './types';
import { updateNavButtons } from './ui';
import { getUniqueExercises, getExerciseHistory } from './exerciseUtils';

export function renderExerciseProgressPage(app: HTMLElement, workouts: Workout[]) {
  const exercises = getUniqueExercises(workouts);

  app.innerHTML = `
    <div class="header">
      <h1>💪 Workout Tracker</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>

    <div class="nav">
      <button class="nav-btn" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn" onclick="goToPage('add')">Start Workout</button>
      <button class="nav-btn" onclick="goToPage('history')">History</button>
      <button class="nav-btn active" onclick="goToPage('progress')">Progress</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>

    <div class="progress-container">
      <h2>Exercise Progress</h2>
      <p style="color: #666; margin-bottom: 20px;">Track your exercises across all workouts</p>

      ${exercises.length === 0 ? `
        <div class="empty-state">
          <p>No exercises recorded yet.</p>
        </div>
      ` : `
        <div class="exercise-progress-list">
          ${exercises.map(ex => `
            <div class="exercise-progress-card" onclick="handleSelectExercise('${ex.name.replace(/'/g, "\\'")}')">
              <div class="exercise-progress-header">
                <h3>${ex.name}</h3>
                <span class="exercise-count">${ex.count} workouts</span>
              </div>
              <div class="exercise-progress-stats">
                ${ex.maxWeight ? `<div class="stat">Max Weight: <strong>${ex.maxWeight} lbs</strong></div>` : ''}
              </div>
              <div class="exercise-progress-action">View Details →</div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  updateNavButtons('progress');
}

export function renderExerciseDetailPage(
  app: HTMLElement,
  selectedExerciseName: string | null,
  workouts: Workout[]
) {
  if (!selectedExerciseName) {
    renderExerciseProgressPage(app, workouts);
    return;
  }

  const history = getExerciseHistory(selectedExerciseName, workouts);

  app.innerHTML = `
    <div class="header">
      <h1>💪 Workout Tracker</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>

    <div class="nav">
      <button class="nav-btn" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn" onclick="goToPage('add')">Start Workout</button>
      <button class="nav-btn" onclick="goToPage('history')">History</button>
      <button class="nav-btn active" onclick="goToPage('progress')">Progress</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>

    <div class="progress-container">
      <button class="btn-secondary" onclick="goToPage('progress')" style="margin-bottom: 20px;">← Back</button>
      
      <h2>${selectedExerciseName}</h2>
      <p style="color: #666; margin-bottom: 20px;">${history.length} recorded instance${history.length !== 1 ? 's' : ''}</p>

      ${history.length === 0 ? `
        <div class="empty-state">
          <p>No history found for this exercise.</p>
        </div>
      ` : `
        <div class="exercise-detail-list">
          ${history.map((instance, idx) => `
            <div class="exercise-instance-card">
              <div class="instance-header">
                <span class="instance-date">${instance.date}</span>
                <span class="instance-workout">${instance.workoutName}</span>
              </div>
              <div class="instance-sets">
                ${instance.setDetails.length > 0 ? instance.setDetails.map((set, setIdx) => `
                  <div class="instance-set">
                    <span class="set-num">Set ${setIdx + 1}:</span>
                    <span class="set-data">${set.weight} lbs × ${set.reps} reps @ RPE ${set.rpe}</span>
                  </div>
                `).join('') : `
                  <div class="instance-set">
                    <span style="color: #999;">No set details</span>
                  </div>
                `}
              </div>
              ${instance.notes ? `<div class="instance-notes">📝 ${instance.notes}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  updateNavButtons('progress');
}

export function handleSelectExercise(exerciseName: string, onSuccess: (name: string) => void) {
  onSuccess(exerciseName);
}
