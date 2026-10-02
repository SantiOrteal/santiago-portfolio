# Guía de despliegue · CI/CD con GitHub Actions y Cloudflare Pages

Esta guía explica **qué** hace cada pieza del despliegue, **por qué** está así y
**cómo** dejarla funcionando desde cero. Está pensada para aprender, no solo
para copiar y pegar.

- Sitio: <https://santiorteal.com>
- Repositorio: <https://github.com/SantiOrteal/santiago-portfolio>
- Hosting: Cloudflare Pages (proyecto `santiorteal`)

---

## Índice

1. [Conceptos básicos](#1-conceptos-básicos)
2. [La rama `chore/deploy`](#2-la-rama-choredeploy)
3. [`ci.yml` explicado](#3-ciyml-explicado)
4. [`deploy.yml` explicado](#4-deployyml-explicado)
5. [Archivos de `public/` para Cloudflare](#5-archivos-de-public-para-cloudflare)
6. [Paso a paso: Cloudflare](#6-paso-a-paso-cloudflare)
7. [Paso a paso: GitHub (secrets, variables y environment)](#7-paso-a-paso-github)
8. [Primer despliegue](#8-primer-despliegue)
9. [Conectar santiorteal.com](#9-conectar-santiortealcom)
10. [Flujo de trabajo del día a día](#10-flujo-de-trabajo-del-día-a-día)
11. [Rollback (volver a una versión anterior)](#11-rollback)
12. [Problemas comunes](#12-problemas-comunes)

---

## 1. Conceptos básicos

### CI y CD

| | Significa | En este proyecto |
|---|---|---|
| **CI** | *Continuous Integration*: integrar cambios seguido y comprobar automáticamente que nada se rompió. | `ci.yml`: en cada push a `master` y en cada pull request ejecuta lint y build. |
| **CD** | *Continuous Delivery*: el código siempre está listo para publicarse y publicar es un paso automatizado. | `deploy.yml`: compila y sube el sitio a Cloudflare **cuando tú lo pides**. |

> Hay una variante, *Continuous Deployment*, en la que **cada** cambio en
> `master` se publica solo. Aquí elegimos *Delivery* (publicar a demanda)
> porque quieres decidir cuándo sale una versión.

### GitHub Actions: el vocabulario

```text
workflow  →  un archivo .yml en .github/workflows/
  on      →  el disparador (push, pull_request, botón manual, tag…)
  jobs    →  trabajos; cada uno corre en una máquina virtual nueva (runner)
    steps →  pasos dentro del job, en orden:
              - uses: una acción ya hecha (p. ej. actions/checkout)
              - run:  un comando de terminal (p. ej. npm run build)
```

- **Runner**: la máquina donde corre el job. `ubuntu-latest` es un Linux
  limpio que GitHub crea para cada ejecución y destruye al terminar. En repos
  públicos es gratis.
- **Action** (`uses:`): un paso reutilizable publicado por alguien.
  `actions/checkout@v4` descarga tu código; `@v4` fija la versión mayor.
- **Secrets**: valores cifrados (tokens). GitHub los oculta en los logs
  (`***`). Se leen con `${{ secrets.NOMBRE }}`.
- **Variables**: valores de configuración no sensibles, visibles. Se leen con
  `${{ vars.NOMBRE }}`.
- **Environment**: un "entorno" con nombre (aquí `production`). Muestra la URL
  publicada en el repo y puede exigir tu aprobación antes de desplegar.

### ¿Por qué Wrangler?

**Wrangler** es la herramienta de línea de comandos de Cloudflare.
`wrangler pages deploy dist` sube la carpeta `dist/` a tu proyecto de Pages.
A esto se le llama *Direct Upload*: GitHub Actions compila y Cloudflare solo
recibe los archivos ya listos. La ventaja es que tú controlas el build (lint
incluido) y cuándo se publica.

---

## 2. La rama `chore/deploy`

`chore/deploy` es la rama donde se preparó todo esto. El nombre sigue una
convención muy usada en equipos:

| Prefijo | Para qué |
|---|---|
| `feat/` | Funcionalidad nueva (`feat/contact-form`) |
| `fix/` | Corrección de un bug |
| `chore/` | Mantenimiento que no cambia lo que ve el usuario: configuración, CI, dependencias |
| `docs/` | Solo documentación |

Lo mismo aplica a los mensajes de commit (*Conventional Commits*):
`chore: …`, `feat(projects): …`, `fix(ui): …`. Hace que el historial se lea
como un changelog, y los reclutadores técnicos lo notan.

**Qué contiene la rama:**

| Archivo | Para qué |
|---|---|
| `.github/workflows/ci.yml` | Revisar cada cambio (lint + build) |
| `.github/workflows/deploy.yml` | Publicar en Cloudflare Pages a demanda |
| `public/_redirects` | Que `/es-mx/` y `/en/` funcionen al recargar |
| `public/404.html` | Página para rutas que no existen |
| `public/sitemap.xml`, `public/robots.txt` | SEO: decirle a Google qué páginas hay |
| `index.html`, `.env.example` | Dominio `santiorteal.com` |
| `README.md`, `docs/DEPLOY.md` | Documentación |

---

## 3. `ci.yml` explicado

```yaml
name: CI
```
El nombre que verás en la pestaña **Actions** y en el badge del README.

```yaml
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]
```
**Cuándo corre:** en cada push a `master` y en cada pull request hacia
`master`. Si trabajas en una rama y abres un PR, CI revisa tu código **antes**
de que lo mezcles.

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```
Si haces dos pushes seguidos a la misma rama, cancela la ejecución vieja: solo
importa la última versión del código.

```yaml
permissions:
  contents: read
```
*Mínimo privilegio*: este workflow solo puede **leer** el repo. Es una buena
práctica de seguridad.

```yaml
jobs:
  check:
    name: Lint & build
    runs-on: ubuntu-latest
    timeout-minutes: 10
```
Un solo job llamado `check`, en un Linux nuevo. Si tarda más de 10 minutos,
algo anda mal y se cancela.

```yaml
    steps:
      - uses: actions/checkout@v4          # 1. descarga el código
      - uses: actions/setup-node@v4        # 2. instala Node 22
        with:
          node-version: 22
          cache: npm                       #    y guarda en caché ~/.npm
      - run: npm ci                        # 3. instala dependencias exactas
      - run: npm run lint                  # 4. Oxlint
      - run: npm run build                 # 5. build de producción
```
- **`npm ci` vs `npm install`**: `npm ci` instala *exactamente* lo que dice
  `package-lock.json` y falla si no coincide con `package.json`. En CI eso es
  lo que quieres: builds reproducibles.
- Si **cualquier** paso falla, el job sale en rojo ❌ y el PR lo muestra.

---

## 4. `deploy.yml` explicado

```yaml
on:
  workflow_dispatch:
  push:
    tags: ["v*"]
```
**Dos formas de publicar:**
- `workflow_dispatch` agrega un botón **Run workflow** en *Actions → Deploy*.
- Un *tag* de versión: `git tag v1.0.0 && git push origin v1.0.0`.
  Además deja marcado en el historial qué commit corresponde a cada versión.

```yaml
concurrency:
  group: deploy-production
  cancel-in-progress: false
```
Nunca dos despliegues a la vez. A diferencia de CI, aquí **no** se cancela el
anterior (cortar un deploy a medias es peor): el nuevo espera su turno.

```yaml
    if: github.ref == 'refs/heads/master' || startsWith(github.ref, 'refs/tags/v')
```
**Protección:** el botón solo despliega si eliges la rama `master`. Así no
publicas por error una rama a medio terminar.

```yaml
    environment:
      name: production
      url: https://santiorteal.com
```
Asocia el job al environment `production`: GitHub muestra "Deployed to
production" con el enlace al sitio y, si lo configuras, te pide aprobarlo.

```yaml
      - name: Build
        run: npm run build
        env:
          VITE_SITE_URL: https://santiorteal.com
          VITE_WEB3FORMS_KEY: ${{ vars.VITE_WEB3FORMS_KEY }}
          VITE_N8N_WEBHOOK_URL: ${{ vars.VITE_N8N_WEBHOOK_URL }}
          VITE_N8N_WEBHOOK_TOKEN: ${{ secrets.VITE_N8N_WEBHOOK_TOKEN }}
```
Vite **incrusta** las variables `VITE_*` en el JavaScript al compilar. Por eso
se pasan en el paso de build y no después. Si una variable no existe, llega
vacía y el sitio sigue funcionando (el formulario usa `mailto:`).

```yaml
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          wranglerVersion: "4"
          command: pages deploy dist --project-name=santiorteal --branch=main --commit-dirty=true
```
- `apiToken` y `accountId`: cómo Wrangler se autentica con tu cuenta.
- `--project-name=santiorteal`: el proyecto de Pages que vas a crear en el paso 6.
- `--branch=main`: **ojo, no es tu rama de Git.** Es una etiqueta de Pages. Si
  coincide con la *production branch* del proyecto (que será `main`), el
  despliegue sale a producción; si no, Pages lo trata como *preview*.
- `--commit-dirty=true`: evita un aviso de Wrangler en CI.

---

## 5. Archivos de `public/` para Cloudflare

Todo lo que está en `public/` se copia tal cual a la raíz de `dist/`.

### `_redirects`

```text
/es-mx    /es-mx/      301
/en       /en/         301
/es-mx/*  /index.html  200
/en/*     /index.html  200
```

Tu sitio es una *SPA* (una sola página con rutas manejadas por React). Si
alguien recarga `santiorteal.com/en/`, Cloudflare buscaría un archivo
`/en/index.html` que no existe.

- `200` = **rewrite**: la URL sigue diciendo `/en/`, pero Pages entrega
  `index.html` y React hace el resto.
- `301` = **redirect permanente**: `/en` → `/en/` para tener una sola URL.

### `404.html`

Página independiente (HTML + CSS, sin React) para cualquier ruta que no
existe. **Importante:** en Cloudflare Pages, si existe `404.html`, Pages deja
de mandar *todas* las rutas desconocidas a `index.html`. Por eso `_redirects`
lista solo las rutas reales (`/es-mx/*` y `/en/*`) y lo demás cae en la 404 con
el código HTTP 404 correcto, que es lo que Google espera.

> En `npm run dev` y `npm run preview` la 404 no aparece, porque Vite responde
> cualquier ruta con `index.html`. Para verla en local abre `/404.html`.

### `sitemap.xml` y `robots.txt`

Le dicen a Google qué páginas existen (`/es-mx/` y `/en/`) y que son versiones
del mismo contenido en distintos idiomas (`hreflang`).

---

## 6. Paso a paso: Cloudflare

### 6.1 Obtener tu Account ID

1. Entra a <https://dash.cloudflare.com>.
2. En el menú lateral abre **Workers & Pages**.
3. A la derecha verás **Account ID**. Cópialo (lo usarás en el paso 7).

### 6.2 Crear un API token (permiso solo para Pages)

1. Arriba a la derecha: **icono de perfil → My Profile → API Tokens**.
2. **Create Token** → al final, **Create Custom Token → Get started**.
3. Configura:
   - **Token name**: `github-actions-santiorteal`
   - **Permissions**: `Account` · `Cloudflare Pages` · `Edit`
   - **Account Resources**: `Include` · *tu cuenta*
   - (Opcional) **TTL**: una fecha de expiración, por seguridad.
4. **Continue to summary → Create Token**.
5. **Copia el token ahora**: Cloudflare no lo vuelve a mostrar. Si lo
   pierdes, se crea otro.

> ¿Por qué un token propio y no tu Global API Key? Porque este token solo
> puede tocar Pages. Si se filtrara, el daño estaría limitado.

### 6.3 Crear el proyecto de Pages

Usa la terminal (en WSL, dentro del repo):

```bash
npx wrangler login
```

Se abre el navegador para autorizar Wrangler con tu cuenta. Después:

```bash
npx wrangler pages project create santiorteal --production-branch=main
```

Esto crea el proyecto **vacío** `santiorteal` con `main` como production branch,
el mismo valor que usa `deploy.yml`.

**Alternativa sin terminal (dashboard):**

1. **Workers & Pages → Create → Pages → Use direct upload**.
2. **Project name**: `santiorteal` → **Create project**.
3. Te pedirá subir archivos: compila en local (`npm run build`) y arrastra la
   carpeta `dist`. Este primer deploy manual solo sirve para crear el proyecto;
   los siguientes los hará GitHub Actions.
4. Revisa en **Settings** que la *production branch* sea `main`.

> Un proyecto creado por *direct upload* no se puede convertir después en un
> proyecto conectado a Git (la otra forma de usar Pages). Aquí no hace falta:
> el build lo hace GitHub Actions.

---

## 7. Paso a paso: GitHub

En el repo: **Settings → Secrets and variables → Actions**.

### 7.1 Secrets (pestaña *Secrets* → *New repository secret*)

| Nombre | Valor | ¿Obligatorio? |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | El token del paso 6.2 | Sí |
| `CLOUDFLARE_ACCOUNT_ID` | El Account ID del paso 6.1 | Sí |
| `VITE_N8N_WEBHOOK_TOKEN` | El mismo valor del nodo Code de n8n | Solo si usas n8n con token |

### 7.2 Variables (pestaña *Variables* → *New repository variable*)

| Nombre | Valor | ¿Obligatorio? |
|---|---|---|
| `VITE_WEB3FORMS_KEY` | Tu access key de Web3Forms | Para el formulario por correo |
| `VITE_N8N_WEBHOOK_URL` | La URL de producción de tu webhook | Para el segundo canal del formulario |

> ¿Por qué estas van en *Variables* y no en *Secrets*? Porque terminan
> visibles en el JavaScript público de todas formas. Los *Secrets* son para lo
> que nunca debe salir de GitHub (como el token de Cloudflare).

### 7.3 Environment `production` (recomendado)

1. **Settings → Environments → New environment** → nombre: `production`.
2. (Opcional) **Required reviewers** → agrégate a ti. Cada deploy esperará tu
   clic en **Review deployments → Approve**. Útil como "¿seguro?" final.
3. (Opcional) **Deployment branches and tags** → *Selected branches and tags*
   → agrega `master` y el patrón de tag `v*`.

Si no lo creas, GitHub lo crea solo en el primer deploy, sin reglas.

### 7.4 Proteger `master` con CI (opcional, muy recomendado)

**Settings → Rules → Rulesets → New branch ruleset**:

- **Target branches**: `master`
- ✅ **Require a pull request before merging**
- ✅ **Require status checks to pass** → agrega `Lint & build`

Así ningún cambio llega a `master` si CI falla. Es exactamente como trabajan
los equipos profesionales.

---

## 8. Primer despliegue

1. Sube las ramas (desde WSL):

   ```bash
   git push origin master
   git push origin chore/deploy
   ```

2. En GitHub abre un **Pull Request** de `chore/deploy` → `master`. Verás a CI
   corriendo en el PR ✅. Haz **Merge**.
3. Ve a **Actions → Deploy → Run workflow → Branch: master → Run workflow**.
4. Abre la ejecución y observa cada paso. Al terminar, el log de Wrangler
   muestra una URL como `https://<hash>.santiorteal.pages.dev`.
5. Abre `https://santiorteal.pages.dev`: ese es tu sitio en producción.

Prueba también:

- `https://santiorteal.pages.dev/en/` → recarga la página: no debe dar 404.
- `https://santiorteal.pages.dev/no-existe` → debe mostrar la página 404.

---

## 9. Conectar santiorteal.com

Como el dominio está en Cloudflare, el DNS se configura solo:

1. **Workers & Pages → santiorteal → Custom domains → Set up a custom domain**.
2. Escribe `santiorteal.com` → **Continue → Activate domain**.
3. Repite con `www.santiorteal.com`.
4. Espera unos minutos a que el estado diga **Active** (Cloudflare emite el
   certificado HTTPS automáticamente).

**Redirigir `www` al dominio principal** (para tener una sola URL):

1. En el dashboard abre el dominio `santiorteal.com` → **Rules → Redirect Rules**.
2. **Create rule** → usa la plantilla *Redirect from WWW to root*.
3. Guarda. Ahora `www.santiorteal.com/...` → `santiorteal.com/...` (301).

Al final:

- [ ] `https://santiorteal.com` abre el sitio con candado 🔒
- [ ] `https://www.santiorteal.com` redirige a `https://santiorteal.com`
- [ ] Agrega `https://santiorteal.com` a *Allowed Origins* en el nodo Webhook
  de tu workflow de n8n
- [ ] Registra el sitio en [Google Search Console](https://search.google.com/search-console)
  y envía `https://santiorteal.com/sitemap.xml`

---

## 10. Flujo de trabajo del día a día

```text
1. git checkout -b feat/mi-cambio          ← rama nueva desde master
2. …programas, haces commits…
3. git push origin feat/mi-cambio
4. Abres un PR en GitHub → CI corre (lint + build)
5. CI en verde ✅ → Merge a master          ← CI corre otra vez sobre master
6. Cuando quieras publicar:
     git checkout master && git pull
     git tag v1.1.0
     git push origin v1.1.0                ← Deploy se dispara solo
   (o el botón Run workflow)
```

**¿Qué número de versión uso?** *Semantic Versioning* (`vMAYOR.MENOR.PARCHE`):

- `v1.0.1` → arreglo pequeño (*patch*)
- `v1.1.0` → algo nuevo (*minor*): una sección, un proyecto
- `v2.0.0` → rediseño o cambio grande (*major*)

---

## 11. Rollback

Si una versión sale mal:

- **Rápido (Cloudflare):** *Workers & Pages → santiorteal → Deployments* →
  en un despliegue anterior: **⋯ → Rollback to this deployment**. Es
  instantáneo y no toca Git.
- **Con Git:** corrige o revierte en `master` (`git revert <commit>`), crea un
  tag nuevo (`v1.1.1`) y publica.

---

## 12. Problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| CI falla en `npm ci` | `package-lock.json` no coincide con `package.json` | `npm install` en local, commit del lockfile |
| Deploy: `Authentication error` | Token inválido, vencido o sin permiso de Pages | Revisa 6.2 y el secret `CLOUDFLARE_API_TOKEN` |
| Deploy: `Project not found` | El proyecto no existe o el nombre no coincide | Crea `santiorteal` (6.3) o ajusta `--project-name` |
| El deploy sale como *Preview* | La production branch del proyecto no es `main` | Cámbiala a `main` o ajusta `--branch` en `deploy.yml` |
| El botón *Run workflow* no despliega | Elegiste una rama distinta de `master` | Ejecútalo desde `master` (protección del `if:`) |
| `/en/` da 404 al recargar | Falta `_redirects` en `dist/` | Verifica que exista `public/_redirects` |
| El formulario abre el correo en vez de enviar | No hay variables `VITE_*` en el build | Revisa 7.2 y vuelve a desplegar |
| El dominio no carga | DNS o certificado aún propagándose | Espera unos minutos; revisa *Custom domains* |
