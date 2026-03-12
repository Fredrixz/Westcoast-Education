import { courses } from './modules/courses.js';
import { auth } from './modules/auth.js';
import { ui } from './modules/ui.js';

ui.updateNavAuth(auth.getUser());
ui.initHamburger();

const courseGrid = document.getElementById('course-grid');
const popularGrid = document.getElementById('popular-grid');

courses.bindCardClicks(courseGrid);
courses.bindCardClicks(popularGrid);
const courseCount = document.getElementById('course-count');
const searchInput = document.getElementById('search-input');
const categoryFilters = document.getElementById('category-filters');

let allCourses = [];
let activeCategory = 'all';

function renderCourses(list) {
  courseCount.textContent = `${list.length} kurs${list.length !== 1 ? 'er' : ''} hittade`;
  if (list.length === 0) {
    courseGrid.innerHTML = `
      <div class="empty-state">
        <p style="font-size:2rem">🔍</p>
        <p>Inga kurser matchade din sökning.</p>
      </div>`;
    return;
  }
  courseGrid.innerHTML = list.map((c) => courses.renderCard(c)).join('');
}

function filterCourses() {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = allCourses.filter((c) => {
    const matchCategory = activeCategory === 'all' || c.category === activeCategory;
    const matchSearch =
      !query ||
      c.title.toLowerCase().includes(query) ||
      c.courseNumber.toLowerCase().includes(query) ||
      c.category.toLowerCase().includes(query);
    return matchCategory && matchSearch;
  });
  renderCourses(filtered);
}

function buildCategoryFilters(courseList) {
  const categories = [...new Set(courseList.map((c) => c.category))];
  categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.dataset.category = cat;
    btn.textContent = cat;
    categoryFilters.appendChild(btn);
  });
}

categoryFilters.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  activeCategory = chip.dataset.category;
  document.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
  chip.classList.add('active');
  filterCourses();
});

searchInput.addEventListener('input', filterCourses);

async function init() {
  try {
    allCourses = await courses.getAll();
    buildCategoryFilters(allCourses);
    renderCourses(allCourses);

    const popular = allCourses.filter((c) => c.popular);
    popularGrid.innerHTML = popular.map((c) => courses.renderCard(c)).join('');
  } catch {
    courseGrid.innerHTML = '<div class="empty-state"><p>Kunde inte ladda kurser. Kontrollera anslutningen.</p></div>';
    popularGrid.innerHTML = '';
  }
}

init();
