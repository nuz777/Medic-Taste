const flows = {
  start: {
    bot: "Hola, bienvenido a Saunuz. ¿En qué te puedo ayudar?",
    options: [
      { label: "Juegos de PC", next: "pc" },
      { label: "Juegos de Android", next: "android" },
      { label: "Herramientas gratis", next: "tools" },
      { label: "Otro / Reportar problema", next: "other" }
    ]
  },
  pc: {
    bot: "Genial, tenemos juegos de PC para todos los gustos. ¿Qué necesitas?",
    options: [
      { label: "¿Cómo descargo un juego?", next: "pc_download" },
      { label: "El juego no me abre", next: "pc_error" },
      { label: "¿Qué requisitos necesito?", next: "pc_req" }
    ]
  },
  android: {
    bot: "Tenemos juegos Android gratis. ¿En qué te ayudo?",
    options: [
      { label: "¿Cómo instalo el APK?", next: "apk_install" },
      { label: "El APK me da error", next: "apk_error" },
      { label: "¿Es seguro instalar?", next: "apk_safe" }
    ]
  },
  tools: {
    bot: "Nuestras herramientas son 100% gratis. ¿Cuál es tu duda?",
    options: [
      { label: "¿Cómo uso una herramienta?", next: "tools_how" },
      { label: "Una herramienta no funciona", next: "tools_error" },
      { label: "¿Tienen app móvil?", next: "tools_app" }
    ]
  },
  other: {
    bot: "Entendido. ¿Qué quieres hacer?",
    options: [
      { label: "Reportar un link caído", next: "report_link" },
      { label: "Sugerir un juego o herramienta", next: "suggest" },
      { label: "Otro problema", next: "contact" }
    ]
  },
  pc_download: {
    bot: "Para descargar un juego de PC: haz clic en el botón de descarga de la página del juego. Si hay varios links, prueba el primero. La descarga viene en .zip o .rar, necesitas WinRAR o 7-Zip para extraerla. ¡Listo para jugar!",
    options: []
  },
  pc_error: {
    bot: "Si el juego no abre, intenta ejecutarlo como administrador. También asegúrate de tener instalado Visual C++ Redistributable y DirectX, los links están en la página del juego. A veces el antivirus bloquea los ejecutables, puedes desactivarlo temporalmente y probar de nuevo.",
    options: []
  },
  pc_req: {
    bot: "Los requisitos mínimos están en la página de cada juego, justo debajo del título. Si tu PC tiene menos de 4GB de RAM y GPU integrada, busca juegos con la etiqueta 'bajo rendimiento'.",
    options: []
  },
  apk_install: {
    bot: "Para instalar un APK, primero descarga el archivo desde Saunuz. Luego ve a Ajustes > Seguridad y activa la opción 'Fuentes desconocidas'. Por último abre el APK descargado y toca Instalar. Así de fácil.",
    options: []
  },
  apk_error: {
    bot: "Si el APK da error: verifica que tengas espacio suficiente, que la versión de Android sea compatible (indicada en la página) y que hayas activado 'Fuentes desconocidas'. Si persiste, prueba otro link de descarga.",
    options: []
  },
  apk_safe: {
    bot: "Todos los APKs de Saunuz son verificados manualmente antes de publicarse. Aun así, te recomendamos tener Malwarebytes en tu Android. ¡Jugamos limpio!",
    options: []
  },
  tools_how: {
    bot: "Cada herramienta tiene una guía rápida justo debajo del título. También puedes ver el video tutorial si está disponible. Si aún tienes dudas, escríbenos por el formulario de contacto.",
    options: []
  },
  tools_error: {
    bot: "Si una herramienta no funciona, prueba recargando la página. También asegúrate de estar usando Chrome o Firefox. A veces los bloqueadores de anuncios interfieren, puedes desactivarlos. Si el problema sigue, repórtalo para revisarlo.",
    options: []
  },
  tools_app: {
    bot: "Por ahora no tenemos app móvil oficial, pero la web de Saunuz está optimizada para móviles. Puedes añadirla a tu pantalla de inicio como si fuera una app.",
    options: []
  },
  report_link: {
    bot: "Gracias por avisar. Usa el formulario de contacto en la página del juego o herramienta y lo revisamos en menos de 24 horas.",
    options: []
  },
  suggest: {
    bot: "Nos encanta recibir sugerencias. Envíanos el nombre del juego o herramienta que quieres ver en Saunuz por el formulario de contacto y lo evaluamos.",
    options: []
  },
  contact: {
    bot: "Para cualquier otro problema, contáctanos desde el formulario de contacto en saunuz.com. Respondemos en menos de 48 horas.",
    options: []
  }
};

let history = [];
let renderTimeout = null;

function scrollBottom() {
  const msgs = document.getElementById('msgs');
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'bubble bot typing';
  el.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  document.getElementById('msgs').appendChild(el);
  scrollBottom();
  return el;
}

function showResponse(nodeId) {
  const node = flows[nodeId];
  const msgs = document.getElementById('msgs');

  const bb = document.createElement('div');
  bb.className = 'bubble bot';
  msgs.appendChild(bb);

  const text = node.bot;
  let i = 0;
  const speed = 30;

  function type() {
    if (i < text.length) {
      bb.textContent += text.charAt(i);
      i++;
      scrollBottom();
      setTimeout(type, speed);
    } else {
      if (node.options.length > 0) {
        const opts = document.createElement('div');
        opts.className = 'options';
        node.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'opt-btn';
          btn.textContent = opt.label;
          btn.onclick = () => {
            history.push(opt.label);
            render(opt.next);
          };
          opts.appendChild(btn);
        });
        msgs.appendChild(opts);
      }
      document.getElementById('backBtn').style.display = nodeId === 'start' ? 'none' : 'flex';
      scrollBottom();
    }
  }

  type();
}

function render(nodeId) {
  if (renderTimeout) clearTimeout(renderTimeout);

  const msgs = document.getElementById('msgs');
  msgs.innerHTML = '';

  if (nodeId !== 'start' && history.length > 0) {
    const ub = document.createElement('div');
    ub.className = 'bubble user';
    ub.textContent = history[history.length - 1];
    msgs.appendChild(ub);
  }

  const typingEl = showTyping();

  const delay = 600 + Math.random() * 600;
  renderTimeout = setTimeout(() => {
    renderTimeout = null;
    typingEl.remove();
    showResponse(nodeId);
  }, delay);
}

function goBack() {
  if (renderTimeout) clearTimeout(renderTimeout);
  history = [];
  render('start');
}

render('start');
