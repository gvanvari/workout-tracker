import * as API from './api';

interface Exercise {
  id?: number;
  date: string;
  name: string;
  sets: number;
  reps: string;
  weight: number;
  rpe: number;
  notes?: string;
}

let token: string = '';
let currentPage: 'login' | 'dashboard' | 'add' | 'history' = 'login';
let exercises: Exercise[] = [];

const app = document.getElementById('app')!;

// ========== RENDER FUNCTIONS ==========

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
  const lastExercise = exercises.length > 0 ? exercises[0] : null;

  app.innerHTML = `
    <div class="header">
      <h1>💪 Workout Tracker</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>

    <div class="nav">
      <button class="nav-btn active" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn" onclick="goToPage('add')">Add Exercise</button>
      <button class="nav-btn" onclick="goToPage('history')">History</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>

    <div class="stats-container">
      <div class="stat-card">
        <h3>Total Exercises</h3>
        <div class="value">${exercises.length}</div>
      </div>
      ${lastExercise ? `
      <div class="stat-card">
        <h3>Last Workout</h3>
        <div class="value">${lastExercise.name}</div>
      </div>
      <div class="stat-card">
        <h3>Last Date</h3>
        <div class="value">${lastExercise.date}</div>
      </div>
      ` : ''}
    </div>

    ${exercises.length === 0 ? `
    <div class="empty-state">
      <p>No exercises logged yet. Start by adding your first workout!</p>
    </div>
    ` : `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Exercise</th>
            <th>Sets</th>
            <th>Reps</th>
            <th>Weight (lbs)</th>
            <th>RPE</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${exercises.slice(0, 10).map(ex => `
            <tr>
              <td>${ex.date}</td>
              <td>${ex.name}</td>
              <td>${ex.sets}</td>
              <td>${ex.reps}</td>
              <td>${ex.weight}</td>
              <td>${ex.rpe}</td>
              <td>${ex.notes || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    `}
  `;

  updateNavButtons();
}

function renderAddExercisePage() {
  const today = new Date().toISOString().split('T')[0];

  app.innerHTML = `
    <div class="header">
      <h1>💪 Workout Tracker</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>

    <div class="nav">
      <button class="nav-btn" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn active" onclick="goToPage('add')">Add Exercise</button>
      <button class="nav-btn" onclick="goToPage('history')">History</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>

    <div class="form-container">
      <h2>Add New Exercise</h2>
      <div id="add-error" class="alert alert-error hidden"></div>
      <div id="add-success" class="alert alert-success hidden"></div>

      <div class="form-row">
        <div class="form-group">
          <label for="date">Date:</label>
          <input type="date" id="date" value="${today}" required />
        </div>
        <div class="form-group">
          <label for="name">Exercise Name:</label>
          <input type="text" id="name" placeholder="e.g., Squat, Bench Press" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="sets">Sets:</label>
          <input type="number" id="sets" min="1" max="20" value="3" required />
        </div>
        <div class="form-group">
          <label for="reps">Reps (comma-separated):</label>
          <input type="text" id="reps" placeholder="e.g., 8,8,6" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="weight">Weight (lbs):</label>
          <input type="number" id="weight" min="0" max="1000" step="0.5" value="0" required />
        </div>
        <div class="form-group">
          <label for="rpe">RPE (1-10):</label>
          <input type="number" id="rpe" min="1" max="10" value="6" required />
        </div>
      </div>

      <div class="form-group">
        <label for="notes">Notes (optional):</label>
        <textarea id="notes" placeholder="Any notes about this workout..." rows="3"></textarea>
      </div>

      <div class="btn-group">
        <button class="btn-primary" onclick="handleAddExercise()" style="flex: 1;">Save Exercise</button>
        <button class="btn-secondary" onclick="goToPage('dashboard')" style="flex: 1;">Cancel</button>
      </div>
    </div>
  `;

  updateNavButtons();
}

function renderHistoryPage() {
  const uniqueExercises = [...new Set(exercises.map(e => e.name))];

  app.innerHTML = `
    <div class="header">
      <h1>💪 Workout Tracker</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>

    <div class="nav">
      <button class="nav-btn" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn" onclick="goToPage('add')">Add Exercise</button>
      <button class="nav-btn active" onclick="goToPage('history')">History</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>

    <div class="filter-container">
      <div class="form-group">
        <label for="filter-name">Filter by Exercise:</label>
        <select id="filter-name" onchange="handleHistoryFilter()">
          <option value="">All Exercises</option>
          ${uniqueExercises.map(name => `<option value="${name}">${name}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="table-container">
      ${exercises.length === 0 ? `
        <div class="empty-state">
          <p>No exercise history yet. Add your first workout!</p>
        </div>
      ` : `
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Exercise</th>
              <th>Sets</th>
              <th>Reps</th>
              <th>Weight (lbs)</th>
              <th>RPE</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${exercises.map(ex => `
              <tr>
                <td>${ex.date}</td>
                <td>${ex.name}</td>
                <td>${ex.sets}</td>
                <td>${ex.reps}</td>
                <td>${ex.weight}</td>
                <td>${ex.rpe}</td>
                <td>${ex.notes || '-'}</td>
                <td>
                  <button class="btn-danger" onclick="handleDeleteExercise(${ex.id})">Delete</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `}
    </div>
  `;

  updateNavButtons();
}

function updateNavButtons() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`.nav-btn[onclick="goToPage('${currentPage}')"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

// ========== EVENT HANDLERS ==========

async function handleLogin() {
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const errorDiv = document.getElementById('login-error')!;

  if (!password) {
    errorDiv.textContent = 'Password is required';
    errorDiv.classList.remove('hidden');
    return;
  }

  try {
    const result = await API.login(password);
    token = result.token;
    localStorage.setItem('token', token);
    currentPage = 'dashboard';
    await loadExercises();
    renderDashboard();
  } catch (error: any) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
}

function handleLogout() {
  token = '';
  localStorage.removeItem('token');
  currentPage = 'login';
  renderLoginPage();
}

async function handleAddExercise() {
  const date = (document.getElementById('date') as HTMLInputElement).value;
  const name = (document.getElementById('name') as HTMLInputElement).value;
  const sets = parseInt((document.getElementById('sets') as HTMLInputElement).value);
  const reps = (document.getElementById('reps') as HTMLInputElement).value;
  const weight = parseFloat((document.getElementById('weight') as HTMLInputElement).value);
  const rpe = parseInt((document.getElementById('rpe') as HTMLInputElement).value);
  const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;

  const errorDiv = document.getElementById('add-error')!;
  const successDiv = document.getElementById('add-success')!;

  errorDiv.classList.add('hidden');
  successDiv.classList.add('hidden');

  try {
    await API.addExercise(token, { date, name, sets, reps, weight, rpe, notes: notes || undefined });
    successDiv.textContent = 'Exercise added successfully!';
    successDiv.classList.remove('hidden');
    await loadExercises();
    setTimeout(() => goToPage('dashboard'), 1500);
  } catch (error: any) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
}

async function handleDeleteExercise(id: number) {
  if (!confirm('Are you sure you want to delete this exercise?')) return;

  try {
    await API.deleteExercise(token, id);
    await loadExercises();
    renderHistoryPage();
  } catch (error: any) {
    alert(`Error: ${error.message}`);
  }
}

function handleHistoryFilter() {
  renderHistoryPage();
}

async function handleExport() {
  try {
    const blob = await API.exportData(token);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workout-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error: any) {
    alert(`Export failed: ${error.message}`);
  }
}

function goToPage(page: 'login' | 'dashboard' | 'add' | 'history') {
  currentPage = page;
  switch (page) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'add':
      renderAddExercisePage();
      break;
    case 'history':
      renderHistoryPage();
      break;
  }
}

async function loadExercises() {
  try {
    exercises = await API.getExercises(token);
  } catch (error) {
    console.error('Failed to load exercises:', error);
  }
}

// ========== INITIALIZATION ==========

async function init() {
  const savedToken = localStorage.getItem('token');
  if (savedToken) {
    token = savedToken;
    currentPage = 'dashboard';
    try {
      await loadExercises();
      renderDashboard();
    } catch (error) {
      handleLogout();
    }
  } else {
    renderLoginPage();
  }
}

// Make functions global for onclick handlers
(window as any).handleLogin = handleLogin;
(window as any).handleLogout = handleLogout;
(window as any).handleAddExercise = handleAddExercise;
(window as any).handleDeleteExercise = handleDeleteExercise;
(window as any).handleHistoryFilter = handleHistoryFilter;
(window as any).handleExport = handleExport;
(window as any).goToPage = goToPage;

// Start app
init();
