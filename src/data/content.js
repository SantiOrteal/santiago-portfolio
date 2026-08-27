// Todo el copy y los datos del sitio viven aquí para que sea fácil de editar
// sin tocar los componentes. Los campos marcados con "// TODO" son
// placeholders pensados para que Santiago los reemplace con información real.

export const profile = {
  name: "Santiago Ortega",
  role: "Full Stack Developer",
  location: "Saltillo / Monterrey, México",
  email: "santiago.orteal@gmail.com",
  github: "https://github.com/SantiOrteal",
  linkedin: "https://www.linkedin.com/in/santiago-orteal/",
};

const localizedContent = {
  "es-MX": {
    seo: {
      title: "Santiago Ortega | Full Stack Developer en México",
      description:
        "Portafolio de Santiago Ortega, Full Stack Developer especializado en React, TypeScript, Node.js, sistemas empresariales y homelab.",
    },
    nav: {
      about: "Sobre mí",
      skills: "Habilidades",
      homelab: "Homelab",
      experience: "Experiencia",
      projects: "Proyectos",
      contact: "Contacto",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
    },

    hero: {
      eyebrow: "Disponible para nuevos proyectos",
      headline: "Construyo experiencias web modernas para problemas reales.",
      subline:
        "Full Stack Developer especializado en React y TypeScript, con experiencia construyendo aplicaciones y soluciones para entornos empresariales. Me interesa crear software claro, eficiente y fácil de mantener.",
      meta: ["React", "TypeScript", "Node.js"],
      projectsCta: "Ver proyectos",
      contactCta: "Contactar",
      scrollLabel: "Ir a la sección Sobre mí",
    },

    about: {
      label: "Sobre mí",
      paragraphs: [
        "Soy desarrollador Full Stack, con una fuerte orientación hacia el desarrollo frontend. Trabajo principalmente con React, JavaScript y TypeScript, creando interfaces donde la experiencia de usuario, el rendimiento y la claridad importan.",
        "Actualmente trabajo dentro de operaciones de Supply Chain, participando en procesos de Warehouse, Logistics y Purchasing. Mi trabajo combina desarrollo, resolución de problemas y análisis de sistemas empresariales, utilizando tecnologías como Dynatrace, Kibana y DataStax.",
        "Fuera del entorno empresarial disfruto construir proyectos personales, probar librerías nuevas y llevar mi stack (React, Vite, Tailwind, Node, Netsuite) a lugares distintos a los del trabajo diario.",
      ],
      card: {
        label: "whoami",
        lines: [
          { k: "rol", v: "Full Stack Developer" },
          { k: "desde", v: "2019" },
          { k: "frontend", v: "React · TypeScript" },
          { k: "backend", v: "Node.js · Java" },
          { k: "base", v: "México" },
        ],
      },
    },

    skills: {
      label: "Habilidades técnicas",
      heading:
        "Tecnologías que utilizo para construir, integrar y resolver problemas.",
      groups: [
        {
          title: "Full Stack",
          note: "Interfaces y experiencias web",
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
          note: "Servicios, APIs y datos",
          skills: [
            "Node.js",
            "Java",
            "Spring Boot",
            "SQL",
          ],
        },
        {
          title: "Enterprise & Observabilidad",
          note: "Sistemas y entornos de producción",
          skills: [
            "NetSuite",
            "Dynatrace",
            "Kibana",
            "DataStax",
          ],
        },
      ],
    },

    homelab: {
      label: "Personal Homelab",
      heading: "Un laboratorio personal para aprender construyendo.",
      intro:
        "Mantengo mi propio homelab basado en CasaOS, Linux y Docker, donde alojo y administro mis propios servicios para experimentar con infraestructura, automatización, seguridad, networking e IoT.",
      groups: [
        {
          title: "Infraestructura & Networking",
          description: "Administración, acceso remoto y protección de servicios.",
          services: ["CasaOS + Docker", "Tailscale + Cloudflare Tunnel", "Nginx Proxy Manager", "Pi-hole"],
        },
        {
          title: "Automatización & IoT",
          description: "Integración de servicios y comunicación con dispositivos.",
          services: ["n8n + Node-RED", "Home Assistant", "MQTT / Mosquitto", "ESP32"],
        },
        {
          title: "Self-hosted Services",
          description: "Servicios propios para datos, archivos y seguridad personal.",
          services: ["Immich", "Nextcloud", "Vaultwarden", "Authelia"],
        },
      ],
      outro:
        "Mi homelab funciona como un laboratorio personal donde aprendo, experimento y aplico conceptos de desarrollo, infraestructura y DevOps en proyectos reales.",
    },

    experience: {
      label: "Experiencia",
      heading: "Experiencia construyendo software y trabajando con sistemas reales.",
      items: [
        {
          period: "2023 — Presente",
          role: "Full Stack Developer & Operations Analyst",
          org: "Accenture",
          points: [
            "Desarrollo y mantenimiento de aplicaciones y funcionalidades para procesos de Warehouse, Logistics y Purchasing dentro de operaciones de Supply Chain.",
            "Resolución y seguimiento de stories, bugs y tickets, trabajando con sistemas como NetSuite y herramientas de observabilidad como Dynatrace y Kibana.",
            "Miembro de la iniciativa interna Trends & Innovation (T&I), participando en proyectos relacionados con microservicios, componentes reutilizables e inteligencia artificial.",
          ],
        },
        {
          period: "2021 — 2023",
          role: "Operations Analyst",
          org: "Accenture",
          points: [
            "Incorporación al equipo de operaciones, desarrollando experiencia en procesos empresariales y sistemas de Supply Chain.",
            "Transición progresiva hacia el desarrollo de software, combinando conocimiento funcional con habilidades técnicas.",
          ],
        },
        {
          period: "2019 — 2021",
          role: "FrontEnd Developer",
          org: "Grupo W",
          points: [
            "Desarrollo de sitios y aplicaciones web utilizando JavaScript, PHP, HTML5, CSS, React, TypeScript, Gatsby y WordPress.",
            "Optimización de rendimiento y SEO para mejorar la experiencia de usuario y el posicionamiento en buscadores.",
            "Desarrollo de componentes y nuevas funcionalidades, además del mantenimiento y mejora continua de sitios existentes.",
          ],
        },
      ],
    },
    projects: {
      label: "Proyectos destacados",
      heading:
        "Proyectos personales para seguir aprendiendo fuera del día a día.",
      items: [
        {
          title: "Warehouse Ops Dashboard",
          description:
            "Panel de inventario y órdenes construido para practicar tablas de datos grandes: filtros combinados, orden por columna y paginación fluida sobre miles de filas simuladas.",
          tags: ["React", "TypeScript", "TanStack Table", "Vite"],
          href: "#",
          kind: "Proyecto personal",
        },
        {
          title: "DevPulse",
          description:
            "Mini monitor de estado de servicios inspirado en los dashboards de observabilidad que usa día a día: endpoints simulados, historial de uptime y alertas visuales simples.",
          tags: ["React", "Node.js", "Tailwind CSS"],
          href: "#",
          kind: "Proyecto personal",
        },
        {
          title: "UI Kit ligero",
          description:
            "Colección propia de componentes reutilizables (botones, tablas, formularios) para arrancar proyectos nuevos más rápido, sin depender de un framework de UI completo.",
          tags: ["React", "TypeScript", "Tailwind CSS"],
          href: "#",
          kind: "Proyecto personal",
        },
      ],
    },

    contact: {
      label: "Contacto",
      heading: "¿Tienes un proyecto en mente?",
      body:
        "Estoy abierto a nuevas oportunidades, proyectos y colaboraciones. Si quieres hablar de desarrollo web, tecnología o una idea que quieras construir, hablemos.",
      copyLabel: "Copiar correo",
      copiedLabel: "Correo copiado",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
    },
  },
  en: {
    seo: {
      title: "Santiago Ortega | Full Stack Developer",
      description:
        "Portfolio of Santiago Ortega, Full Stack Developer focused on React, TypeScript, Node.js, enterprise systems, and homelab infrastructure.",
    },
    nav: {
      about: "About",
      skills: "Skills",
      homelab: "Homelab",
      experience: "Experience",
      projects: "Projects",
      contact: "Contact",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    hero: {
      eyebrow: "Available for new projects",
      headline: "I build modern web experiences for real-world problems.",
      subline:
        "Full Stack Developer focused on React and TypeScript, with experience building applications and solutions for enterprise environments. I care about creating software that is clear, efficient, and easy to maintain.",
      meta: ["React", "TypeScript", "Node.js"],
      projectsCta: "View projects",
      contactCta: "Get in touch",
      scrollLabel: "Go to the About section",
    },
    about: {
      label: "About me",
      paragraphs: [
        "I am a Full Stack developer with a strong focus on frontend development. I mainly work with React, JavaScript, and TypeScript, creating interfaces where user experience, performance, and clarity matter.",
        "I currently work in Supply Chain operations, supporting Warehouse, Logistics, and Purchasing processes. My work combines development, problem-solving, and enterprise systems analysis using technologies such as Dynatrace, Kibana, and DataStax.",
        "Outside the enterprise environment, I enjoy building personal projects, trying new libraries, and taking my stack (React, Vite, Tailwind, Node, NetSuite) into places beyond my daily work.",
      ],
      card: {
        label: "whoami",
        lines: [
          { k: "role", v: "Full Stack Developer" },
          { k: "since", v: "2019" },
          { k: "frontend", v: "React · TypeScript" },
          { k: "backend", v: "Node.js · Java" },
          { k: "base", v: "Mexico" },
        ],
      },
    },
    skills: {
      label: "Technical skills",
      heading:
        "Technologies I use to build, integrate, and solve problems.",
      groups: [
        {
          title: "Full Stack",
          note: "Web interfaces and experiences",
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
          title: "Backend & Data",
          note: "Services, APIs, and data",
          skills: ["Node.js", "Java", "Spring Boot", "SQL"],
        },
        {
          title: "Enterprise & Observability",
          note: "Systems and production environments",
          skills: ["NetSuite", "Dynatrace", "Kibana", "DataStax"],
        },
      ],
    },

    homelab: {
      label: "Personal Homelab",
      heading: "A personal lab for learning by building.",
      intro:
        "I maintain my own homelab based on CasaOS, Linux, and Docker, where I self-host services to experiment with infrastructure, automation, security, networking, and IoT.",
      groups: [
        {
          title: "Infrastructure & Networking",
          description: "Service administration, remote access, and protection.",
          services: ["CasaOS + Docker", "Tailscale + Cloudflare Tunnel", "Nginx Proxy Manager", "Pi-hole"],
        },
        {
          title: "Automation & IoT",
          description: "Service integration and communication with devices.",
          services: ["n8n + Node-RED", "Home Assistant", "MQTT / Mosquitto", "ESP32"],
        },
        {
          title: "Self-hosted Services",
          description: "Personal services for data, files, and security.",
          services: ["Immich", "Nextcloud", "Vaultwarden", "Authelia"],
        },
      ],
      outro:
        "My homelab is a personal laboratory where I learn, experiment, and apply development, infrastructure, and DevOps concepts to real projects.",
    },
    experience: {
      label: "Experience",
      heading: "Experience building software and working with real systems.",
      items: [
        {
          period: "2023 — Present",
          role: "Full Stack Developer & Operations Analyst",
          org: "Accenture",
          points: [
            "Develop and maintain applications and features for Warehouse, Logistics, and Purchasing processes within Supply Chain operations.",
            "Resolve and track stories, bugs, and tickets while working with systems such as NetSuite and observability tools like Dynatrace and Kibana.",
            "Member of the internal Trends & Innovation (T&I) initiative, participating in projects involving microservices, reusable components, and artificial intelligence.",
          ],
        },
        {
          period: "2021 — 2023",
          role: "Operations Analyst",
          org: "Accenture",
          points: [
            "Joined the operations team, gaining experience with enterprise processes and Supply Chain systems.",
            "Progressively transitioned into software development by combining functional knowledge with technical skills.",
          ],
        },
        {
          period: "2019 — 2021",
          role: "Full Stack Developer",
          org: "Grupo W",
          points: [
            "Developed websites and web applications using JavaScript, PHP, HTML5, CSS, React, TypeScript, Gatsby, and WordPress.",
            "Optimized performance and SEO to improve user experience and search engine rankings.",
            "Built components and new features while maintaining and continuously improving existing websites.",
          ],
        },
      ],
    },
    projects: {
      label: "Featured projects",
      heading: "Personal projects to keep learning beyond the day-to-day.",
      items: [
        {
          title: "Warehouse Ops Dashboard",
          description:
            "An inventory and orders dashboard built to practice handling large data tables: combined filters, column sorting, and smooth pagination across thousands of simulated rows.",
          tags: ["React", "TypeScript", "TanStack Table", "Vite"],
          href: "#",
          kind: "Personal project",
        },
        {
          title: "DevPulse",
          description:
            "A small service status monitor inspired by the observability dashboards I use every day: simulated endpoints, uptime history, and simple visual alerts.",
          tags: ["React", "Node.js", "Tailwind CSS"],
          href: "#",
          kind: "Personal project",
        },
        {
          title: "Lightweight UI Kit",
          description:
            "A personal collection of reusable components (buttons, tables, forms) for starting new projects faster without relying on a full UI framework.",
          tags: ["React", "TypeScript", "Tailwind CSS"],
          href: "#",
          kind: "Personal project",
        },
      ],
    },
    contact: {
      label: "Contact",
      heading: "Do you have a project in mind?",
      body: "I am open to new opportunities, projects, and collaborations. If you would like to talk about web development, technology, or an idea you want to build, let’s talk.",
      copyLabel: "Copy email",
      copiedLabel: "Email copied",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
    },
  },
};

export const getContent = (language) =>
  localizedContent[language] || localizedContent.en;

export const about = {
  paragraphs: [
    "Soy desarrollador Full Stack, enfocado en React, JavaScript y TypeScript. Me gusta el trabajo donde el detalle importa: una tabla que carga rápido, un formulario que no confunde, una interfaz que un equipo de operación usa todos los días sin pensar en ella.",
    "Actualmente trabajo dentro de operaciones de Supply Chain, dando seguimiento y desarrollando sobre procesos de Warehouse, Logistics y Purchasing — atendiendo stories, bugs y tickets en sistemas como NetSuite, y apoyándome en herramientas de observabilidad como Dynatrace y Kibana para entender qué está pasando de verdad en producción.",
    "Fuera del entorno empresarial disfruto construir proyectos personales, probar librerías nuevas y llevar mi stack (React, Vite, Tailwind, Node) a lugares distintos a los del trabajo diario.",
  ],
  card: {
    label: "whoami",
    lines: [
      { k: "rol", v: "Full Stack Developer" },
      { k: "desde", v: "2019" },
      { k: "foco", v: "React · TypeScript" },
      { k: "ahora", v: "Supply Chain Ops" },
      { k: "base", v: "México" },
    ],
  },
};

export const skillGroups = [
  {
    title: "Full Stack",
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
      "Desarrollo y mantenimiento de interfaces Full Stack para procesos de Warehouse, Logistics y Purchasing dentro de operaciones de Supply Chain.",
      "Seguimiento a stories, bugs y tickets, integrando sistemas como NetSuite con herramientas de observabilidad (Dynatrace, Kibana) y datos en DataStax.",
      "Miembro de la iniciativa interna Trends & Innovation (T&I), enfocada en microservicios y componentes reutilizables con IA para equipos internos.",
    ],
  },
  {
    period: "2021 — 2023",
    role: "Operations Analyst",
    org: "Accenture",
    points: [
      "Incorporación al equipo de operaciones, con transición progresiva hacia desarrollo Full Stack.",
      "Base para la promoción a Full Stack Developer & Operations Analyst en 2023.",
    ],
  },
  {
    period: "2019 — 2021",
    role: "Full Stack Developer",
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
  body: "Abierto a nuevas oportunidades, colaboraciones o simplemente a hablar de Full Stack, sistemas de datos o proyectos personales.",
};
