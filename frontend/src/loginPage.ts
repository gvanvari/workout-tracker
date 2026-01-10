export function updateNavButtons(currentPage: string): void {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`[onclick="goToPage('${currentPage}')"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

export function renderLoginPage(app: HTMLElement): void {
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
