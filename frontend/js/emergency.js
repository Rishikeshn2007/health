const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const step4 = document.getElementById('step4');
const step5 = document.getElementById('step5');
const names = document.getElementById('name');
const stage = document.getElementById('stage');
const todo = document.getElementById('todo');
const stat = document.getElementById('stat');
const grid = document.getElementById('grid');
const searchSection = document.getElementById('search');
const allSection = document.getElementById('all');
const searchInput = document.getElementById('find');
const searchButton = document.getElementById('searchButton');
const dataUrl = new URL('../emergency.json', window.location.href);

async function findit() {
  const query = searchInput?.value?.trim() || '';

  if (!query) {
    window.alert('Search box was empty.');
    searchInput?.focus();
    return;
  }

  await getData(query);
}

async function getData(query) {
  const normalizedQuery = query.toLowerCase().trim();
  clearDisplay();
  let found = false;

  try {
    const resp = await fetch(dataUrl);
    if (!resp.ok) {
      throw new Error(`Failed to load emergency data: ${resp.status}`);
    }

    const data = await resp.json();

    for (const item of data) {
      const searchable = [
        item.name,
        item.stage,
        item.step1,
        item.step2,
        item.step3,
        item.step4,
        item.step5,
        item.todo,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!searchable.includes(normalizedQuery)) {
        continue;
      }

      if (stat) stat.style.display = 'none';
      if (grid) grid.style.display = 'none';
      if (searchSection) searchSection.style.display = 'none';
      if (allSection) allSection.style.display = 'block';

      if (names) names.textContent = item.name || '';
      if (stage) stage.textContent = item.stage || '';
      if (step1) step1.textContent = item.step1 || '';
      if (step2) step2.textContent = item.step2 || '';
      if (step3) step3.textContent = item.step3 || '';
      if (step4) step4.textContent = item.step4 || '';
      if (step5) step5.textContent = item.step5 || '';
      if (todo) todo.textContent = item.todo || '';

      found = true;
      break;
    }

    if (!found) {
      window.alert(`${query} was not found.`);
      searchInput?.focus();
    }
  } catch (err) {
    console.error(err);
    window.alert('Something went wrong while loading emergency data.');
  }
}

function clearDisplay() {
  if (allSection) allSection.style.display = 'none';
  if (stat) stat.style.display = '';
  if (grid) grid.style.display = '';
  if (searchSection) searchSection.style.display = '';
  if (names) names.textContent = '';
  if (stage) stage.textContent = '';
  if (step1) step1.textContent = '';
  if (step2) step2.textContent = '';
  if (step3) step3.textContent = '';
  if (step4) step4.textContent = '';
  if (step5) step5.textContent = '';
  if (todo) todo.textContent = '';
}

searchButton?.addEventListener('click', findit);
searchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    findit();
  }
});

window.findit = findit;
