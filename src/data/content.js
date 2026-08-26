// Todo el copy y los datos del sitio viven aquí para que sea fácil de editar
// sin tocar los componentes. Los campos marcados con "// TODO" son
// placeholders pensados para que Santiago los reemplace con información real.

export const profile = {
  name: "Santiago Ortega",
  role: "Full Stack Developer",
  location: "Saltillo / Monterrey, México",
  email: "santiago.orteal@gmail.com", // 
  github: "https://github.com/SantiOrteal", // 
  linkedin: "https://www.linkedin.com/in/santiago-orteal/", // 
};

export const hero = {
  eyebrow: "Disponible para nuevos proyectos",
  headline: "Interfaces claras para sistemas que no pueden fallar.",
  subline:
    "Frontend Developer desde 2019, especializado en React y TypeScript. Construyo herramientas para operaciones empresariales reales — y proyectos propios donde experimento sin límites.",
  meta: ["React", "TypeScript", "Desde 2019"],
};

export const about = {
  paragraphs: [
    "Soy desarrollador frontend desde 2019, enfocado en React, JavaScript y TypeScript. Me gusta el trabajo donde el detalle importa: una tabla que carga rápido, un formulario que no confunde, una interfaz que un equipo de operación usa todos los días sin pensar en ella.",
    "Actualmente trabajo dentro de operaciones de Supply Chain, dando seguimiento y desarrollando sobre procesos de Warehouse, Logistics y Purchasing — atendiendo stories, bugs y tickets en sistemas como NetSuite, y apoyándome en herramientas de observabilidad como Dynatrace y Kibana para entender qué está pasando de verdad en producción.",
    "Fuera del entorno empresarial disfruto construir proyectos personales, probar librerías nuevas y llevar mi stack (React, Vite, Tailwind, Node) a lugares distintos a los del trabajo diario.",
  ],
  card: {
    label: "whoami",
    lines: [
      { k: "rol", v: "Frontend Developer" },
      { k: "desde", v: "2019" },
      { k: "foco", v: "React · TypeScript" },
      { k: "ahora", v: "Supply Chain Ops" },
      { k: "base", v: "México" },
    ],
  },
};

export const skillGroups = [
  {
    title: "Frontend",
    note: "Construcción de interfaces",
    skills: [
      "React",
      "JavaScript",
      "TypeScript",
      "Vite.js",
      "Tailwind CSS",
      "TanStack Table",
    ],
  },
  {
    title: "Backend & Datos",
    note: "Soporte y servicios",
    skills: ["Node.js", "Java", "Spring Boot", "SQL"],
  },
  {
    title: "Enterprise & Observabilidad",
    note: "Entornos de producción real",
    skills: ["NetSuite", "Dynatrace", "Kibana", "DataStax"],
  },
];

export const experience = [
  {
    period: "2023 — Presente",
    role: "Full Stack Developer & Operations Analyst",
    org: "Accenture",
    points: [
      "Desarrollo y mantenimiento de interfaces frontend para procesos de Warehouse, Logistics y Purchasing dentro de operaciones de Supply Chain.",
      "Seguimiento a stories, bugs y tickets, integrando sistemas como NetSuite con herramientas de observabilidad (Dynatrace, Kibana) y datos en DataStax.",
      "Miembro de la iniciativa interna Trends & Innovation (T&I), enfocada en microservicios y componentes reutilizables con IA para equipos internos.",
    ],
  },
  {
    period: "2021 — 2023",
    role: "Operations Analyst",
    org: "Accenture",
    points: [
      "Incorporación al equipo de operaciones, con transición progresiva hacia desarrollo frontend.",
      "Base para la promoción a Full Stack Developer & Operations Analyst en 2023.",
    ],
  },
  {
    period: "2019 — 2021",
    role: "Frontend Developer",
    org: "Grupo W", // 
    points: [
      "Desarrollo de sitios y aplicaciones web utilizando JavaScript, PHP, HTML5, CSS, React, TypeScript, Gatsby y WordPress.",
      "Optimización de rendimiento y SEO para mejorar la experiencia de usuario y el posicionamiento de los sitios en Google.",
      "Desarrollo de nuevos componentes y funcionalidades, además de mantenimiento y mejora continua de sitios existentes.",
  ],
  },
];

export const projects = [
  {
    title: "Warehouse Ops Dashboard",
    description:
      "Panel de inventario y órdenes construido para practicar tablas de datos grandes: filtros combinados, orden por columna y paginación fluida sobre miles de filas simuladas.",
    tags: ["React", "TypeScript", "TanStack Table", "Vite"],
    href: "#", // TODO: enlazar al repositorio real
    kind: "Proyecto personal",
  },
  {
    title: "DevPulse",
    description:
      "Mini monitor de estado de servicios inspirado en los dashboards de observabilidad que usa día a día — endpoints simulados, historial de uptime y alertas visuales simples.",
    tags: ["React", "Node.js", "Tailwind CSS"],
    href: "#", // TODO: enlazar al repositorio real
    kind: "Proyecto personal",
  },
  {
    title: "UI Kit ligero",
    description:
      "Colección propia de componentes reutilizables (botones, tablas, formularios) para arrancar proyectos nuevos más rápido, sin depender de un framework de UI completo.",
    tags: ["React", "TypeScript", "Tailwind CSS"],
    href: "#", // TODO: enlazar al repositorio real
    kind: "Proyecto personal",
  },
];

export const contact = {
  heading: "¿Construimos algo juntos?",
  body: "Abierto a nuevas oportunidades, colaboraciones o simplemente a hablar de frontend, sistemas de datos o proyectos personales.",
};
