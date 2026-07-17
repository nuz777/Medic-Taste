import { get, del } from '../services/api.js';

function nameToSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function recipeImgFallback(name, photoUrl) {
  const slug = nameToSlug(name);
  const jpg = `assets/images/recipes/${slug}.jpg`;
  const svg = `assets/images/recipes/${slug}.svg`;
  if (photoUrl) {
    return `<img src="${photoUrl}" alt="${name}" loading="lazy" onerror="var s=this;if(!s.dataset.f){s.dataset.f=1;s.src='${jpg}'}else if(!s.dataset.g){s.dataset.g=1;s.src='${svg}'}else{s.style.display='none';s.nextElementSibling.style.display='flex'}"><div class="recipe-card-full-placeholder" style="display:none">${name.charAt(0).toUpperCase()}</div>`;
  }
  return `<img src="${jpg}" alt="${name}" loading="lazy" onerror="var s=this;if(!s.dataset.f){s.dataset.f=1;s.src='${svg}'}else{s.style.display='none';s.nextElementSibling.style.display='flex'}"><div class="recipe-card-full-placeholder" style="display:none">${name.charAt(0).toUpperCase()}</div>`;
}

export async function renderFavorites(container) {
  container.innerHTML = `
    <div class="favorites-header">
      <h1>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.4rem;color:var(--error)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Favoritos
      </h1>
    </div>
    <div id="favGrid" class="recipes-grid">
      <div class="page-loading">Cargando favoritos...</div>
    </div>
  `;

  try {
    const favorites = await get('/favorites');

    const grid = document.getElementById('favGrid');

    if (!favorites.length) {
      grid.innerHTML = `
        <div class="favorites-empty">
          <div class="icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <h3>Sin favoritos aún</h3>
          <p>Explora recetas y agrega tus favoritas.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = favorites.map(f => `
      <article class="recipe-card-full" data-id="${f.recipe_id}">
        <div class="recipe-card-full-image">
          ${recipeImgFallback(f.name || 'Receta', f.photo_url)}
        </div>
        <div class="recipe-card-full-body">
          <h3>${f.name || 'Receta'}</h3>
          <button class="btn btn-outline" style="width:100%;margin-top:0.75rem;font-size:0.8rem" data-remove="${f.recipe_id}">Quitar de favoritos</button>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('[data-remove]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await del(`/favorites/${btn.dataset.remove}`);
          btn.closest('.recipe-card-full').remove();
          if (!grid.querySelector('.recipe-card-full')) {
            grid.innerHTML = `
              <div class="favorites-empty">
                <div class="icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-muted)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </div>
                <h3>Sin favoritos aún</h3>
                <p>Explora recetas y agrega tus favoritas.</p>
              </div>
            `;
          }
        } catch {
          alert('Error al quitar de favoritos');
        }
      });
    });

  } catch {
      container.innerHTML = `
    <div class="favorites-header">
      <h1>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:0.4rem;color:var(--error)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        Favoritos
      </h1>
    </div>
    <div class="page-error">Error al cargar favoritos. Verifica que el backend esté corriendo.</div>
  `;
  }
}