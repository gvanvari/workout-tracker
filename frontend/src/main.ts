import * as API from './api';

interface Workout {
  id?: number;
  date: string;
  workoutName: string;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string;
  exercises?: Exercise[];
}

interface Exercise {
  id?: number;
  workoutId?: number;
  name: string;
  sets: number;
  setDetails?: string | any[] | null;
  notes?: string;
}

let token: string = '';
let currentPage: 'login' | 'dashboard' | 'add' | 'history' = 'login';
let workouts: Workout[] = [];
let currentWorkout: Workout | null = null;

const app = document.getElementById('app')!;

// Check token expiration
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) {
      return Date.now() > payload.exp * 1000;
    }
    return false;
  } catch {
    return true;
  }
}

// Format set details for display
function formatSetDetails(exercise: Exercise): string {
  if (!exercise.setDetails) return '-';
  try {
    const setDetails = typeof exercise.setDetails === 'string' ? JSON.parse(exercise.setDetails) : exercise.setDetails;
    if (!Array.isArray(setDetails) || setDetails.length === 0) return '-';
    return setDetails.map((set: any, idx: number) => `Set ${idx + 1}: ${set.weight} lbs, ${set.reps} reps, @RPE ${set.rpe}`).join('\n');
  } catch {
    return '-';
  }
}

// ===== PAGES =====

function renderLoginPage() {
  app.innerHTML = `
    <div class="login-container">
      <h2>💪 Workout Tracker</h2>
      <div class="form-container">
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" placeholder="Enter your password" />
        </div>
        <div id="login-error" class="alert alert-error hidden"></div>
        <button class="btn-primary" onclick="handleLogin()" style="width: 100%;">Login</button>
      </div>
    </div>
  `;
}

function renderDashboard() {
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

  updateNavButtons();
}

function renderStartWorkoutPage() {
  const today = new Date().toISOString().split('T')[0];

  app.innerHTML = `
    <div class="header">
      <h1>💪 Workout Tracker</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>

    <div class="nav">
      <button class="nav-btn" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn active" onclick="goToPage('add')">Start Workout</button>
      <button class="nav-btn" onclick="goToPage('history')">History</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>

    <div class="form-container">
      <h2>Start New Workout</h2>
      <div id="error" class="alert alert-error hidden"></div>

      <div class="form-row">
        <div class="form-group">
          <label for="date">Date:</label>
          <input type="date" id="date" value="${today}" required />
        </div>
        <div class="form-group">
          <label for="workoutName">Workout Type:</label>
          <select id="workoutName" required>
            <option value="">Select type</option>
            <option value="Core">Core</option>
            <option value="HIIT">HIIT</option>
            <option value="Upper Body">Upper Body</option>
            <option value="Push">Push</option>
            <option value="Pull">Pull</option>
            <option value="Mix">Mix</option>
            <option value="Legs">Legs</option>
            <option value="Cardio">Cardio</option>
          </select>
        </div>
      </div>

      <div class="btn-group">
        <button class="btn-primary" onclick="handleStartWorkout()" style="flex: 1;">Start Workout</button>
        <button class="btn-secondary" onclick="goToPage('dashboard')" style="flex: 1;">Cancel</button>
      </div>
    </div>
  `;

  updateNavButtons();
}

function renderAddExercisePage() {
  if (!currentWorkout) {
    renderStartWorkoutPage();
    return;
  }

  app.innerHTML = `
    <div class="header">
      <h1>💪 Workout Tracker - ${currentWorkout.workoutName}</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>

    <div class="nav">
      <button class="nav-btn" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn active" onclick="goToPage('add')">Add Exercise</button>
      <button class="nav-btn" onclick="goToPage('history')">History</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>

    <div class="form-container">
      <h2>Add Exercise to ${currentWorkout.workoutName}</h2>
      <p style="color: #666; margin-bottom: 20px;">Date: ${currentWorkout.date}</p>
      
      <div id="error" class="alert alert-error hidden"></div>
      <div id="success" class="alert alert-success hidden"></div>

      <div class="form-group">
        <label for="name">Exercise Name:</label>
        <input type="text" id="name" placeholder="e.g., Squat, Bench Press" required />
      </div>

      <div class="form-group">
        <label for="sets">Number of Sets:</label>
        <input type="number" id="sets" min="1" max="20" value="3" required onchange="updateSetInputs()" />
      </div>

      <div id="sets-container" class="sets-container"></div>

      <div class="form-group">
        <label for="notes">Notes (optional):</label>
        <textarea id="notes" placeholder="Any notes..." rows="2"></textarea>
      </div>

      <div class="btn-group">
        <button class="btn-primary" onclick="handleAddExercise()" style="flex: 1;">Add Exercise</button>
        <button class="btn-secondary" onclick="handleFinishWorkout()" style="flex: 1;">Finish Workout</button>
      </div>

      ${(currentWorkout.exercises || []).length > 0 ? `
        <div style="margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px;">
          <h3>Exercises in this workout:</h3>
          <ul style="list-style: none; padding: 0;">
            ${currentWorkout.exercises!.map(ex => `
              <li style="padding: 10px; background: #f9f9f9; margin-bottom: 10px; border-radius: 4px;">
                <strong>${ex.name}</strong> - ${ex.sets} sets
                <button class="btn-danger" onclick="handleDeleteExercise(${ex.id})" style="float: right; padding: 5px 10px; font-size: 12px;">Delete</button>
              </li>
            `).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;

  updateSetInputs();
  updateNavButtons();
}

function updateSetInputs() {
  const setsInput = document.getElementById('sets') as HTMLInputElement;
  const numSets = parseInt(setsInput.value);
  const container = document.getElementById('sets-container')!;

  container.innerHTML = '';

  for (let i = 1; i <= numSets; i++) {
    const setDiv = document.createElement('div');
    setDiv.className = 'set-card';
    setDiv.innerHTML = `
      <h4>Set ${i}</h4>
      <div class="form-row">
        <div class="form-group">
          <label for="reps-${i}">Reps:</label>
          <input type="number" id="reps-${i}" min="1" max="100" value="5" required />
        </div>
        <div class="form-group">
          <label for="weight-${i}">Weight (lbs):</label>
          <input type="number" id="weight-${i}" min="0.1" max="1000" step="0.5" value="20" required />
        </div>
        <div class="form-group">
          <label for="rpe-${i}">RPE (1-10):</label>
          <input type="number" id="rpe-${i}" min="1" max="10" value="6" required />
        </div>
      </div>
    `;
    container.appendChild(setDiv);
  }
}

function renderHistoryPage() {
  app.innerHTML = `
    <div class="header">
      <h1>💪 Workout Tracker</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>

    <div class="nav">
      <button class="nav-btn" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn" onclick="goToPage('add')">Start Workout</button>
      <button class="nav-btn active" onclick="goToPage('history')">History</button>
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

  updateNavButtons();
}

function updateNavButtons() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`[onclick="goToPage('${currentPage}')"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

// ===== HANDLERS =====

async function handleLogin() {
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const errorDiv = document.getElementById('login-error')!;

  try {
    errorDiv.classList.add('hidden');
    const result = await API.login(password);
    token = result.token;
    localStorage.setItem('token', token);
    goToPage('dashboard');
    loadWorkouts();
  } catch (error: any) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
}

function handleLogout() {
  token = '';
  localStorage.removeItem('token');
  currentWorkout = null;
  goToPage('login');
}

async function handleStartWorkout() {
  const date = (document.getElementById('date') as HTMLInputElement).value;
  const workoutName = (document.getElementById('workoutName') as HTMLSelectElement).value;
  const errorDiv = document.getElementById('error')!;

  if (!workoutName) {
    errorDiv.textContent = 'Please select a workout type';
    errorDiv.classList.remove('hidden');
    return;
  }

  try {
    errorDiv.classList.add('hidden');
    const workout = await API.createWorkout(token, { date, workoutName });
    currentWorkout = { ...workout, exercises: [] };
    currentPage = 'add';
    renderAddExercisePage();
  } catch (error: any) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
}

async function handleAddExercise() {
  if (!currentWorkout) return;

  const name = (document.getElementById('name') as HTMLInputElement).value;
  const sets = parseInt((document.getElementById('sets') as HTMLInputElement).value);
  const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;
  const errorDiv = document.getElementById('error')!;
  const successDiv = document.getElementById('success')!;

  errorDiv.classList.add('hidden');
  successDiv.classList.add('hidden');

  try {
    const setDetails: any[] = [];
    for (let i = 1; i <= sets; i++) {
      const reps = parseInt((document.getElementById(`reps-${i}`) as HTMLInputElement).value);
      const weight = parseFloat((document.getElementById(`weight-${i}`) as HTMLInputElement).value);
      const rpe = parseInt((document.getElementById(`rpe-${i}`) as HTMLInputElement).value);

      if (isNaN(reps) || reps <= 0) throw new Error(`Set ${i}: Reps must be positive`);
      if (isNaN(weight) || weight <= 0) throw new Error(`Set ${i}: Weight must be > 0`);
      if (isNaN(rpe) || rpe < 1 || rpe > 10) throw new Error(`Set ${i}: RPE must be 1-10`);

      setDetails.push({ reps, weight, rpe });
    }

    const exercise = await API.addExercise(token, {
      workoutId: currentWorkout.id,
      name,
      sets,
      setDetails,
      notes: notes || undefined
    });

    currentWorkout.exercises!.push(exercise);
    successDiv.textContent = 'Exercise added!';
    successDiv.classList.remove('hidden');

    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('notes') as HTMLTextAreaElement).value = '';
    renderAddExercisePage();
  } catch (error: any) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
}

async function handleFinishWorkout() {
  if (!currentWorkout) return;

  try {
    await API.finishWorkout(token, currentWorkout.id!);
    currentWorkout = null;
    goToPage('dashboard');
    loadWorkouts();
  } catch (error: any) {
    console.error('Error finishing workout:', error);
  }
}

async function handleDeleteExercise(id: number) {
  if (!currentWorkout || !confirm('Delete this exercise?')) return;

  try {
    await API.deleteExercise(token, id);
    currentWorkout.exercises = currentWorkout.exercises!.filter(e => e.id !== id);
    renderAddExercisePage();
  } catch (error: any) {
    console.error('Error deleting exercise:', error);
  }
}

async function handleDeleteWorkout(id: number) {
  if (!confirm('Delete this entire workout?')) return;

  try {
    await API.deleteWorkout(token, id);
    loadWorkouts();
  } catch (error: any) {
    console.error('Error deleting workout:', error);
  }
}

async function handleExport() {
  try {
    const blob = await API.exportData(token);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  } catch (error: any) {
    console.error('Export failed:', error);
  }
}

// ===== NAVIGATION =====

function goToPage(page: 'login' | 'dashboard' | 'add' | 'history') {
  if (!token && page !== 'login') {
    goToPage('login');
    return;
  }
  currentPage = page;
  
  if (page === 'login') renderLoginPage();
  else if (page === 'dashboard') renderDashboard();
  else if (page === 'add') renderAddExercisePage();
  else if (page === 'history') renderHistoryPage();
}

async function loadWorkouts() {
  try {
    workouts = await API.getWorkouts(token);
    if (currentPage === 'dashboard') renderDashboard();
    else if (currentPage === 'history') renderHistoryPage();
  } catch (error: any) {
    console.error('Failed to load workouts:', error);
  }
}

// ===== INIT =====

(function init() {
  const savedToken = localStorage.getItem('token');
  
  if (savedToken && !isTokenExpired(savedToken)) {
    token = savedToken;
    goToPage('dashboard');
    loadWorkouts();
  } else {
    localStorage.removeItem('token');
    goToPage('login');
  }
})();

// Export functions for global use
(window as any).handleLogin = handleLogin;
(window as any).handleLogout = handleLogout;
(window as any).handleStartWorkout = handleStartWorkout;
(window as any).handleAddExercise = handleAddExercise;
(window as any).handleFinishWorkout = handleFinishWorkout;
(window as any).handleDeleteExercise = handleDeleteExercise;
(window as any).handleDeleteWorkout = handleDeleteWorkout;
(window as any).handleExport = handleExport;
(window as any).goToPage = goToPage;
(window as any).updateSetInputs = updateSetInputs;
