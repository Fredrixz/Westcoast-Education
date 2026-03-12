import { api, q } from './api.js';

export const courses = {
  getAll() {
    return api.get('/courses');
  },

  getById(id) {
    return api.get(`/courses/${id}`);
  },

  getPopular() {
    return api.get(`/courses${q({ popular: true })}`);
  },

  add(data) {
    return api.post('/courses', data);
  },

  formatPrice(amount) {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK', maximumFractionDigits: 0 }).format(amount);
  },

  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' });
  },

  renderBadges(course) {
    const badges = [`<span class="badge badge-category">${course.category}</span>`];
    if (course.popular) badges.push('<span class="badge badge-popular">Populär</span>');
    if (course.classroom) badges.push('<span class="badge badge-classroom">Klassrum</span>');
    if (course.distance) badges.push('<span class="badge badge-distance">Distans</span>');
    return badges.join('');
  },

  renderCard(course) {
    const nextDate = course.dates?.[0] ? this.formatDate(course.dates[0]) : '–';
    return `
      <article class="course-card" data-course-id="${course.id}">
        <img class="card-img" src="${course.image}" alt="${course.title}" loading="lazy">
        <div class="card-body">
          <div class="card-meta">${this.renderBadges(course)}</div>
          <h3 class="card-title">${course.title}</h3>
          <p class="card-number">Kursnr: ${course.courseNumber}</p>
          <div class="card-stats">
            <span>📅 ${nextDate}</span>
            <span>🕐 ${course.days} dagar</span>
            <span>⭐ ${course.rating}</span>
          </div>
          <div class="card-footer">
            <span class="card-price">${this.formatPrice(course.cost)}</span>
            <span class="btn btn-primary" style="font-size:0.82rem;padding:0.4rem 0.9rem">Visa kurs →</span>
          </div>
        </div>
      </article>`;
  },

  bindCardClicks(containerEl) {
    containerEl.addEventListener('click', (e) => {
      const card = e.target.closest('.course-card');
      if (card?.dataset.courseId) {
        window.location.href = `course.html?id=${card.dataset.courseId}`;
      }
    });
  },
};
