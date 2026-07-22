const flows = {
  start: {
    bot: "Hola, soy tu asistente de Medic-Taste. ¿En qué te puedo ayudar?",
    options: [
      { label: "¿Cómo empiezo?", next: "getting_started" },
      { label: "Usar el planificador", next: "planner" },
      { label: "Marcar comidas", next: "tracking" },
      { label: "Mis favoritos", next: "favorites" },
      { label: "Lista de compras", next: "shopping" },
      { label: "Entender mis macros", next: "macros" },
      { label: "Mi perfil y ajustes", next: "profile" },
      { label: "Reportar un problema", next: "report" }
    ]
  },
  getting_started: {
    bot: "Para comenzar: completa el cuestionario inicial para personalizar tu plan. Luego revisa tu dashboard diario y el planificador para ver tus comidas.",
    options: [
      { label: "¿Qué es el cuestionario?", next: "questionnaire_info" },
      { label: "¿Qué veo en el dashboard?", next: "dashboard_info" },
      { label: "Volver al inicio", next: "start" }
    ]
  },
  questionnaire_info: {
    bot: "El cuestionario te pregunta sobre tu tipo de alimentación, alergias, objetivo (perder peso, mantener, ganar músculo), cuántas comidas al día y cuánto tiempo cocinas. Con eso creamos un plan de 4 semanas personalizado para ti.",
    options: [
      { label: "¿Puedo cambiar mi plan después?", next: "change_plan" },
      { label: "Volver", next: "getting_started" }
    ]
  },
  dashboard_info: {
    bot: "El dashboard muestra tus comidas de hoy, el anillo de calorías consumidas vs tu objetivo diario, y el progreso de proteína, carbohidratos y grasas. Marca tus comidas como 'comido' desde el planificador para actualizar el progreso.",
    options: [
      { label: "¿Cómo marco una comida?", next: "tracking" },
      { label: "¿Qué significan los macros?", next: "macros" },
      { label: "Volver", next: "start" }
    ]
  },
  change_plan: {
    bot: "Sí, puedes regenerar tu plan desde el planificador con el botón 'Regenerar'. También puedes agregar o quitar comidas manualmente. Si quieres cambiar tus preferencias, ve a tu perfil.",
    options: [
      { label: "¿Cómo regenero el plan?", next: "planner_regen" },
      { label: "Volver", next: "start" }
    ]
  },
  planner: {
    bot: "El planificador te muestra las comidas de cada día de la semana. Puedes navegar entre días con las píldoras superiores.",
    options: [
      { label: "¿Cómo agrego una comida?", next: "planner_add" },
      { label: "¿Cómo regenero el día?", next: "planner_regen" },
      { label: "¿Cómo guardo mi plan?", next: "planner_save" },
      { label: "Volver", next: "start" }
    ]
  },
  planner_add: {
    bot: "Haz clic en 'Agregar comida' al final de las comidas del día. Selecciona el tipo de comida (desayuno, almuerzo, cena, snack) y busca la receta que quieras. Listo, ya queda en tu plan.",
    options: [
      { label: "¿Puedo sugerir comidas auto?", next: "planner_auto" },
      { label: "Volver al planificador", next: "planner" }
    ]
  },
  planner_regen: {
    bot: "Toca el botón 'Regenerar' en la parte superior del planificador. Esto creará comidas nuevas aleatorias para el día seleccionado. Si ya tenías algo planificado, se reemplazará.",
    options: [
      { label: "¿Y si quiero guardar?", next: "planner_save" },
      { label: "Volver", next: "planner" }
    ]
  },
  planner_auto: {
    bot: "Si el día está vacío, verás un botón 'Sugerir automáticamente'. Esto asigna un desayuno, almuerzo, cena y snack de las recetas disponibles. ¡Rápido y fácil!",
    options: [
      { label: "Volver al planificador", next: "planner" }
    ]
  },
  planner_save: {
    bot: "El botón 'Guardar' sincroniza tu plan con el servidor para que no se pierda. Tus comidas también se guardan localmente, pero es buena idea guardar por si cambias de dispositivo.",
    options: [
      { label: "Volver", next: "planner" }
    ]
  },
  tracking: {
    bot: "Desde el planificador, en el día de hoy verás un botón 'Comido' al lado de cada comida. Tócalo y la comida se registra automáticamente con sus calorías y macros.",
    options: [
      { label: "¿Dónde veo mi progreso?", next: "progress_info" },
      { label: "¿Qué pasa si llego a mi meta?", next: "goal_reached" },
      { label: "Volver", next: "start" }
    ]
  },
  progress_info: {
    bot: "En el dashboard ves el anillo de calorías y las barras de proteína, carbohidratos y grasas. En la sección de Progreso del sidebar ves tu avance semanal con gráficos detallados.",
    options: [
      { label: "¿Qué significan los macros?", next: "macros" },
      { label: "Volver", next: "start" }
    ]
  },
  goal_reached: {
    bot: "¡Felicidades! Cuando llegues a tu objetivo diario de calorías, aparecerá un modal de confirmación. Tus comidas restantes del día quedarán disponibles por si aún quieres comer, pero tu objetivo ya está cumplido.",
    options: [
      { label: "Volver", next: "start" }
    ]
  },
  favorites: {
    bot: "En la sección de Favoritos puedes ver todas las recetas que guardaste. Para agregar una, ve a Recetas y toca el corazón de la que te guste.",
    options: [
      { label: "¿Cómo quito un favorito?", next: "fav_remove" },
      { label: "Volver", next: "start" }
    ]
  },
  fav_remove: {
    bot: "En Favoritos, cada tarjeta tiene un botón 'Quitar de favoritos'. Tócalo y se elimina al instante. No se pierde la receta, solo la quitas de tu lista.",
    options: [
      { label: "Volver", next: "favorites" }
    ]
  },
  shopping: {
    bot: "La lista de compras te muestra los ingredientes de las comidas planificadas. Puedes marcar los que ya compraste y se tachan.",
    options: [
      { label: "¿Se genera automáticamente?", next: "shopping_auto" },
      { label: "Volver", next: "start" }
    ]
  },
  shopping_auto: {
    bot: "Sí, se genera según las comidas de tu plan semanal. Si agregas o quitas comidas del planificador, la lista se actualiza. También puedes agregar ingredientes manualmente.",
    options: [
      { label: "Volver", next: "shopping" }
    ]
  },
  macros: {
    bot: "Los macros son los tres grandes nutrientes: Proteína (para músculos), Carbohidratos (para energía) y Grasas (para funciones corporales). Tu plan está balanceado según tu objetivo.",
    options: [
      { label: "¿Cómo los ajusto?", next: "macros_adjust" },
      { label: "¿Qué significan los números?", next: "macros_numbers" },
      { label: "Volver", next: "start" }
    ]
  },
  macros_adjust: {
    bot: "Tus macros se ajustan según el cuestionario inicial. Si quieres cambiarlos, actualiza tu objetivo (perder peso, mantener, etc.) desde tu perfil y regenera tu plan.",
    options: [
      { label: "Volver", next: "macros" }
    ]
  },
  macros_numbers: {
    bot: "En el dashboard ves algo como '45/77g' de proteína. El primer número es lo que ya comiste, el segundo es tu meta diaria. Si el primero es igual o mayor, ya cumpliste ese macro.",
    options: [
      { label: "Volver", next: "macros" }
    ]
  },
  profile: {
    bot: "Desde tu perfil puedes ver y editar tu nombre, email, objetivo nutricional y preferencias de dieta.",
    options: [
      { label: "¿Puedo cambiar mi contraseña?", next: "profile_password" },
      { label: "¿Cómo cierro sesión?", next: "profile_logout" },
      { label: "Volver", next: "start" }
    ]
  },
  profile_password: {
    bot: "Por ahora la cambio de contraseña no está disponible desde la app. Si necesitas cambiarla, contacta al administrador.",
    options: [
      { label: "Volver", next: "profile" }
    ]
  },
  profile_logout: {
    bot: "Toca tu avatar en el sidebar y busca la opción de cerrar sesión. Tus datos se guardan en el servidor, así que la próxima vez que inicies sesión vuelves a donde estabas.",
    options: [
      { label: "Volver", next: "profile" }
    ]
  },
  report: {
    bot: "Si encontraste un error o algo no funciona bien, descríbelo brevemente y lo revisaremos lo antes posible.",
    options: [
      { label: "La app no carga", next: "report_load" },
      { label: "Las recetas no aparecen", next: "report_recipes" },
      { label: "Algo más", next: "report_other" }
    ]
  },
  report_load: {
    bot: "Si la app no carga, intenta: 1) Recargar la página. 2) Borrar caché del navegador. 3) Verificar tu conexión a internet. Si persiste, es posible que el servidor esté en mantenimiento.",
    options: [
      { label: "Volver", next: "report" }
    ]
  },
  report_recipes: {
    bot: "Si las recetas no aparecen, verifica tu conexión y que el backend esté corriendo. Si usas un plan con preferencias muy restrictivas, prueba a ser menos específico en el cuestionario.",
    options: [
      { label: "Volver", next: "report" }
    ]
  },
  report_other: {
    bot: "Gracias por reportarlo. Por favor revisa que tu navegador esté actualizado y que no tengas bloqueadores de scripts activos. Si el problema sigue, repórtalo por los canales oficiales.",
    options: [
      { label: "Volver al inicio", next: "start" }
    ]
  }
};

let history = [];
let renderTimeout = null;
let widgetEl = null;
let isOpen = false;

function scrollBottom() {
  const msgs = widgetEl.querySelector('.mt-chat-msgs');
  if (msgs) msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'mt-chat-bubble mt-chat-bot mt-chat-typing';
  el.innerHTML = '<span class="mt-chat-dot"></span><span class="mt-chat-dot"></span><span class="mt-chat-dot"></span>';
  widgetEl.querySelector('.mt-chat-msgs').appendChild(el);
  scrollBottom();
  return el;
}

function showResponse(nodeId) {
  const node = flows[nodeId];
  const msgs = widgetEl.querySelector('.mt-chat-msgs');

  const bb = document.createElement('div');
  bb.className = 'mt-chat-bubble mt-chat-bot';
  msgs.appendChild(bb);

  const text = node.bot;
  let i = 0;
  const speed = 20;

  function type() {
    if (i < text.length) {
      bb.textContent += text.charAt(i);
      i++;
      scrollBottom();
      setTimeout(type, speed);
    } else {
      if (node.options.length > 0) {
        const opts = document.createElement('div');
        opts.className = 'mt-chat-options';
        node.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'mt-chat-opt-btn';
          btn.textContent = opt.label;
          btn.onclick = () => {
            history.push(opt.label);
            render(opt.next);
          };
          opts.appendChild(btn);
        });

        if (nodeId !== 'start') {
          const homeBtn = document.createElement('button');
          homeBtn.className = 'mt-chat-home-btn';
          homeBtn.textContent = '← Volver al inicio';
          homeBtn.onclick = () => {
            history = [];
            render('start');
          };
          opts.appendChild(homeBtn);
        }

        msgs.appendChild(opts);
      }
      scrollBottom();
    }
  }

  type();
}

function render(nodeId) {
  if (renderTimeout) clearTimeout(renderTimeout);

  const msgs = widgetEl.querySelector('.mt-chat-msgs');
  msgs.innerHTML = '';

  if (nodeId !== 'start' && history.length > 0) {
    const ub = document.createElement('div');
    ub.className = 'mt-chat-bubble mt-chat-user';
    ub.textContent = history[history.length - 1];
    msgs.appendChild(ub);
  }

  const typingEl = showTyping();

  const delay = 500 + Math.random() * 500;
  renderTimeout = setTimeout(() => {
    renderTimeout = null;
    typingEl.remove();
    showResponse(nodeId);
  }, delay);
}

function toggleChat() {
  isOpen = !isOpen;
  widgetEl.querySelector('.mt-chat-window').classList.toggle('mt-chat-open', isOpen);
  widgetEl.querySelector('.mt-chat-fab').classList.toggle('mt-chat-fab-active', isOpen);

  if (isOpen) {
    const msgs = widgetEl.querySelector('.mt-chat-msgs');
    if (!msgs.children.length) {
      history = [];
      render('start');
    }
  }
}

export function initChatbot() {
  widgetEl = document.createElement('div');
  widgetEl.className = 'mt-chat-widget';
  widgetEl.innerHTML = `
    <button class="mt-chat-fab" aria-label="Abrir ayuda">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
    <div class="mt-chat-window">
      <div class="mt-chat-head">
        <img src="assets/images/doctor.webp" alt="Asistente" class="mt-chat-head-avatar">
        <div class="mt-chat-head-info">
          <div class="mt-chat-head-name">Asistente</div>
          <div class="mt-chat-head-sub">Guía Medic-Taste</div>
        </div>
        <button class="mt-chat-close" aria-label="Cerrar chat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="mt-chat-msgs"></div>
    </div>`;

  document.body.appendChild(widgetEl);

  widgetEl.querySelector('.mt-chat-fab').addEventListener('click', toggleChat);
  widgetEl.querySelector('.mt-chat-close').addEventListener('click', toggleChat);
}
