# Testowanie aplikacji frontendowych — warsztat (XTB / Bottega)

Repo szkoleniowe, 2 dni × 8 h, Vue 3 + TypeScript + Vitest + MSW + Playwright.

> **Uruchom to przed szkoleniem.** Jeśli coś nie działa, zgłoś mailowo przez Błażeja. Nie traćmy czasu w Dniu 1 na problemy z Node.js.

---

## Wymagania

- **Node.js 20.x LTS** lub 22.x (sprawdź: `node -v`)
- npm 10+ (idzie z Node 20)
- Git
- ~2 GB miejsca na dysku (głównie Playwright browsers)

Windows / WSL: używajcie WSL 2. macOS / Linux: bez niespodzianek.

---

## Instalacja krok po kroku

```bash
# 1) Zainstaluj zależności
npm install

# 2) Pobierz Chromium dla Playwright
npm run e2e:install

# 3) Smoke test — czy Vitest działa
npm test

# 4) Smoke test — czy API + web się uruchamiają
npm run dev:full
# Powinno pokazać: "[server] API + WS nasłuchuje na :3001"
# Otwórz http://localhost:5173 — powinien być ekran logowania.
# Ctrl+C żeby zatrzymać.

# 5) Smoke test — Playwright (uruchomi dev:full automatycznie)
npm run e2e
```

Wszystkie 4 kroki powinny zakończyć się zielono. Jeśli któryś failuje — [FAQ](#faq) niżej albo pisz do Błażeja.

---

## Co jest w repo

| Ścieżka                | Co to                                                      |
| ---------------------- | ---------------------------------------------------------- |
| `src/`                 | Aplikacja Vue 3 (trading lite) — komponenty, stores, utils |
| `src/utils/`           | **Ćwiczenie 1** — walidatory, formatery, helpery           |
| `src/components/`      | **Ćwiczenie 2** — `OrderForm.vue`, `InstrumentList.vue`    |
| `src/composables/`     | **Ćwiczenie 3** — `useRetryFetch`, `useInstrumentPrice`    |
| `src/mocks/`           | Handlery MSW (współdzielone przez testy i dev browser)     |
| `server/`              | Backend Express + WebSocket — startuje z `dev:full`        |
| `tests/`               | Setup Vitest + przykładowe testy integracyjne              |
| `e2e/`                 | Playwright — smoke test + ćwiczenia 4 i 5                  |
| `exercises/`           | Instrukcje ćwiczeń 1–7                                     |
| `exercises/06-code-review/` | **Ćwiczenie 6** — złe testy do grupowego review       |

---

## Skrypty

| Komenda                 | Co robi                                          |
| ----------------------- | ------------------------------------------------ |
| `npm run dev`           | Vite dev server (frontend only)                  |
| `npm run dev:full`      | Vite + backend Express + WebSocket (dla E2E)     |
| `npm test`              | Vitest run (jednorazowo)                         |
| `npm run test:watch`    | Vitest watch mode                                |
| `npm run test:ui`       | Vitest UI — przyjemne raportowanie w przeglądarce |
| `npm run test:coverage` | Raport pokrycia v8                               |
| `npm run e2e`           | Playwright — wszystkie testy E2E                 |
| `npm run e2e:ui`        | Playwright UI mode — debug + time travel         |
| `npm run typecheck`     | `vue-tsc --noEmit`                               |

---

## Konto demo

Backend akceptuje jedno konto (hardcoded w `server/data.ts`):

- email: `demo@xtb.local`
- hasło: `Passw0rd`

---

## FAQ

**`npm install` failuje na `msw` / `@playwright/test`.**
Masz Node < 20. `nvm install 20 && nvm use 20` i powtórz.

**`npm run e2e` mówi, że port 5173 zajęty.**
Już gdzieś chodzi Vite. `lsof -i :5173` i zabij proces. Albo uruchom Playwright z `CI=1 npm run e2e` — nie spróbuje reużyć serwera.

**Playwright mówi „browser not found".**
`npm run e2e:install` albo `npx playwright install chromium`.

**Test MSW w `vitest` rzuca „unhandled request".**
W `tests/setup.ts` mamy `onUnhandledRequest: 'error'` — to celowe. W testach które robią nietypowy request, nadpisz handler przez `server.use(...)`.

**Windows: `dev:full` nie startuje.**
W `package.json` używamy `concurrently` — powinno działać. Jeśli nie: uruchom ręcznie w 2 terminalach: `npm run server` i `npm run dev`.

**Chcę wyczyścić złożone zlecenia w backendzie.**
`curl -X DELETE http://localhost:3001/api/orders`

---

## Agenda w skrócie

- **Dzień 1** — fundamenty, TypeScript dla testów, Vitest, testowanie komponentów, MSW
- **Dzień 2** — Playwright, dobre praktyki, AI w testach, strategia w hybrydowym stacku

Pełna agenda: u trenera. Ćwiczenia: [`exercises/`](./exercises/).
