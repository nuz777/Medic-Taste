import { get, post } from '../services/api.js';
import { getUser, completeOnboarding } from '../services/authService.js';

const STORAGE_KEY = 'tf_preferences';

const questions = [
  {
    title: '¿Cómo te describirías?',
    subtitle: 'Selecciona tu tipo de alimentación',
    name: 'diet',
    type: 'radio',
    options: [
      { value: 'omnivore', label: 'Omnívoro', desc: 'Como de todo sin restricciones' },
      { value: 'vegetarian', label: 'Vegetariano', desc: 'No como carne ni pescado' },
      { value: 'vegan', label: 'Vegano', desc: 'No como ningún producto animal' },
      { value: 'keto', label: 'Keto / Bajo en carbos', desc: 'Dieta alta en grasas y baja en carbohidratos' },
      { value: 'pescatarian', label: 'Pescetariano', desc: 'No como carne, pero sí pescado' },
    ],
  },
  {
    title: '¿Tienes alguna alergia o intolerancia?',
    subtitle: 'Puedes seleccionar varias opciones',
    name: 'allergies',
    type: 'checkbox',
    options: [
      { value: 'gluten', label: 'Gluten' },
      { value: 'lactose', label: 'Lactosa' },
      { value: 'nuts', label: 'Frutos secos' },
      { value: 'eggs', label: 'Huevo' },
      { value: 'soy', label: 'Soja' },
      { value: 'none', label: 'Ninguna' },
    ],
  },
  {
    title: '¿Cuál es tu objetivo principal?',
    subtitle: 'Esto nos ayuda a ajustar las porciones y nutrientes',
    name: 'goal',
    type: 'radio',
    options: [
      { value: 'lose', label: 'Perder peso', desc: 'Reducir calorías y grasas' },
      { value: 'maintain', label: 'Mantener peso', desc: 'Comer balanceado' },
      { value: 'gain', label: 'Ganar músculo', desc: 'Aumentar proteínas y calorías' },
      { value: 'energy', label: 'Más energía', desc: 'Comidas ligeras y nutritivas' },
    ],
  },
  {
    title: '¿Cuántas comidas al día prefieres?',
    subtitle: 'Incluyendo comidas principales y snacks',
    name: 'meals',
    type: 'radio',
    options: [
      { value: '3', label: '3 comidas', desc: 'Desayuno, almuerzo y cena' },
      { value: '4', label: '4 comidas', desc: '3 comidas + 1 snack' },
      { value: '5', label: '5 comidas', desc: '3 comidas + 2 snacks' },
    ],
  },
  {
    title: '¿Cuánto tiempo quieres dedicar a cocinar?',
    subtitle: 'Recetas ajustadas a tu disponibilidad',
    name: 'cookTime',
    type: 'radio',
    options: [
      { value: 'quick', label: 'Rápido y fácil', desc: 'Menos de 20 minutos' },
      { value: 'moderate', label: 'Moderado', desc: 'Entre 20 y 40 minutos' },
      { value: 'elaborate', label: 'Elaborado', desc: 'Más de 40 minutos, me encanta cocinar' },
    ],
  },
];

export function renderQuestionnaire(container) {
  container.innerHTML = `
    <div class="questionnaire-section">
      <div class="questionnaire-card">
        <h1>Conozcámonos</h1>
        <p>Responde estas preguntas para que podamos recomendarte el plan ideal.</p>

        <div class="questionnaire-progress" id="qProgress"></div>

        <div id="qSteps"></div>

        <div class="questionnaire-actions">
          <button class="btn btn-outline" id="qPrevBtn" style="visibility:hidden">Anterior</button>
          <button class="btn btn-primary" id="qNextBtn">Siguiente</button>
        </div>
      </div>
    </div>
  `;

  let currentStep = 0;
  const answers = loadPreferences() || {};

  const progressEl = document.getElementById('qProgress');
  const stepsEl = document.getElementById('qSteps');
  const prevBtn = document.getElementById('qPrevBtn');
  const nextBtn = document.getElementById('qNextBtn');

  function buildProgress() {
    progressEl.innerHTML = questions.map((_, i) =>
      `<div class="questionnaire-progress-bar ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'filled' : ''}"></div>`
    ).join('');
  }

  function buildStep(index) {
    const q = questions[index];
    const val = answers[q.name];
    stepsEl.innerHTML = `
      <div class="questionnaire-step active" style="animation:none">
        <h2>${q.title}</h2>
        <p>${q.subtitle}</p>
        <div class="questionnaire-options" id="qOptions">
          ${q.options.map((opt, i) => {
            const checked = q.type === 'checkbox'
              ? (Array.isArray(val) && val.includes(opt.value))
              : val === opt.value;
            return `
              <div class="questionnaire-option ${checked ? 'selected' : ''}" data-value="${opt.value}" style="animation:fadeIn 0.3s ease ${i * 0.06}s both">
                <input type="${q.type}" name="${q.name}" value="${opt.value}" ${checked ? 'checked' : ''} ${q.type === 'radio' ? '' : ''}>
                <label>${opt.label}${opt.desc ? `<small>${opt.desc}</small>` : ''}</label>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const options = document.querySelectorAll('.questionnaire-option');
    options.forEach(opt => {
      const input = opt.querySelector('input');
      opt.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          input.checked = !input.checked;
        }
        if (q.type === 'radio') {
          options.forEach(o => o.classList.remove('selected'));
          if (input.checked) opt.classList.add('selected');
          answers[q.name] = input.value;
        } else {
          if (q.name === 'allergies') {
            if (input.value === 'none' && input.checked) {
              options.forEach(o => {
                const inp = o.querySelector('input');
                if (inp.value !== 'none') {
                  inp.checked = false;
                  inp.disabled = true;
                  o.classList.add('disabled');
                  o.classList.remove('selected');
                }
              });
              opt.classList.add('selected');
              answers[q.name] = ['none'];
            } else if (input.value !== 'none' && input.checked) {
              const noneOpt = Array.from(options).find(o => o.querySelector('input').value === 'none');
              if (noneOpt) {
                const noneInp = noneOpt.querySelector('input');
                noneInp.checked = false;
                noneOpt.classList.remove('selected');
              }
              options.forEach(o => {
                const inp = o.querySelector('input');
                inp.disabled = false;
                o.classList.remove('disabled');
              });
              opt.classList.add('selected');
              answers[q.name] = [...document.querySelectorAll(`input[name="${q.name}"]:checked`)].map(el => el.value);
            } else {
              opt.classList.toggle('selected', input.checked);
              answers[q.name] = [...document.querySelectorAll(`input[name="${q.name}"]:checked`)].map(el => el.value);
              if (!answers[q.name].length) {
                options.forEach(o => {
                  o.querySelector('input').disabled = false;
                  o.classList.remove('disabled');
                });
              }
            }
          } else {
            opt.classList.toggle('selected', input.checked);
            answers[q.name] = [...document.querySelectorAll(`input[name="${q.name}"]:checked`)].map(el => el.value);
          }
        }
        savePreferences();
      });
      input.addEventListener('change', () => {
        if (q.type === 'radio') {
          options.forEach(o => o.classList.remove('selected'));
          if (input.checked) opt.classList.add('selected');
          answers[q.name] = input.value;
        } else {
          if (q.name === 'allergies') {
            if (input.value === 'none' && input.checked) {
              options.forEach(o => {
                const inp = o.querySelector('input');
                if (inp.value !== 'none') {
                  inp.checked = false;
                  inp.disabled = true;
                  o.classList.add('disabled');
                  o.classList.remove('selected');
                }
              });
              opt.classList.add('selected');
              answers[q.name] = ['none'];
            } else if (input.value !== 'none' && input.checked) {
              const noneOpt = Array.from(options).find(o => o.querySelector('input').value === 'none');
              if (noneOpt) {
                const noneInp = noneOpt.querySelector('input');
                noneInp.checked = false;
                noneOpt.classList.remove('selected');
              }
              options.forEach(o => {
                const inp = o.querySelector('input');
                inp.disabled = false;
                o.classList.remove('disabled');
              });
              opt.classList.add('selected');
              answers[q.name] = [...document.querySelectorAll(`input[name="${q.name}"]:checked`)].map(el => el.value);
            } else {
              opt.classList.toggle('selected', input.checked);
              answers[q.name] = [...document.querySelectorAll(`input[name="${q.name}"]:checked`)].map(el => el.value);
              if (!answers[q.name].length) {
                options.forEach(o => {
                  o.querySelector('input').disabled = false;
                  o.classList.remove('disabled');
                });
              }
            }
          } else {
            opt.classList.toggle('selected', input.checked);
            answers[q.name] = [...document.querySelectorAll(`input[name="${q.name}"]:checked`)].map(el => el.value);
          }
        }
        savePreferences();
      });
    });
  }

  function savePreferences() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }

  function showStep(index, direction) {
    currentStep = index;
    buildProgress();

    const currentEl = stepsEl.querySelector('.questionnaire-step.active');
    if (currentEl) {
      currentEl.classList.remove('active');
      currentEl.classList.add(direction === 'next' ? 'slide-out' : 'slide-out');
      const outAnim = direction === 'next' ? 'slideOutLeft' : 'slideOutRight';
      currentEl.style.animation = `${outAnim} 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
      setTimeout(() => {
        currentEl.style.animation = '';
        currentEl.classList.remove('slide-out');
      }, 260);
    }

    setTimeout(() => {
      buildStep(index);
      const newEl = stepsEl.querySelector('.questionnaire-step');
      if (newEl) {
        const inAnim = direction === 'next' ? 'slideInRight' : 'slideInLeft';
        newEl.style.animation = `${inAnim} 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards`;
      }
    }, currentEl ? 150 : 0);

    prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = index === questions.length - 1 ? 'Generar mi plan' : 'Siguiente';
  }

  function getNextUnanswered(current) {
    for (let i = current; i < questions.length; i++) {
      const q = questions[i];
      const val = answers[q.name];
      if (q.type === 'checkbox' && Array.isArray(val) && val.length > 0) return i;
      if (q.type === 'radio' && val) return i;
    }
    return current;
  }

  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) showStep(currentStep - 1, 'prev');
  });

  nextBtn.addEventListener('click', async () => {
    const q = questions[currentStep];
    const val = answers[q.name];
    if (q.type === 'radio' && !val) {
      showStepError('Selecciona una opción antes de continuar');
      return;
    }
    if (q.type === 'checkbox' && (!Array.isArray(val) || val.length === 0)) {
      showStepError('Selecciona al menos una opción');
      return;
    }

    if (currentStep < questions.length - 1) {
      showStep(currentStep + 1, 'next');
    } else {
      await generatePlan(container);
    }
  });

  function showStepError(msg) {
    const existing = stepsEl.querySelector('.questionnaire-error');
    if (!existing) {
      const err = document.createElement('p');
      err.className = 'questionnaire-error';
      err.style.cssText = 'color:var(--error);font-size:0.85rem;margin-top:0.5rem;';
      err.textContent = msg;
      stepsEl.appendChild(err);
    }
  }

  showStep(0, 'next');
}

async function generatePlan(container) {
  const nextBtn = document.getElementById('qNextBtn');
  nextBtn.disabled = true;
  nextBtn.textContent = 'Generando...';

  try {
    const prefs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const diet = prefs.diet || '';
    const maxTime = prefs.cookTime === 'quick' ? 20 : prefs.cookTime === 'moderate' ? 40 : 200;
    const mealsCount = parseInt(prefs.meals || '4', 10);
    const allergies = Array.isArray(prefs.allergies) ? prefs.allergies.filter(a => a !== 'none') : [];

    const params = new URLSearchParams();
    if (diet && diet !== 'omnivore') params.set('diet', diet);
    params.set('limit', '100');

    const recipes = await get(`/recipes?${params}`);

    if (!recipes.length) {
      showError(container, 'No encontramos recetas con tus preferencias. Intenta ajustar tus respuestas.');
      return;
    }

    const filtered = recipes.filter(r => {
      if (maxTime < 200 && r.prep_time_minutes && r.prep_time_minutes > maxTime) return false;
      return true;
    });

    const breakfastRecipes = filtered.filter(r => {
      const name = r.name.toLowerCase();
      return name.includes('batido') || name.includes('avena') || name.includes('huevo') || 
             name.includes('smoothie') || name.includes('panqueque') || name.includes('tostada') || 
             name.includes('yogur') || name.includes('frutas') || name.includes('tortilla') ||
             name.includes('bowl de') || name.includes('revuelto');
    });
    const lunchRecipes = filtered.filter(r => {
      const name = r.name.toLowerCase();
      return name.includes('pollo') || name.includes('pasta') || name.includes('ensalada') || 
             name.includes('bowl') || name.includes('tacos') || name.includes('salmón') || 
             name.includes('garbanzo') || name.includes('quinoa') || name.includes('arroz') ||
             name.includes('lentejas') || name.includes('teriyaki') || name.includes('curry');
    });
    const dinnerRecipes = filtered.filter(r => {
      const name = r.name.toLowerCase();
      return name.includes('sopa') || name.includes('merluza') || name.includes('crema') || 
             name.includes('revuelto') || name.includes('pescado') || name.includes('pechuga') ||
             name.includes('calabacín') || name.includes('champiñón') || name.includes('marinara') ||
             name.includes('merluza');
    });
    const snackRecipes = filtered.filter(r => {
      const name = r.name.toLowerCase();
      return name.includes('hummus') || name.includes('energizante') || name.includes('edamame') || 
             name.includes('batido verde') || name.includes('frutos secos') || name.includes('ricotta') ||
             name.includes('batido de') || name.includes('manzana');
    });

    const getRecipesForType = (type) => {
      let pool;
      switch(type) {
        case 'desayuno': pool = breakfastRecipes.length ? breakfastRecipes : filtered; break;
        case 'almuerzo': pool = lunchRecipes.length ? lunchRecipes : filtered; break;
        case 'cena': pool = dinnerRecipes.length ? dinnerRecipes : filtered; break;
        case 'snack': pool = snackRecipes.length ? snackRecipes : filtered; break;
        default: pool = filtered;
      }
      return [...pool].sort(() => Math.random() - 0.5);
    };

    const weekPlan = {};
    const today = new Date();
    const monday = new Date(today);
    const dayOfWeek = today.getDay();
    const mondayDiff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    monday.setDate(today.getDate() + mondayDiff);

    const NUM_WEEKS = 4;

    for (let w = 0; w < NUM_WEEKS; w++) {
      const weekMonday = new Date(monday);
      weekMonday.setDate(monday.getDate() + (w * 7));

      const usedRecipesWeek = new Set();

      for (let d = 0; d < 7; d++) {
        const date = new Date(weekMonday);
        date.setDate(weekMonday.getDate() + d);
        const dateStr = date.toISOString().split('T')[0];

        let dayMealsCount;
        if (d < 5) {
          dayMealsCount = mealsCount + (Math.random() > 0.5 ? 1 : 0);
        } else {
          dayMealsCount = mealsCount - (Math.random() > 0.7 ? 1 : 0);
        }
        dayMealsCount = Math.max(3, Math.min(5, dayMealsCount));

        const mealTypes = ['desayuno', 'almuerzo', 'cena'];
        if (dayMealsCount >= 4) mealTypes.push('snack');
        if (dayMealsCount >= 5) mealTypes.push('snack');

        const dayMeals = [];

        for (const mealType of mealTypes) {
          const pool = getRecipesForType(mealType);
          let recipe = pool.find(r => !usedRecipesWeek.has(r.id));
          if (!recipe) {
            usedRecipesWeek.clear();
            recipe = pool.find(r => !usedRecipesWeek.has(r.id)) || pool[Math.floor(Math.random() * pool.length)];
          }
          usedRecipesWeek.add(recipe.id);

          dayMeals.push({
            recipe_id: recipe.id,
            recipe_name: recipe.name,
            meal_type: mealType,
            plan_date: dateStr,
            photo_url: recipe.photo_url,
          });
        }
        weekPlan[dateStr] = dayMeals;
      }
    }

    localStorage.setItem('tf_week_plan', JSON.stringify(weekPlan));
    localStorage.setItem('tf_questionnaire_done', 'true');
    completeOnboarding().catch(() => {});

    const allMeals = Object.entries(weekPlan).flatMap(([dateStr, meals]) =>
      meals.map((meal) => ({
        recipe_id: meal.recipe_id,
        plan_date: dateStr,
        meal_type: meal.meal_type,
      }))
    );
    await Promise.allSettled(allMeals.map((m) => post('/planner', m)));

    container.innerHTML = `
      <div class="questionnaire-section">
        <div class="questionnaire-card" style="text-align:center;animation:bounceIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards">
          <div style="font-size:4rem;margin-bottom:1rem;animation:bounceIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards">🎉</div>
          <h1 style="-webkit-text-fill-color:initial;background:none">¡Plan generado!</h1>
          <p>Hemos creado 4 semanas de menús personalizados para ti, con ${mealsCount} comidas diarias variadas.</p>
          <div style="margin-top:2rem;display:flex;flex-direction:column;gap:0.75rem;align-items:center">
            <button class="btn btn-primary btn-lg" id="goToPlannerBtn" style="animation:pulse 2s ease infinite">Ver mi plan semanal</button>
            <button class="btn btn-outline" id="goToDashboardBtn">Ir al Dashboard</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('goToPlannerBtn').addEventListener('click', () => {
      window.location.hash = 'planner';
    });
    document.getElementById('goToDashboardBtn').addEventListener('click', () => {
      window.location.hash = 'dashboard';
    });

  } catch (err) {
    showError(container, 'Error al generar el plan. Verifica que el backend esté corriendo.');
  }
}

function showError(container, msg) {
  container.innerHTML = `
    <div class="page-error">
      <p>${msg}</p>
      <button class="btn btn-primary" onclick="window.location.hash='questionnaire'" style="margin-top:1rem">Intentar de nuevo</button>
    </div>
  `;
}

export function loadPreferences() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function hasCompletedQuestionnaire() {
  if (localStorage.getItem('tf_questionnaire_done') === 'true') return true;
  const user = getUser();
  return user && user.onboarding_completed === 1;
}