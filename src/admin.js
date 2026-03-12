import { courses } from './modules/courses.js';
import { bookings } from './modules/bookings.js';
import { auth } from './modules/auth.js';
import { ui } from './modules/ui.js';
import { ADMIN_EMAIL } from './config.js';

// Skydda adminpanelen – endast adminanvändaren har tillgång
const currentUser = auth.getUser();
if (!currentUser || currentUser.email !== ADMIN_EMAIL) {
  window.location.href = 'index.html';
}

ui.initHamburger();
ui.updateNavAuth(auth.getUser());

// ===== VIEW SWITCHING =====
const views = {
  'add-course': document.getElementById('view-add-course'),
  'bookings': document.getElementById('view-bookings'),
};

document.querySelectorAll('.admin-nav a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const view = link.dataset.view;
    Object.values(views).forEach((v) => (v.style.display = 'none'));
    views[view].style.display = '';
    document.querySelectorAll('.admin-nav a').forEach((l) => l.classList.remove('active'));
    link.classList.add('active');
    if (view === 'bookings') loadBookings();
  });
});

// ===== ADD COURSE =====
const addForm = document.getElementById('add-course-form');
const addBtn = document.getElementById('add-course-btn');

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const valid = ui.validate([
    { el: document.getElementById('ac-title'), errorEl: document.getElementById('err-ac-title'), message: 'Ange en kurstitel.', check: (v) => v.length > 1 },
    { el: document.getElementById('ac-number'), errorEl: document.getElementById('err-ac-number'), message: 'Ange ett kursnummer.', check: (v) => v.length > 1 },
    { el: document.getElementById('ac-days'), errorEl: document.getElementById('err-ac-days'), message: 'Ange antal dagar (1–30).', check: (v) => Number(v) >= 1 && Number(v) <= 30 },
    { el: document.getElementById('ac-cost'), errorEl: document.getElementById('err-ac-cost'), message: 'Ange en kostnad.', check: (v) => Number(v) >= 0 },
  ]);
  if (!valid) return;

  const dateVal = document.getElementById('ac-date').value;
  const newCourse = {
    title: document.getElementById('ac-title').value.trim(),
    courseNumber: document.getElementById('ac-number').value.trim(),
    days: Number(document.getElementById('ac-days').value),
    cost: Number(document.getElementById('ac-cost').value),
    category: document.getElementById('ac-category').value,
    description: document.getElementById('ac-description').value.trim(),
    image: document.getElementById('ac-image').value.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    instructor: document.getElementById('ac-instructor').value.trim(),
    classroom: document.getElementById('ac-classroom').checked,
    distance: document.getElementById('ac-distance').checked,
    dates: dateVal ? [dateVal] : [],
    popular: false,
    rating: 0,
    students: 0,
  };

  ui.setLoading(addBtn, true);
  try {
    await courses.add(newCourse);
    ui.showToast(`Kursen "${newCourse.title}" har lagts till!`);
    addForm.reset();
    document.getElementById('ac-classroom').checked = true;
  } catch {
    ui.showToast('Något gick fel. Försök igen.', 'error');
  } finally {
    ui.setLoading(addBtn, false);
  }
});

// ===== BOOKINGS =====
async function loadBookings() {
  const container = document.getElementById('bookings-container');
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  try {
    const [allCourses, allBookings] = await Promise.all([courses.getAll(), bookings.getAll()]);

    if (allBookings.length === 0) {
      container.innerHTML = '<div class="empty-state"><p style="font-size:2rem">📋</p><p>Inga bokningar ännu.</p></div>';
      return;
    }

    // Group bookings by courseId
    const grouped = allCourses.reduce((acc, course) => {
      const courseBookings = allBookings.filter((b) => b.courseId === course.id);
      if (courseBookings.length > 0) acc.push({ course, courseBookings });
      return acc;
    }, []);

    if (grouped.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>Inga bokningar hittades.</p></div>';
      return;
    }

    container.innerHTML = grouped.map(({ course, courseBookings }) => `
      <div class="table-wrap" style="margin-bottom:2rem">
        <div class="table-header">
          <h3>${course.title} <span style="font-weight:400;color:var(--text-light)">(${course.courseNumber})</span></h3>
          <span class="badge badge-category">${courseBookings.length} bokning${courseBookings.length !== 1 ? 'ar' : ''}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Namn</th>
              <th>E-post</th>
              <th>Mobilnummer</th>
              <th>Format</th>
              <th>Startdatum</th>
              <th>Bokad</th>
            </tr>
          </thead>
          <tbody>
            ${courseBookings.map((b) => `
              <tr>
                <td>${b.customerName}</td>
                <td>${b.email}</td>
                <td>${b.mobile}</td>
                <td>${b.type === 'classroom' ? 'Klassrum' : 'Distans'}</td>
                <td>${courses.formatDate(b.date)}</td>
                <td>${new Date(b.bookedAt).toLocaleDateString('sv-SE')}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`).join('');
  } catch {
    container.innerHTML = '<div class="empty-state"><p>Kunde inte ladda bokningar.</p></div>';
  }
}
