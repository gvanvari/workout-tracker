import * as API from './api';
import type { Workout } from './types';
import { isTokenExpired, handleLogin as authHandleLogin, handleLogout as authHandleLogout } from './auth';
import { renderDashboard } from './dashboard';
import { renderStartWorkoutPage, renderAddExercisePage, handleStartWorkout as workoutHandleStartWorkout, handleAddExercise, handleFinishWorkout, handleDeleteExercise, handleExerciseInput, selectExercise, showAllExercises, updateSetInputs, attachSuggestionListeners } from './workout';
import { renderHistoryPage, handleDeleteWorkout } from './history';
import { renderExerciseProgressPage, renderExerciseDetailPage, handleSelectExercise } from './progress';
import { handleExport } from './exportData';
import { renderLoginPage } from './ui';

let token: string = '';
let currentPage: 'login' | 'dashboard' | 'add' | 'history' | 'progress' | 'exercise-detail' = 'login';
let workouts: Workout[] = [];
let currentWorkout: Workout | null = null;
let selectedExerciseName: string | null = null;

const app = document.getElementById('app')!;

// ===== HANDLERS =====

async function handleLogin() {
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const errorDiv = document.getElementById('login-error')!;

  authHandleLogin(password, (newToken: string) => {
    token = newToken;
    goToPage('dashboard');
    loadWorkouts();
  }, (error: string) => {
    errorDiv.textContent = error;
    errorDiv.classList.remove('hidden');
  });
}

function handleLogout() {
  authHandleLogout();
  token = '';
  currentWorkout = null;
  goToPage('login');
}

async function handleStartWorkout() {
  workoutHandleStartWorkout(token, (workout: Workout) => {
    currentWorkout = { ...workout, exercises: [] };
    currentPage = 'add';
    renderAddExercisePage(app, currentWorkout, workouts);
  }, (error: string) => {
    const errorDiv = document.getElementById('error')!;
    errorDiv.textContent = error;
    errorDiv.classList.remove('hidden');
  });
}

async function handleAddExerciseClick() {
  if (!currentWorkout) return;

  handleAddExercise(token, currentWorkout, workouts, () => {
    renderAddExercisePage(app, currentWorkout, workouts);
  }, (error: string) => {
    const errorDiv = document.getElementById('error')!;
    errorDiv.textContent = error;
    errorDiv.classList.remove('hidden');
  });
}

async function handleFinishWorkoutClick() {
  if (!currentWorkout) return;

  handleFinishWorkout(token, currentWorkout, () => {
    currentWorkout = null;
    goToPage('dashboard');
    loadWorkouts();
  });
}

async function handleDeleteExerciseClick(id: number) {
  if (!currentWorkout) return;

  handleDeleteExercise(token, currentWorkout, id, () => {
    renderAddExercisePage(app, currentWorkout, workouts);
  });
}

async function handleDeleteWorkoutClick(id: number) {
  handleDeleteWorkout(token, id, () => {
    loadWorkouts();
  });
}

async function handleExportClick() {
  handleExport(token);
}

function handleExerciseInputClick() {
  handleExerciseInput(workouts);
}

function handleSelectExerciseClick(exerciseName: string) {
  handleSelectExercise(exerciseName, (name: string) => {
    selectedExerciseName = name;
    currentPage = 'exercise-detail';
    renderExerciseDetailPage(app, selectedExerciseName, workouts);
  });
}

// ===== NAVIGATION =====

function goToPage(page: 'login' | 'dashboard' | 'add' | 'history' | 'progress' | 'exercise-detail') {
  if (!token && page !== 'login') {
    goToPage('login');
    return;
  }
  currentPage = page;

  if (page === 'login') {
    renderLoginPage(app);
  } else if (page === 'dashboard') {
    renderDashboard(app, workouts, goToPage);
    loadWorkouts();
  } else if (page === 'add') {
    renderAddExercisePage(app, currentWorkout, workouts);
  } else if (page === 'history') {
    renderHistoryPage(app, workouts);
    loadWorkouts();
  } else if (page === 'progress') {
    API.getWorkouts(token).then(data => {
      workouts = data;
      renderExerciseProgressPage(app, workouts);
    }).catch(error => {
      console.error('Failed to load workouts:', error);
      renderExerciseProgressPage(app, workouts);
    });
  } else if (page === 'exercise-detail') {
    renderExerciseDetailPage(app, selectedExerciseName, workouts);
  }
}

async function loadWorkouts() {
  try {
    workouts = await API.getWorkouts(token);

    // Sort workouts by date (newest first)
    workouts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

    if (currentPage === 'dashboard') renderDashboard(app, workouts, goToPage);
    else if (currentPage === 'history') renderHistoryPage(app, workouts);
    else if (currentPage === 'progress') renderExerciseProgressPage(app, workouts);
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
(window as any).handleAddExercise = handleAddExerciseClick;
(window as any).handleFinishWorkout = handleFinishWorkoutClick;
(window as any).handleDeleteExercise = handleDeleteExerciseClick;
(window as any).handleDeleteWorkout = handleDeleteWorkoutClick;
(window as any).handleExport = handleExportClick;
(window as any).goToPage = goToPage;
(window as any).updateSetInputs = updateSetInputs;
(window as any).handleExerciseInput = handleExerciseInputClick;
(window as any).selectExercise = selectExercise;
(window as any).showAllExercises = showAllExercises;
(window as any).handleSelectExercise = handleSelectExerciseClick;
(window as any).attachSuggestionListeners = attachSuggestionListeners;
