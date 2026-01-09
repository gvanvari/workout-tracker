import * as API from './api';
import type { Workout, Exercise } from './types';
import { updateNavButtons } from './ui';
import { getSuggestions, normalizeExerciseName, PREDEFINED_EXERCISES } from './exerciseUtils';

export function renderStartWorkoutPage(app: HTMLElement) {
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
      <button class="nav-btn" onclick="goToPage('progress')">Progress</button>
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

  updateNavButtons('add');
}

export function renderAddExercisePage(
  app: HTMLElement,
  currentWorkout: Workout | null,
  workouts: Workout[]
) {
  if (!currentWorkout) {
    renderStartWorkoutPage(app);
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
      <button class="nav-btn" onclick="goToPage('progress')">Progress</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>

    <div class="form-container">
      <h2>Add Exercise to ${currentWorkout.workoutName}</h2>
      <p style="color: #666; margin-bottom: 20px;">Date: ${currentWorkout.date}</p>
      
      <div id="error" class="alert alert-error hidden"></div>
      <div id="success" class="alert alert-success hidden"></div>

      <div class="form-group">
        <label for="name">Exercise Name:</label>
        <div class="exercise-input-wrapper">
          <input type="text" id="name" placeholder="Search or type exercise..." required oninput="handleExerciseInput()" />
          <div id="exercise-suggestions" class="exercise-suggestions hidden"></div>
        </div>
        <div class="predefined-exercises-hint">
          <small>Quick select: </small>
          <div class="predefined-buttons">
            ${PREDEFINED_EXERCISES.slice(0, 5).map(ex => `
              <button type="button" class="predefined-btn" onclick="selectExercise('${ex}')">${ex}</button>
            `).join('')}
            <button type="button" class="predefined-btn more-btn" onclick="showAllExercises()">+${PREDEFINED_EXERCISES.length - 5} more</button>
          </div>
        </div>
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
  updateNavButtons('add');
}

export function updateSetInputs() {
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

export async function handleStartWorkout(
  token: string
): Promise<Workout> {
  const date = (document.getElementById('date') as HTMLInputElement).value;
  const workoutName = (document.getElementById('workoutName') as HTMLSelectElement).value;
  const errorDiv = document.getElementById('error')!;

  if (!workoutName) {
    throw new Error('Please select a workout type');
  }

  try {
    errorDiv.classList.add('hidden');
    const workout = await API.createWorkout(token, { date, workoutName });
    return workout;
  } catch (error: any) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
    throw error;
  }
}

export async function handleAddExercise(
  token: string,
  currentWorkout: Workout,
  workouts: Workout[]
): Promise<void> {
  let name = (document.getElementById('name') as HTMLInputElement).value;
  const sets = parseInt((document.getElementById('sets') as HTMLInputElement).value);
  const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;
  const errorDiv = document.getElementById('error')!;
  const successDiv = document.getElementById('success')!;

  errorDiv.classList.add('hidden');
  successDiv.classList.add('hidden');

  name = normalizeExerciseName(name);

  if (!name) {
    throw new Error('Please enter an exercise name');
  }

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
  } catch (error: any) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
    throw error;
  }
}

export async function handleFinishWorkout(
  token: string,
  currentWorkout: Workout
): Promise<void> {
  await API.finishWorkout(token, currentWorkout.id!);
}

export async function handleDeleteExercise(
  token: string,
  currentWorkout: Workout,
  exerciseId: number
): Promise<void> {
  if (!confirm('Delete this exercise?')) return;

  await API.deleteExercise(token, exerciseId);
  currentWorkout.exercises = currentWorkout.exercises!.filter(e => e.id !== exerciseId);
}

export function handleExerciseInput(workouts: Workout[]) {
  const input = (document.getElementById('name') as HTMLInputElement).value;
  const suggestionsDiv = document.getElementById('exercise-suggestions')!;

  if (!input || input.length < 2) {
    suggestionsDiv.classList.add('hidden');
    return;
  }

  const pastExercises = workouts
    .flatMap(w => (w.exercises || []).map(e => e.name))
    .filter((name, idx, arr) => arr.indexOf(name) === idx);

  const pastSuggestions = getSuggestions(input, pastExercises);
  const predefinedSuggestions = getSuggestions(input, PREDEFINED_EXERCISES);

  const allSuggestions = Array.from(
    new Set([...pastSuggestions, ...predefinedSuggestions])
  );

  if (allSuggestions.length === 0) {
    suggestionsDiv.classList.add('hidden');
    return;
  }

  suggestionsDiv.innerHTML = allSuggestions
    .map(suggestion => `<div class="suggestion-item" data-exercise="${suggestion}">${suggestion}</div>`)
    .join('');

  attachSuggestionListeners(suggestionsDiv);
  suggestionsDiv.classList.remove('hidden');
}

export function attachSuggestionListeners(suggestionsDiv: HTMLElement) {
  const items = suggestionsDiv.querySelectorAll('.suggestion-item');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const exerciseName = item.getAttribute('data-exercise');
      if (exerciseName) {
        selectExercise(exerciseName);
      }
    });
  });
}

export function selectExercise(exerciseName: string) {
  const input = document.getElementById('name') as HTMLInputElement;
  if (!input) return;

  input.value = exerciseName;

  const suggestionsDiv = document.getElementById('exercise-suggestions')!;
  if (!suggestionsDiv) return;

  suggestionsDiv.classList.add('hidden');
}

export function showAllExercises() {
  const suggestionsDiv = document.getElementById('exercise-suggestions')!;
  suggestionsDiv.innerHTML = PREDEFINED_EXERCISES
    .map(ex => `<div class="suggestion-item" data-exercise="${ex}">${ex}</div>`)
    .join('');

  attachSuggestionListeners(suggestionsDiv);
  suggestionsDiv.classList.remove('hidden');
}
