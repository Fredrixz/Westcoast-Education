import { courses } from './modules/courses.js';
import { bookings } from './modules/bookings.js';
import { auth } from './modules/auth.js';
import { ui } from './modules/ui.js';

ui.initHamburger();
ui.updateNavAuth(auth.getUser());

const detailEl = document.getElementById('course-detail');
const params = new URLSearchParams(window.location.search);
const courseId = params.get('id');

// Modal login
const modal = document.getElementById('login-modal');
document.getElementById('modal-close')?.addEventListener('click', () => modal.classList.remove('open'));
modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });

function openLoginModal(courseId) {
  const link = document.getElementById('modal-login-link');
  link.href = `login.html?redirect=course.html?id=${courseId}`;
  modal.classList.add('open');
}

function renderDetail(course) {
  document.title = `${course.title} – WestCoast Education`;

  const dateOptions = course.dates.map((d, i) =>
    `<option value="${d}">${courses.formatDate(d)}${i === 0 ? ' (Nästa start)' : ''}</option>`
  ).join('');

  const typeOptions = [
    course.classroom ? '<option value="classroom">Klassrum</option>' : '',
    course.distance ? '<option value="distance">Distans</option>' : '',
  ].join('');

  detailEl.innerHTML = `
    <p style="margin:1.5rem 0 0;color:var(--text-light);font-size:0.875rem">
      <a href="index.html" style="color:var(--primary)">← Tillbaka till kurser</a>
    </p>
    <div class="detail-layout">
      <!-- LEFT: Kursinfo -->
      <div>
        <img class="detail-img" src="${course.image}" alt="${course.title}" />
        <div class="detail-meta">${courses.renderBadges(course)}</div>
        <h1 class="detail-title">${course.title}</h1>
        <p class="detail-number">Kursnummer: ${course.courseNumber}</p>

        <div class="detail-info-grid">
          <div class="info-card">
            <p class="info-label">Längd</p>
            <p class="info-value">${course.days} dagar</p>
          </div>
          <div class="info-card">
            <p class="info-label">Pris</p>
            <p class="info-value">${courses.formatPrice(course.cost)}</p>
          </div>
          <div class="info-card">
            <p class="info-label">Betyg</p>
            <p class="info-value">⭐ ${course.rating}/5</p>
          </div>
          <div class="info-card">
            <p class="info-label">Deltagare</p>
            <p class="info-value">${course.students}+</p>
          </div>
          <div class="info-card">
            <p class="info-label">Lärare</p>
            <p class="info-value">${course.instructor}</p>
          </div>
          <div class="info-card">
            <p class="info-label">Format</p>
            <p class="info-value">${[course.classroom && 'Klassrum', course.distance && 'Distans'].filter(Boolean).join(' / ')}</p>
          </div>
        </div>

        <div class="detail-description">
          <h3>Om kursen</h3>
          <p>${course.description}</p>
        </div>
      </div>

      <!-- RIGHT: Boka -->
      <aside>
        <div class="booking-card" id="booking-section">
          <h2>Boka kurs</h2>
          <p class="booking-price">${courses.formatPrice(course.cost)} <span>/ person</span></p>

          <form id="booking-form" novalidate>
            <div class="form-group">
              <label for="book-type">Kursformat</label>
              <select id="book-type">${typeOptions}</select>
            </div>
            <div class="form-group">
              <label for="book-date">Startdatum</label>
              <select id="book-date">${dateOptions}</select>
            </div>
            <div class="form-group">
              <label for="book-name">Fullständigt namn *</label>
              <input type="text" id="book-name" placeholder="Anna Andersson" autocomplete="name" />
              <p class="form-error" id="err-name"></p>
            </div>
            <div class="form-group">
              <label for="book-address">Faktureringsadress *</label>
              <input type="text" id="book-address" placeholder="Gatan 1, 41234 Göteborg" autocomplete="street-address" />
              <p class="form-error" id="err-address"></p>
            </div>
            <div class="form-group">
              <label for="book-email">E-postadress *</label>
              <input type="email" id="book-email" placeholder="anna@exempel.se" autocomplete="email" />
              <p class="form-error" id="err-email"></p>
            </div>
            <div class="form-group">
              <label for="book-mobile">Mobilnummer *</label>
              <input type="tel" id="book-mobile" placeholder="070 123 45 67" autocomplete="tel" />
              <p class="form-error" id="err-mobile"></p>
            </div>
            <button type="submit" class="btn btn-primary btn-full" id="submit-btn">Boka kurs</button>
          </form>
        </div>
      </aside>
    </div>`;

  initBookingForm(course);
}

function prefillUser(user) {
  const nameEl = document.getElementById('book-name');
  const emailEl = document.getElementById('book-email');
  const mobileEl = document.getElementById('book-mobile');
  const addressEl = document.getElementById('book-address');
  if (nameEl) nameEl.value = user.name || '';
  if (emailEl) emailEl.value = user.email || '';
  if (mobileEl) mobileEl.value = user.mobile || '';
  if (addressEl) addressEl.value = user.address || '';
}

function showSuccess() {
  document.getElementById('booking-section').innerHTML = `
    <div class="success-screen">
      <div class="success-icon">✓</div>
      <h2>Bokning bekräftad!</h2>
      <p>Din bokning är registrerad. Du kommer att få en bekräftelse via e-post.</p>
      <a href="index.html" class="btn btn-primary">Se fler kurser</a>
    </div>`;
}

function initBookingForm(course) {
  const user = auth.getUser();
  if (user) prefillUser(user);

  const form = document.getElementById('booking-form');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!auth.isLoggedIn()) {
      openLoginModal(course.id);
      return;
    }

    const valid = ui.validate([
      { el: document.getElementById('book-name'), errorEl: document.getElementById('err-name'), message: 'Ange ditt namn.', check: (v) => v.length > 1 },
      { el: document.getElementById('book-address'), errorEl: document.getElementById('err-address'), message: 'Ange faktureringsadress.', check: (v) => v.length > 4 },
      { el: document.getElementById('book-email'), errorEl: document.getElementById('err-email'), message: 'Ange en giltig e-postadress.', check: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
      { el: document.getElementById('book-mobile'), errorEl: document.getElementById('err-mobile'), message: 'Ange ett mobilnummer.', check: (v) => v.length >= 8 },
    ]);

    if (!valid) return;

    ui.setLoading(submitBtn, true);
    try {
      await bookings.create({
        courseId: course.id,
        userId: user?.id || null,
        type: document.getElementById('book-type').value,
        date: document.getElementById('book-date').value,
        customerName: document.getElementById('book-name').value,
        address: document.getElementById('book-address').value,
        email: document.getElementById('book-email').value,
        mobile: document.getElementById('book-mobile').value,
      });
      showSuccess();
    } catch {
      ui.showToast('Något gick fel. Försök igen.', 'error');
      ui.setLoading(submitBtn, false);
    }
  });

  submitBtn.addEventListener('click', () => {
    if (!auth.isLoggedIn()) {
      openLoginModal(course.id);
    }
  });
}

async function init() {
  if (!courseId) {
    detailEl.innerHTML = '<p style="padding:3rem;text-align:center">Ingen kurs angiven.</p>';
    return;
  }
  try {
    const course = await courses.getById(courseId);
    renderDetail(course);
  } catch {
    detailEl.innerHTML = '<p style="padding:3rem;text-align:center">Kursen hittades inte.</p>';
  }
}

init();
