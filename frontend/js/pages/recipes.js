import { get } from '../services/api.js';
import { logUsage } from '../services/usage.js';

export function renderRecipes(container) {
  container.innerHTML = `
    <div class="recipes-header">
      <h1>Recetas</h1>
      <div class="recipes-search">
        <input type="text" id="recipeSearch" placeholder="Buscar recetas..." />
        <select id="recipeDiet">
          <option value="">Todas las dietas</option>
          <option value="vegetarian">Vegetariano</option>
          <option value="vegan">Vegano</option>
          <option value="keto">Keto</option>
          <option value="pescatarian">Pescetariano</option>
        </select>
      </div>
    </div>
    <div id="recipesGrid" class="recipes-grid">
      <div class="page-loading">Cargando recetas...</div>
    </div>
  `;

  const grid = document.getElementById('recipesGrid');
  const searchInput = document.getElementById('recipeSearch');
  const dietSelect = document.getElementById('recipeDiet');

  let debounceTimer;

  async function loadRecipes() {
    grid.innerHTML = '<div class="page-loading">Cargando recetas...</div>';
    try {
      const params = new URLSearchParams();
      const search = searchInput.value.trim();
      const diet = dietSelect.value;
      if (search) params.set('search', search);
      if (diet) params.set('diet', diet);

      const recipes = await get(`/recipes?${params}`);

      if (!recipes.length) {
        grid.innerHTML = '<div class="page-loading" style="grid-column:1/-1">No se encontraron recetas.</div>';
        return;
      }

      grid.innerHTML = recipes.map(r => `
        <article class="recipe-card-full" data-id="${r.id}">
          <div class="recipe-card-full-image">
            ${r.photo_url
              ? `<img src="${r.photo_url}" alt="${r.name}" style="width:100%;height:100%;object-fit:cover">`
              : `<div class="recipe-card-full-placeholder">${r.name.charAt(0).toUpperCase()}</div>`}
          </div>
          <div class="recipe-card-full-body">
            <h3>${r.name}</h3>
            <div class="recipe-card-full-meta">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.2rem"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                ${r.prep_time_minutes || '—'} min
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.2rem"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                ${r.servings || '—'} porc.
              </span>
            </div>
            ${r.diet_tags ? `<div class="recipe-card-full-tags">${r.diet_tags.split(',').map(t => `<span class="tag tag-primary">${t.trim()}</span>`).join('')}</div>` : ''}
          </div>
        </article>
      `).join('');

      grid.querySelectorAll('.recipe-card-full').forEach(el => {
        el.addEventListener('click', () => showRecipeDetail(el.dataset.id));
      });
    } catch {
      grid.innerHTML = '<div class="page-error">Error al cargar recetas. Verifica que el backend esté corriendo.</div>';
    }
  }

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(loadRecipes, 300);
  });

  dietSelect.addEventListener('change', loadRecipes);

  loadRecipes();
}

async function showRecipeDetail(id) {
  try {
    const recipe = await get(`/recipes/${id}`);
    logUsage('recipe_viewed', id);
    const overlay = document.createElement('div');
    overlay.className = 'recipe-detail-overlay';
    overlay.innerHTML = `
      <div class="recipe-detail-card">
        <div class="recipe-detail-header">
          <h2>${recipe.name}</h2>
          <button class="recipe-detail-close" id="detailClose">✕</button>
        </div>

        ${recipe.photo_url ? `
          <div class="recipe-detail-img">
            <img src="${recipe.photo_url}" alt="${recipe.name}" loading="lazy">
          </div>
        ` : ''}

        <div class="recipe-detail-meta">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${recipe.prep_time_minutes || '—'} min
          </span>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            ${recipe.servings || '—'} porciones
          </span>
          ${recipe.diet_tags ? recipe.diet_tags.split(',').map(t => `<span class="tag tag-primary">${t.trim()}</span>`).join('') : ''}
        </div>

        ${recipe.description ? `<p style="margin-bottom:1.5rem;color:var(--text-secondary)">${recipe.description}</p>` : ''}

        ${recipe.ingredients?.length ? `
          <div class="recipe-detail-section">
            <h4>Ingredientes</h4>
            <ul>${recipe.ingredients.map(i => `<li>${i.amount} ${i.unit} de ${i.name}</li>`).join('')}</ul>
          </div>
        ` : ''}

        ${recipe.steps?.length ? `
          <div class="recipe-detail-section">
            <h4>Pasos</h4>
            <ol class="recipe-detail-steps">${recipe.steps.map(s => `<li>${s.instruction}${s.timer_seconds ? ` <span class="tag tag-primary"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.2rem"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${s.timer_seconds}s</span>` : ''}</li>`).join('')}</ol>
          </div>
        ` : ''}

        <div class="recipe-detail-add">
          <button class="btn btn-primary" id="addToPlannerBtn">Agregar al planificador</button>
          <button class="btn btn-outline" id="addToFavBtn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            Favorito
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('detailClose').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });

    document.getElementById('addToPlannerBtn').addEventListener('click', () => {
      overlay.remove();
      logUsage('plan_created', recipe.id);
      const prefs = JSON.parse(localStorage.getItem('tf_week_plan') || '{}');
      const dates = Object.keys(prefs);
      const firstEmpty = dates.find(d => {
        const dayMeals = prefs[d];
        return !dayMeals || dayMeals.length < 4;
      });
      if (firstEmpty) {
        if (!prefs[firstEmpty]) prefs[firstEmpty] = [];
        prefs[firstEmpty].push({ recipe_id: recipe.id, recipe_name: recipe.name, meal_type: 'almuerzo', plan_date: firstEmpty });
        localStorage.setItem('tf_week_plan', JSON.stringify(prefs));
      }
      window.location.hash = 'planner';
    });

    document.getElementById('addToFavBtn').addEventListener('click', async () => {
      try {
        const { post } = await import('../services/api.js');
        await post('/favorites', { recipe_id: recipe.id });
        logUsage('favorite_added', recipe.id);
        document.getElementById('addToFavBtn').innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.3rem"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg> Agregado';
        document.getElementById('addToFavBtn').disabled = true;
      } catch {
        alert('Error al agregar a favoritos');
      }
    });

  } catch {
    alert('Error al cargar la receta');
  }
}