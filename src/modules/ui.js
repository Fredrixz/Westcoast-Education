import { ADMIN_EMAIL } from '../config.js';
import { auth } from './auth.js';

export const ui = {
  showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'error' ? 'error' : ''}`;
    toast.textContent = type === 'success' ? `✓ ${message}` : `✕ ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  },

  setLoading(el, loading) {
    if (loading) {
      el.disabled = true;
      el.dataset.original = el.textContent;
      el.textContent = 'Laddar…';
    } else {
      el.disabled = false;
      el.textContent = el.dataset.original || el.textContent;
    }
  },

  updateNavAuth(user) {
    const actionsEl = document.querySelector('.nav-actions');
    const navLinks = document.querySelector('.nav-links');
    if (!actionsEl) return;

    // Visa admin-länk bara för admin
    const adminLink = navLinks?.querySelector('.nav-admin-link');
    if (adminLink) adminLink.remove();
    if (user?.email === ADMIN_EMAIL) {
      const li = document.createElement('li');
      li.innerHTML = '<a href="admin.html" class="nav-admin-link">Admin</a>';
      navLinks?.appendChild(li);
    }

    if (user) {
      actionsEl.innerHTML = `
        <span style="color:#94a3b8;font-size:0.85rem">Hej, ${user.name.split(' ')[0]}</span>
        <button class="btn-nav btn-nav-outline" id="logout-btn">Logga ut</button>`;
      document.getElementById('logout-btn')?.addEventListener('click', () => {
        auth.logout();
      });
    } else {
      actionsEl.innerHTML = `
        <a href="login.html" class="btn-nav btn-nav-outline">Logga in</a>
        <a href="login.html?tab=register" class="btn-nav btn-nav-primary">Registrera</a>`;
    }
  },

  initHamburger() {
    const btn = document.querySelector('.hamburger');
    const links = document.querySelector('.nav-links');
    btn?.addEventListener('click', () => links?.classList.toggle('open'));
  },

  validate(fields) {
    let valid = true;
    fields.forEach(({ el, errorEl, message, check }) => {
      const ok = check(el.value.trim());
      errorEl.textContent = ok ? '' : message;
      el.classList.toggle('error', !ok);
      if (!ok) valid = false;
    });
    return valid;
  },
};
