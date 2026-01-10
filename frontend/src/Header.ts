import type { PageType } from './types';

export function renderHeader(title: string = '💪 Workout Tracker'): string {
  return `
    <div class="header">
      <h1>${title}</h1>
      <button class="logout-btn" onclick="handleLogout()">Logout</button>
    </div>
  `;
}

export function renderNav(currentPage: PageType): string {
  return `
    <div class="nav">
      <button class="nav-btn${currentPage === 'dashboard' ? ' active' : ''}" onclick="goToPage('dashboard')">Dashboard</button>
      <button class="nav-btn${currentPage === 'add' ? ' active' : ''}" onclick="goToPage('add')">Start Workout</button>
      <button class="nav-btn${currentPage === 'history' ? ' active' : ''}" onclick="goToPage('history')">History</button>
      <button class="nav-btn${currentPage === 'progress' ? ' active' : ''}" onclick="goToPage('progress')">Progress</button>
      <button class="btn-secondary" onclick="handleExport()">Export Data</button>
    </div>
  `;
}

export function renderHeaderAndNav(currentPage: PageType, title?: string): string {
  return renderHeader(title) + renderNav(currentPage);
}
