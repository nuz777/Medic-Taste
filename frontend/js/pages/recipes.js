import { get } from '../services/api.js';
import { logUsage } from '../services/usage.js';
import { escapeHtml, escapeAttr } from '../utils/escapeHtml.js';
import { nameToSlug } from '../utils/nameToSlug.js';

const INGREDIENT_IMAGES = {
  'tomate': 'assets/images/ingredients/tomate.jpg',
  'tomate chonto': 'assets/images/ingredients/tomate.jpg',
  'cebolla': 'assets/images/ingredients/cebolla.jpg',
  'cebolla cabezona': 'assets/images/ingredients/cebolla.jpg',
  'cebolla junca': 'assets/images/ingredients/cebolla.jpg',
  'cebolla larga': 'assets/images/ingredients/cebolla.jpg',
  'pimenton': 'assets/images/ingredients/pimiento-rojo.jpg',
  'pimiento': 'assets/images/ingredients/pimiento-rojo.jpg',
  'pimiento rojo': 'assets/images/ingredients/pimiento-rojo.jpg',
  'ajo': 'assets/images/ingredients/ajo.jpg',
  'yuca': 'assets/images/ingredients/default-ingredient.svg',
  'platano': 'assets/images/ingredients/platano.jpg',
  'platano verde': 'assets/images/ingredients/platano.jpg',
  'platano maduro': 'assets/images/ingredients/platano.jpg',
  'papa': 'assets/images/ingredients/PAPA-PASTUSA.png',
  'papa pastusa': 'assets/images/ingredients/PAPA-PASTUSA.png',
  'nhame': 'assets/images/ingredients/default-ingredient.svg',
  'leche': 'assets/images/ingredients/leche.jpg',
  'leche entera': 'assets/images/ingredients/leche.jpg',
  'pechuga': 'assets/images/ingredients/pechuga-de-pollo.jpg',
  'pechuga de pollo': 'assets/images/ingredients/pechuga-de-pollo.jpg',
  'arroz': 'assets/images/ingredients/arroz-blanco.jpg',
  'arroz blanco': 'assets/images/ingredients/arroz-blanco.jpg',
  'aceite': 'assets/images/ingredients/aceite-de-oliva.jpg',
  'aceite vegetal': 'assets/images/ingredients/aceite-de-oliva.jpg',
  'aceite de oliva': 'assets/images/ingredients/aceite-de-oliva.jpg',
  'sal': 'assets/images/ingredients/sal.jpg',
  'harina de trigo': 'assets/images/ingredients/harina-de-trigo.jpg',
  'harina pan': 'assets/images/ingredients/harina-de-trigo.jpg',
  'huevo': 'assets/images/ingredients/huevo.jpg',
  'huevos': 'assets/images/ingredients/huevo.jpg',
  'lechuga': 'assets/images/ingredients/lechuga.jpg',
  'pasta': 'assets/images/ingredients/pasta.jpg',
  'pasta pastusa': 'assets/images/ingredients/pasta.jpg',
  'queso parmesano': 'assets/images/ingredients/queso-parmesano.jpg',
  'queso costeno': 'assets/images/ingredients/queso_costeño.png',
  'aguacate': 'assets/images/ingredients/aguacate.jpg',
  'pan integral': 'assets/images/ingredients/pan-integral.jpg',
  'atun': 'assets/images/ingredients/atun-en-lata.jpg',
  'atun en lata': 'assets/images/ingredients/atun-en-lata.jpg',
  'lentejas': 'assets/images/ingredients/lentejas.jpg',
  'zanahoria': 'assets/images/ingredients/zanahoria.jpg',
  'manzana': 'assets/images/ingredients/manzana.jpg',
  'yogur': 'assets/images/ingredients/yogur-natural.jpg',
  'yogur natural': 'assets/images/ingredients/yogur-natural.jpg',
  'almendras': 'assets/images/ingredients/almendras.jpg',
  'miel': 'assets/images/ingredients/miel.jpg',
  'calabacin': 'assets/images/ingredients/calabacin.jpg',
  'mantequilla': 'assets/images/ingredients/mantequilla.jpg',
  'suero': 'assets/images/ingredients/default-ingredient.svg',
  'carne de res': 'assets/images/ingredients/default-ingredient.svg',
  'carne molida': 'assets/images/ingredients/default-ingredient.svg',
  'muslos de pollo': 'assets/images/ingredients/default-ingredient.svg',
  'salchicha': 'assets/images/ingredients/default-ingredient.svg',
  'butifarra': 'assets/images/ingredients/butifarra-soleden.jpg',
  'cerdo': 'assets/images/ingredients/default-ingredient.svg',
  'carne de cerdo': 'assets/images/ingredients/default-ingredient.svg',
  'cafe': 'assets/images/ingredients/Cafe_sello_rojo.jpg',
  'cafe sello rojo': 'assets/images/ingredients/Cafe_sello_rojo.jpg',
  'azucar': 'assets/images/ingredients/AZUCAR-INCAUCAjpg.jpg',
  'azucar incauca': 'assets/images/ingredients/AZUCAR-INCAUCAjpg.jpg',
  'panela': 'assets/images/ingredients/default-ingredient.svg',
  'frijol': 'assets/images/ingredients/default-ingredient.svg',
  'frijol zaragoza': 'assets/images/ingredients/zaragoza.jpg',
  'zaragoza': 'assets/images/ingredients/zaragoza.jpg',
  'cilantro': 'assets/images/ingredients/cilantro.jpg',
  'aji': 'assets/images/ingredients/default-ingredient.svg',
  'aji topito': 'assets/images/ingredients/default-ingredient.svg',
  'semillas de chia': 'assets/images/ingredients/semillasCHIA.jpg',
  'chia': 'assets/images/ingredients/semillasCHIA.jpg',
  'mango': 'assets/images/ingredients/mango.jpg',
  'quinoa': 'assets/images/ingredients/default-ingredient.svg',
  'espinaca': 'assets/images/ingredients/default-ingredient.svg',
  'champinones': 'assets/images/ingredients/default-ingredient.svg',
  'brocoli': 'assets/images/ingredients/default-ingredient.svg',
  'tofu': 'assets/images/ingredients/default-ingredient.svg',
  'garbanzos': 'assets/images/ingredients/default-ingredient.svg',
  'salmon': 'assets/images/ingredients/default-ingredient.svg',
  'merluza': 'assets/images/ingredients/default-ingredient.svg',
  'camarones': 'assets/images/ingredients/default-ingredient.svg',
  'edamame': 'assets/images/ingredients/default-ingredient.svg',
  'pepino': 'assets/images/ingredients/default-ingredient.svg',
  'batata': 'assets/images/ingredients/default-ingredient.svg',
  'avena': 'assets/images/ingredients/default-ingredient.svg',
  'nueces': 'assets/images/ingredients/default-ingredient.svg',
};

function getIngredientImage(name) {
  const lower = name.toLowerCase();
  for (const [key, img] of Object.entries(INGREDIENT_IMAGES)) {
    if (lower.includes(key)) return img;
  }
  const slug = nameToSlug(name);
  return `assets/images/ingredients/${slug}.jpg`;
}

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

      grid.innerHTML = recipes.map(r => {
        const slug = nameToSlug(r.name);
        const recipeImg = `assets/images/recipes/${slug}.jpg`;
        const recipeImgSvg = `assets/images/recipes/${slug}.svg`;
        const safeName = escapeHtml(r.name);
        return `
        <article class="recipe-card-full" data-id="${r.id}">
          <div class="recipe-card-full-image">
            <img src="${r.photo_url || recipeImg}" alt="${safeName}" loading="lazy" onerror="var s=this;if(!s.dataset.f){s.dataset.f=1;s.src='${recipeImg}'}else if(!s.dataset.g){s.dataset.g=1;s.src='${recipeImgSvg}'}else{s.style.display='none';s.nextElementSibling.style.display='flex'}"><div class="recipe-card-full-image-fallback" style="display:none">🍽️</div>
          </div>
          <div class="recipe-card-full-body">
            <h3>${safeName}</h3>
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
            ${r.diet_tags ? `<div class="recipe-card-full-tags">${r.diet_tags.split(',').map(t => `<span class="tag tag-primary">${escapeHtml(t.trim())}</span>`).join('')}</div>` : ''}
          </div>
        </article>
      `}).join('');

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

export async function showRecipeDetail(id) {
  try {
    const recipe = await get(`/recipes/${id}`);
    logUsage('recipe_viewed', id);
    const slug = nameToSlug(recipe.name);
    const recipeImg = `assets/images/recipes/${slug}.jpg`;
    const recipeImgSvg = `assets/images/recipes/${slug}.svg`;
    const safeName = escapeHtml(recipe.name);
    const overlay = document.createElement('div');
    overlay.className = 'recipe-detail-overlay';
    overlay.innerHTML = `
      <div class="recipe-detail-card">
        <div class="recipe-detail-image">
          ${recipe.photo_url
            ? `<img src="${recipe.photo_url}" alt="${safeName}" loading="lazy" onerror="var s=this;if(!s.dataset.f){s.dataset.f=1;s.src='${recipeImg}'}else if(!s.dataset.g){s.dataset.g=1;s.src='${recipeImgSvg}'}else{s.style.display='none'}">`
            : `<img src="${recipeImg}" alt="${safeName}" loading="lazy" onerror="var s=this;if(!s.dataset.f){s.dataset.f=1;s.src='${recipeImgSvg}'}else{s.style.display='none'}">`}
        </div>

        <div class="recipe-detail-header">
          <h2>${safeName}</h2>
          <button class="recipe-detail-close" id="detailClose">✕</button>
        </div>

        <div class="recipe-detail-meta">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${recipe.prep_time_minutes || '—'} min
          </span>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.25rem"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            ${recipe.servings || '—'} porciones
          </span>
          ${recipe.diet_tags ? recipe.diet_tags.split(',').map(t => `<span class="tag tag-primary">${escapeHtml(t.trim())}</span>`).join('') : ''}
        </div>

        ${recipe.description ? `<p style="margin-bottom:1.5rem;color:var(--text-secondary)">${escapeHtml(recipe.description)}</p>` : ''}

        ${recipe.ingredients?.length ? `
          <div class="recipe-detail-section">
            <h4>Ingredientes</h4>
            <ul>${recipe.ingredients.map(i => {
              const img = getIngredientImage(i.name);
              return `<li class="ingredient-item">${i.amount} ${i.unit} de ${escapeHtml(i.name)}<span class="ingredient-tooltip"><img src="${img}" alt="${escapeHtml(i.name)}" loading="lazy" onerror="var s=this;s.src='assets/images/ingredients/default-ingredient.svg'"></span></li>`;
            }).join('')}</ul>
          </div>
        ` : ''}

        ${recipe.steps?.length ? `
          <div class="recipe-detail-section">
            <h4>Pasos</h4>
            <ol class="recipe-detail-steps">${recipe.steps.map(s => `<li>${escapeHtml(s.instruction)}${s.timer_seconds ? ` <span class="tag tag-primary"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.2rem"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${s.timer_seconds >= 60 ? Math.floor(s.timer_seconds / 60) + 'm' + (s.timer_seconds % 60 ? ' ' + (s.timer_seconds % 60) + 's' : '') : s.timer_seconds + 's'}</span>` : ''}</li>`).join('')}</ol>
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
