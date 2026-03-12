import { auth } from './modules/auth.js';
import { ui } from './modules/ui.js';

// Redirect if already logged in
if (auth.isLoggedIn()) {
  window.location.href = 'index.html';
}

const params = new URLSearchParams(window.location.search);
const redirect = params.get('redirect') || 'index.html';

// Tab switching
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');

function showTab(tab) {
  const isLogin = tab === 'login';
  loginForm.style.display = isLogin ? '' : 'none';
  registerForm.style.display = isLogin ? 'none' : '';
  tabLogin.classList.toggle('active', isLogin);
  tabRegister.classList.toggle('active', !isLogin);
}

tabLogin.addEventListener('click', () => showTab('login'));
tabRegister.addEventListener('click', () => showTab('register'));
document.getElementById('switch-to-register').addEventListener('click', () => showTab('register'));
document.getElementById('switch-to-login').addEventListener('click', () => showTab('login'));

// Start on register tab if query param says so
if (params.get('tab') === 'register') showTab('register');

// LOGIN
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const emailEl = document.getElementById('login-email');
  const passwordEl = document.getElementById('login-password');
  const generalErr = document.getElementById('login-general-err');
  const submitBtn = document.getElementById('login-btn');

  const valid = ui.validate([
    { el: emailEl, errorEl: document.getElementById('login-email-err'), message: 'Ange en giltig e-postadress.', check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { el: passwordEl, errorEl: document.getElementById('login-password-err'), message: 'Ange ditt lösenord.', check: (v) => v.length >= 1 },
  ]);
  if (!valid) return;

  ui.setLoading(submitBtn, true);
  generalErr.textContent = '';
  try {
    await auth.login(emailEl.value.trim(), passwordEl.value);
    window.location.href = redirect;
  } catch (err) {
    generalErr.textContent = err.message;
    ui.setLoading(submitBtn, false);
  }
});

// REGISTER
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nameEl = document.getElementById('reg-name');
  const emailEl = document.getElementById('reg-email');
  const mobileEl = document.getElementById('reg-mobile');
  const passwordEl = document.getElementById('reg-password');
  const generalErr = document.getElementById('reg-general-err');
  const submitBtn = document.getElementById('register-btn');

  const valid = ui.validate([
    { el: nameEl, errorEl: document.getElementById('reg-name-err'), message: 'Ange ditt namn.', check: (v) => v.length > 1 },
    { el: emailEl, errorEl: document.getElementById('reg-email-err'), message: 'Ange en giltig e-postadress.', check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    { el: mobileEl, errorEl: document.getElementById('reg-mobile-err'), message: 'Ange ett mobilnummer.', check: (v) => v.length >= 8 },
    { el: passwordEl, errorEl: document.getElementById('reg-password-err'), message: 'Lösenordet måste vara minst 6 tecken.', check: (v) => v.length >= 6 },
  ]);
  if (!valid) return;

  ui.setLoading(submitBtn, true);
  generalErr.textContent = '';
  try {
    await auth.register({
      name: nameEl.value.trim(),
      email: emailEl.value.trim(),
      mobile: mobileEl.value.trim(),
      address: document.getElementById('reg-address').value.trim(),
      password: passwordEl.value,
    });
    window.location.href = redirect;
  } catch (err) {
    generalErr.textContent = err.message;
    ui.setLoading(submitBtn, false);
  }
});
