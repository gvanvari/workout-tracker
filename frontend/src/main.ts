import * as API from './api';
import type { Workout, PageType } from './types';
import { isTokenExpired, handleLogin, handleLogout } from './auth';
import { renderDashboard } from './dashboard';
import { renderAddExercisePage, handleStartWorkout, handleAddExercise, handleFinishWorkout, handleDeleteExercise, handleExerciseInput, selectExercise, showAllExercises, updateSetInputs, attachSuggestionListeners } from './workout';
import { renderHistoryPage, handleDeleteWorkout as workoutDeleteHandler } from './history';
import { renderExerciseProgressPage, renderExerciseDetailPage, handleSelectExercise } from './progress';
import { handleExport } from './exportData';
import { renderLoginPage } from './loginPage';

let token: string = '';
let currentPage: PageType = 'login';
let workouts: Workout[] = [];
let currentWorkout: Workout | null = null;
let selectedExerciseName: string | null = null;

const app = document.getElementById('app')!;

// ===== HANDLERS =====

async function handleLoginClick(): Promise<void> {
  try {
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const errorDiv = document.getElementById('login-error')!;
    errorDiv.classList.add('hidden');

    token = await handleLogin(password);
    goToPage('dashboard');
    loadWorkouts();
  } catch (error: unknown) {
    const err = error as Error;
    const errorDiv = document.getElementById('login-error')!;
    errorDiv.textContent = err.message;
    errorDiv.classList.remove('hidden');
  }
}

function handleLogoutClick(): void {
  handleLogout();
  token = '';
  currentWorkout = null;
  goToPage('login');
}

async function handleStartWorkoutClick(): Promise<void> {
  try {
    const workout = await handleStartWorkout(token);
    currentWorkout = { ...workout, exercises: [] };
    currentPage = 'add';
    renderAddExercisePage(app, currentWorkout, workouts);
  } catch {
    // Error already displayed in handleStartWorkout
  }
}

async function handleAddExerciseClick(): Promise<void> {
  if (!currentWorkout) return;

  try {
    await handleAddExercise(token, currentWorkout, workouts);
    renderAddExercisePage(app, currentWorkout, workouts);
  } catch {
    // Error already displayed in handleAddExercise
  }
}

async function handleFinishWorkoutClick(): Promise<void> {
  if (!currentWorkout) return;

  try {
    await handleFinishWorkout(token, currentWorkout);
    currentWorkout = null;
    goToPage('dashboard');
    loadWorkouts();
  } catch (error: unknown) {
    console.error('Error finishing workout:', error);
  }
}

async function handleDeleteExerciseClick(id: number): Promise<void> {
  if (!currentWorkout) return;

  try {
    await handleDeleteExercise(token, currentWorkout, id);
    renderAddExercisePage(app, currentWorkout, workouts);
  } catch (error: unknown) {
    console.error('Error deleting exercise:', error);
  }
}

async function handleDeleteWorkoutClick(id: number): Promise<void> {
  try {
    await workoutDeleteHandler(token, id);
    loadWorkouts();
  } catch (error: unknown) {
    console.error('Error deleting workout:', error);
  }
}

async function handleExportClick(): Promise<void> {
  handleExport(token);
}

function handleExerciseInputClick(): void {
  handleExerciseInput(workouts);
}

function handleSelectExerciseClick(exerciseName: string): void {
  selectedExerciseName = exerciseName;
  handleSelectExercise(exerciseName);
  currentPage = 'exercise-detail';
  renderExerciseDetailPage(app, selectedExerciseName, workouts);
}

// ===== NAVIGATION =====

function goToPage(page: PageType): void {
  if (!token && page !== 'login') {
    goToPage('login');
    return;
  }
  currentPage = page;

  if (page === 'login') {
    renderLoginPage(app);
  } else if (page === 'dashboard') {
    renderDashboard(app, workouts);
    loadWorkouts();
  } else if (page === 'add') {
    renderAddExercisePage(app, currentWorkout, workouts);
  } else if (page === 'history') {
    renderHistoryPage(app, workouts);
    loadWorkouts();
  } else if (page === 'progress') {
    API.getWorkouts(token).then((data: Workout[]) => {
      workouts = data;
      renderExerciseProgressPage(app, workouts);
    }).catch((error: unknown) => {
      console.error('Failed to load workouts:', error);
      renderExerciseProgressPage(app, workouts);
    });
  } else if (page === 'exercise-detail') {
    renderExerciseDetailPage(app, selectedExerciseName, workouts);
  }
}

async function loadWorkouts(): Promise<void> {
  try {
    workouts = await API.getWorkouts(token);

    // Sort workouts by date (newest first)
    workouts.sort((a: Workout, b: Workout) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    if (currentPage === 'dashboard') renderDashboard(app, workouts);
    else if (currentPage === 'history') renderHistoryPage(app, workouts);
    else if (currentPage === 'progress') renderExerciseProgressPage(app, workouts);
  } catch (error: unknown) {
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
declare global {
  interface Window {
    handleLogin: typeof handleLoginClick;
    handleLogout: typeof handleLogoutClick;
    handleStartWorkout: typeof handleStartWorkoutClick;
    handleAddExercise: typeof handleAddExerciseClick;
    handleFinishWorkout: typeof handleFinishWorkoutClick;
    handleDeleteExercise: typeof handleDeleteExerciseClick;
    handleDeleteWorkout: typeof handleDeleteWorkoutClick;
    handleExport: typeof handleExportClick;
    goToPage: typeof goToPage;
    updateSetInputs: typeof updateSetInputs;
    handleExerciseInput: typeof handleExerciseInputClick;
    selectExercise: typeof selectExercise;
    showAllExercises: typeof showAllExercises;
    handleSelectExercise: typeof handleSelectExerciseClick;
    attachSuggestionListeners: typeof attachSuggestionListeners;
  }
}

window.handleLogin = handleLoginClick;
window.handleLogout = handleLogoutClick;
window.handleStartWorkout = handleStartWorkoutClick;
window.handleAddExercise = handleAddExerciseClick;
window.handleFinishWorkout = handleFinishWorkoutClick;
window.handleDeleteExercise = handleDeleteExerciseClick;
window.handleDeleteWorkout = handleDeleteWorkoutClick;
window.handleExport = handleExportClick;
window.goToPage = goToPage;
window.updateSetInputs = updateSetInputs;
window.handleExerciseInput = handleExerciseInputClick;
window.selectExercise = selectExercise;
window.showAllExercises = showAllExercises;
window.handleSelectExercise = handleSelectExerciseClick;
window.attachSuggestionListeners = attachSuggestionListeners;

// test
