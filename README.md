# Santiago Portfolio

Landing page de una sola página construida con React, Vite y Tailwind CSS. Sitio oscuro, minimalista, con animaciones sutiles y responsive para desktop, tablet y móvil.

## Stack

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/) — build tool y dev server
- [Tailwind CSS v4](https://tailwindcss.com/) — estilos
- [lucide-react](https://lucide.dev/) — íconos
- [Oxlint](https://oxc.rs/) — linting

## Secciones

- Hero
- Sobre mí
- Habilidades técnicas
- Experiencia
- Proyectos destacados
- Contacto

Incluye reveal-on-scroll, un fondo con glow que sigue el cursor, y soporte para `prefers-reduced-motion`.

## Empezar

Requiere Node.js 18 o superior.

\`\`\`bash
git clone https://github.com/SantiOrteal/santiago-portfolio.git
cd santiago-portfolio
npm install
npm run dev
\`\`\`

Otros comandos disponibles:

\`\`\`bash
npm run build     # compila para producción en /dist
npm run preview   # sirve el build de producción localmente
npm run lint      # corre Oxlint sobre src/
\`\`\`

## Estructura del proyecto

\`\`\`
src/
├── components/       # componentes de cada sección + piezas compartidas
├── data/
│   └── content.js     # copy y datos del sitio
├── hooks/
│   └── useReveal.js   # animación de aparición al hacer scroll
├── index.css          # tokens de diseño (colores, fuentes) y utilidades
├── App.jsx
└── main.jsx
\`\`\`

El contenido del sitio (textos, skills, experiencia, proyectos, links) está centralizado en `src/data/content.js`.

## Despliegue

Compatible con Vercel, Netlify o Cloudflare Pages — detectan la configuración de Vite automáticamente (`npm run build`, carpeta de salida `dist`).

## Licencia

MIT

---

**Santiago Ortega** — [GitHub](https://github.com/SantiOrteal) · [LinkedIn](https://www.linkedin.com/in/santiago-orteal/)