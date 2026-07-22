# Prompt para OpenCode — Saunuz Chatbot

Pega esto en OpenCode para extender el chatbot:

---

Tengo un chatbot de selección múltiple (árbol de decisiones) para la web Saunuz, un sitio de juegos de PC, Android y herramientas gratis.

Estructura del proyecto:
```
saunuz-chatbot/
├── public/
│   ├── index.html   ← estructura HTML del chat
│   ├── style.css    ← estilos (tema oscuro, morado)
│   └── bot.js       ← lógica del árbol de flujos
└── vercel.json      ← config de deploy (solo static)
```

Cómo funciona bot.js:
- El objeto `flows` define cada nodo del árbol
- Cada nodo tiene: `bot` (texto de respuesta) y `options` (array de botones con `label` y `next`)
- `render(nodeId)` muestra el nodo actual
- Al llegar a un nodo sin options, se muestra solo la respuesta final
- `goBack()` reinicia al nodo `start`

Para agregar un nuevo flujo, agrego una nueva key en `flows`:
```js
nuevo_tema: {
  bot: "Texto que responde el bot",
  options: [
    { label: "Opción visible", next: "otro_nodo" }
  ]
}
```

Es un proyecto 100% estático (HTML + CSS + JS), sin backend. Se despliega en Vercel con vercel.json ya configurado.

haz esto


- "recuerda que esto es estilo anime, tal vez mejorar el diseño de ese perfil con un emoji que sea una mona china "
- "Agrega animación de escritura (typing indicator) antes de mostrar la respuesta del bot"
- "Haz que el chat se pueda embeber como widget flotante en cualquier página web"
- "Agrega un nuevo flujo para responder preguntas sobre membresías premium"
