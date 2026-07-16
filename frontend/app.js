/* ═══════════════════════════════════════════════════════════════
   FocusPlanner — app.js
   API base: http://localhost:8080
═══════════════════════════════════════════════════════════════ */

const API = 'http://localhost:8080';

// ── State ────────────────────────────────────────────────────────────────
let token = localStorage.getItem('fp_token') || null;
let currentUser = JSON.parse(localStorage.getItem('fp_user') || 'null');
let currentView = 'dashboard';
let editingTaskId = null;
let completingTaskId = null;
let allTasks = [];

// ── Init ─────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  if (token && currentUser) {
    showApp();
    loadDashboard();
  } else {
    showAuth();
  }
});

// ── Screen toggles ────────────────────────────────────────────────────────
function showAuth() {
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('app-screen').classList.add('hidden');
}

function showApp() {
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('app-screen').classList.remove('hidden');
  if (currentUser) {
    const initials = (currentUser.name || currentUser.email || 'U').charAt(0).toUpperCase();
    document.getElementById('user-avatar').textContent = initials;
    document.getElementById('user-name-display').textContent = currentUser.name || currentUser.email;
  }
}

// ── Auth Tabs ─────────────────────────────────────────────────────────────
function showTab(tab) {
  document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
  document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('login-error').classList.add('hidden');
  document.getElementById('register-error').classList.add('hidden');
}

function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') { input.type = 'text'; btn.textContent = '🙈'; }
  else { input.type = 'password'; btn.textContent = '👁'; }
}

// ── Login ─────────────────────────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('login-btn');
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');
  setLoading(btn, true);

  try {
    const data = await apiPost('/api/auth/login', {
      email: document.getElementById('login-email').value.trim(),
      password: document.getElementById('login-password').value,
    });
    saveSession(data);
    showApp();
    showView('dashboard');
    loadDashboard();
    toast('Welcome back! 👋', 'success');
  } catch (err) {
    errEl.textContent = err.message || 'Invalid credentials. Please try again.';
    errEl.classList.remove('hidden');
  } finally {
    setLoading(btn, false);
  }
}

// ── Register ──────────────────────────────────────────────────────────────
async function handleRegister(e) {
  e.preventDefault();
  const btn = document.getElementById('register-btn');
  const errEl = document.getElementById('register-error');
  errEl.classList.add('hidden');
  setLoading(btn, true);

  try {
    const data = await apiPost('/api/auth/register', {
      name: document.getElementById('reg-name').value.trim(),
      email: document.getElementById('reg-email').value.trim(),
      password: document.getElementById('reg-password').value,
    });
    saveSession(data);
    showApp();
    showView('dashboard');
    loadDashboard();
    toast('Account created! Let\'s get focused 🎯', 'success');
  } catch (err) {
    errEl.textContent = err.message || 'Registration failed. Please try again.';
    errEl.classList.remove('hidden');
  } finally {
    setLoading(btn, false);
  }
}

function saveSession(data) {
  token = data.accessToken;
  currentUser = data.user;
  localStorage.setItem('fp_token', token);
  localStorage.setItem('fp_user', JSON.stringify(currentUser));
}

function handleLogout() {
  token = null;
  currentUser = null;
  allTasks = [];
  localStorage.removeItem('fp_token');
  localStorage.removeItem('fp_user');
  showAuth();
  toast('Signed out. See you soon!', 'info');
}

// ── Navigation ────────────────────────────────────────────────────────────
function showView(view) {
  currentView = view;

  // Update nav
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById(`nav-${view}`);
  if (navEl) navEl.classList.add('active');

  // Toggle sections
  const isDashboard = view === 'dashboard';
  document.getElementById('view-dashboard').classList.toggle('hidden', !isDashboard);
  document.getElementById('view-tasks').classList.toggle('hidden', isDashboard);

  // Update header
  const titles = {
    dashboard: ['Dashboard', 'Here\'s your focus overview'],
    today:     ['Today',    'Tasks scheduled for today'],
    tomorrow:  ['Tomorrow', 'Plan ahead for tomorrow'],
    later:     ['Later',    'Future tasks & backlog'],
    all:       ['All Tasks','Every task in one place'],
  };
  const [title, subtitle] = titles[view] || ['Tasks', ''];
  document.getElementById('view-title').textContent = title;
  document.getElementById('view-subtitle').textContent = subtitle;

  if (isDashboard) {
    loadDashboard();
  } else {
    loadTasks(view);
  }
}

// ── Dashboard ─────────────────────────────────────────────────────────────
async function loadDashboard() {
  try {
    const [stats, tasks] = await Promise.all([
      apiGet('/api/dashboard'),
      apiGet('/api/tasks'),
    ]);
    allTasks = tasks;

    // Stats
    document.getElementById('stat-total').textContent     = stats.totalTasks;
    document.getElementById('stat-pending').textContent   = stats.pendingTasks;
    document.getElementById('stat-progress').textContent  = stats.inProgressTasks;
    document.getElementById('stat-completed').textContent = stats.completedTasks;
    document.getElementById('today-count-badge').textContent = stats.todayTasks;

    // Today's mini list
    const todayTasks = tasks.filter(t => t.forWhen === 'TODAY' && t.status !== 'COMPLETED');
    renderMiniList('dashboard-today-list', todayTasks, 'No tasks for today 🎉');

    // In-progress mini list
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS');
    renderMiniList('dashboard-progress-list', inProgress, 'No tasks in progress');
  } catch (err) {
    toast('Failed to load dashboard: ' + err.message, 'error');
  }
}

function renderMiniList(containerId, tasks, emptyMsg) {
  const el = document.getElementById(containerId);
  if (!tasks.length) {
    el.innerHTML = `<div class="empty-state"><p>${emptyMsg}</p></div>`;
    return;
  }
  el.innerHTML = tasks.slice(0, 5).map(t => renderTaskCard(t, true)).join('');
}

// ── Task list view ────────────────────────────────────────────────────────
async function loadTasks(view) {
  document.getElementById('tasks-container').innerHTML =
    '<div class="loading-spinner"><div class="spinner"></div></div>';
  resetFiltersUI();

  try {
    let tasks;
    if (view === 'all') {
      tasks = await apiGet('/api/tasks');
    } else {
      const map = { today: 'TODAY', tomorrow: 'TOMORROW', later: 'LATER' };
      tasks = await apiGet(`/api/tasks/filter/forWhen/${map[view]}`);
    }
    allTasks = tasks;
    renderTaskList(tasks);
  } catch (err) {
    toast('Failed to load tasks: ' + err.message, 'error');
    document.getElementById('tasks-container').innerHTML =
      '<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load tasks.</p></div>';
  }
}

function renderTaskList(tasks) {
  const container = document.getElementById('tasks-container');
  if (!tasks.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p>No tasks here. Create one!</p>
      </div>`;
    return;
  }
  container.innerHTML = tasks.map(t => renderTaskCard(t, false)).join('');
}

function renderTaskCard(task, mini) {
  const statusMap = { PENDING: 'Pending', IN_PROGRESS: 'In Progress', COMPLETED: 'Done' };
  const fwMap     = { TODAY: 'Today', TOMORROW: 'Tomorrow', LATER: 'Later' };
  const actions   = buildActions(task, mini);

  return `
  <div class="task-card status-${task.status}" id="task-${task.id}">
    <div class="task-main">
      <span class="task-title" title="${esc(task.title)}">${esc(task.title)}</span>
      <span class="task-desc" title="${esc(task.description)}">${esc(task.description)}</span>
      <div class="task-meta">
        <span class="chip chip-priority-${task.priority}">${task.priority}</span>
        <span class="chip chip-status-${task.status}">${statusMap[task.status]}</span>
        <span class="chip chip-forwhen">${fwMap[task.forWhen]}</span>
      </div>
    </div>
    <div class="task-actions">${actions}</div>
  </div>`;
}

function buildActions(task, mini) {
  if (mini) return `
    <button class="icon-btn info" onclick="startTask(${task.id})" title="Start" ${task.status !== 'PENDING' ? 'disabled style="opacity:0.3"' : ''}>▶</button>`;

  let html = '';
  if (task.status === 'PENDING') {
    html += `<button class="icon-btn info" onclick="startTask(${task.id})" title="Start task">▶</button>`;
  }
  if (task.status === 'IN_PROGRESS') {
    html += `<button class="icon-btn success" onclick="openCompleteModal(${task.id})" title="Complete task">✓</button>`;
  }
  if (task.status !== 'COMPLETED') {
    html += `<button class="icon-btn" onclick="openEditModal(${task.id})" title="Edit task">✎</button>`;
  }
  html += `<button class="icon-btn danger" onclick="deleteTask(${task.id})" title="Delete task">✕</button>`;
  return html;
}

// ── Filters ───────────────────────────────────────────────────────────────
async function applyFilters() {
  const status   = document.getElementById('filter-status').value;
  const priority = document.getElementById('filter-priority').value;
  const fwMap    = { today: 'TODAY', tomorrow: 'TOMORROW', later: 'LATER', all: '' };
  const forWhen  = fwMap[currentView] || '';

  const params = new URLSearchParams();
  if (status)   params.set('status', status);
  if (priority) params.set('priority', priority);
  if (forWhen)  params.set('forWhen', forWhen);

  try {
    const tasks = await apiGet(`/api/tasks/filter?${params.toString()}`);
    renderTaskList(tasks);
  } catch (err) {
    toast('Filter failed: ' + err.message, 'error');
  }
}

function resetFilters() {
  resetFiltersUI();
  loadTasks(currentView);
}

function resetFiltersUI() {
  document.getElementById('filter-status').value = '';
  document.getElementById('filter-priority').value = '';
}

// ── Task CRUD ─────────────────────────────────────────────────────────────
function openTaskModal(taskId = null) {
  editingTaskId = taskId;
  const modal = document.getElementById('task-modal');
  document.getElementById('task-modal-error').classList.add('hidden');

  if (taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      document.getElementById('modal-title').textContent = 'Edit Task';
      document.getElementById('task-btn-label').textContent = 'Save Changes';
      document.getElementById('task-title').value       = task.title;
      document.getElementById('task-description').value = task.description;
      document.getElementById('task-priority').value    = task.priority;
      document.getElementById('task-forwhen').value     = task.forWhen;
    }
  } else {
    document.getElementById('modal-title').textContent = 'New Task';
    document.getElementById('task-btn-label').textContent = 'Create Task';
    document.getElementById('task-form').reset();
  }

  modal.classList.remove('hidden');
}

function closeTaskModal() {
  document.getElementById('task-modal').classList.add('hidden');
  editingTaskId = null;
}

function closeModalOnOverlay(e) {
  if (e.target.id === 'task-modal') closeTaskModal();
}

async function handleTaskSubmit(e) {
  e.preventDefault();
  const btn    = document.getElementById('task-submit-btn');
  const errEl  = document.getElementById('task-modal-error');
  errEl.classList.add('hidden');

  const payload = {
    title:       document.getElementById('task-title').value.trim(),
    description: document.getElementById('task-description').value.trim(),
    priority:    document.getElementById('task-priority').value,
    forWhen:     document.getElementById('task-forwhen').value,
  };

  setLoading(btn, true);
  try {
    if (editingTaskId) {
      // Re-create for edit: delete old + create new (no PUT endpoint exposed)
      // We update via re-creating since backend only exposes start/finish patches
      // Instead build a PATCH call here if the user adds one, or we just show info
      await deleteExistingAndRecreate(editingTaskId, payload);
      toast('Task updated ✨', 'success');
    } else {
      await apiPost('/api/tasks', payload);
      toast('Task created 🎯', 'success');
    }
    closeTaskModal();
    refreshCurrentView();
  } catch (err) {
    errEl.textContent = err.message || 'Something went wrong.';
    errEl.classList.remove('hidden');
  } finally {
    setLoading(btn, false);
  }
}

async function deleteExistingAndRecreate(id, payload) {
  await apiDelete(`/api/tasks/${id}`);
  await apiPost('/api/tasks', payload);
}

function openEditModal(taskId) { openTaskModal(taskId); }

async function startTask(id) {
  try {
    await apiPatch(`/api/tasks/${id}/start`);
    toast('Task started 🔥', 'info');
    refreshCurrentView();
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function deleteTask(id) {
  if (!confirm('Delete this task permanently?')) return;
  try {
    await apiDelete(`/api/tasks/${id}`);
    toast('Task deleted', 'info');
    refreshCurrentView();
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ── Complete modal ────────────────────────────────────────────────────────
function openCompleteModal(taskId) {
  completingTaskId = taskId;
  document.getElementById('task-note').value = '';
  document.getElementById('complete-modal').classList.remove('hidden');
}

function closeCompleteModal() {
  document.getElementById('complete-modal').classList.add('hidden');
  completingTaskId = null;
}

function closeCompleteModalOnOverlay(e) {
  if (e.target.id === 'complete-modal') closeCompleteModal();
}

async function submitComplete() {
  if (!completingTaskId) return;
  const note = document.getElementById('task-note').value.trim();
  try {
    await apiPatch(`/api/tasks/${completingTaskId}/finish`, { taskNote: note });
    toast('Task completed! Great work ✅', 'success');
    closeCompleteModal();
    refreshCurrentView();
  } catch (err) {
    toast(err.message, 'error');
  }
}

// ── Refresh ───────────────────────────────────────────────────────────────
function refreshCurrentView() {
  if (currentView === 'dashboard') loadDashboard();
  else loadTasks(currentView);
}

// ── HTTP helpers ─────────────────────────────────────────────────────────
function authHeaders() {
  const h = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

async function handleResponse(res) {
  if (res.status === 401 || res.status === 403) {
    handleLogout();
    throw new Error('Session expired. Please sign in again.');
  }
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok) {
    const msg = json?.message || json?.error || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json;
}

async function apiGet(path) {
  const res = await fetch(API + path, { headers: authHeaders() });
  return handleResponse(res);
}

async function apiPost(path, body) {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

async function apiPatch(path, body = {}) {
  const res = await fetch(API + path, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

async function apiDelete(path) {
  const res = await fetch(API + path, { method: 'DELETE', headers: authHeaders() });
  if (res.status === 204) return;
  return handleResponse(res);
}

// ── UI helpers ────────────────────────────────────────────────────────────
function setLoading(btn, loading) {
  btn.disabled = loading;
  const spinner = btn.querySelector('.btn-spinner');
  const label   = btn.querySelector('span');
  if (spinner) spinner.classList.toggle('hidden', !loading);
  if (label)   label.style.opacity = loading ? '0.5' : '1';
}

function toast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
