# Ćwiczenie 2 — Komponent formularza z walidacją

**Czas:** 90 min (Blok 4 — Dzień 1)
**Forma:** pary FE + QA
**Plik docelowy:** `src/components/OrderForm.vue` → testy w `src/components/OrderForm.spec.ts`

---

## Kontekst

`OrderForm.vue` to formularz składania zlecenia z walidacją po stronie klienta.

- `props`: `defaultSymbol`, `defaultPrice`
- `emits`: `placed` (z obiektem `Order` jako payload)
- Walidacja: symbol, wolumen, stop-loss (zależny od `side` i `defaultPrice`)
- API: `placeOrder()` z `@/api/orders` — MSW przechwyci żądanie (patrz `src/mocks/handlers.ts`)

---

## Zadania (rdzeń — 60 min)

Napiszcie testy dla wszystkich poniższych zachowań. Użyjcie `@vue/test-utils` (`mount`).

### 1. Renderowanie i propsy

- [ ] Formularz renderuje pola: symbol, side, volume, stop-loss
- [ ] `defaultSymbol` jest wpisany w pole symbol
- [ ] Przycisk submit jest aktywny tylko gdy walidacja przechodzi

### 2. Walidacja (touched first)

- [ ] Błąd symbolu pokazuje się **dopiero** po `blur` (nie od razu po renderze)
- [ ] Błąd wolumenu pokazuje się po wpisaniu `-1` i `blur`
- [ ] Próba submit z niepoprawnym formularzem zaznacza wszystkie pola jako `touched`

### 3. Emity i API

- [ ] Po poprawnym submit komponent emituje `placed` z payloadem `Order`
- [ ] Po 400 z API wyświetla komunikat błędu (`data-testid="order-submit-error"`)
- [ ] W trakcie wysyłki przycisk pokazuje `Wysyłam…` i jest zablokowany

**Wskazówki:**

- Używajcie `getByTestId` przez `wrapper.find('[data-testid="..."]')` lub biblioteki Testing Library (do wyboru).
- `nextTick()` po zmianach `v-model`; `flushPromises()` dla asynchroniki.
- Do błędu API: `server.use(http.post('*/api/orders', ...))` w `beforeEach` lub na początku `it`.
- Import `server` z `@/mocks/server`, import `http, HttpResponse` z `msw`.

---

## Wariant ⚡ dla szybszych par (30 min)

Wybierzcie jedno z dwóch:

### Opcja A — Testowanie composable `useRetryFetch`

Plik `src/composables/useRetryFetch.ts`.

- Szczęśliwa ścieżka (pierwsza próba OK)
- 2 błędy → 3. próba OK (użyjcie `server.use` żeby zrobić scenariusz per-attempt)
- Wszystkie próby failują → `error` ustawione

### Opcja B — Scenariusz 2 wariantów strony (BUY vs SELL)

Dla `OrderForm` napiszcie `describe.each([...])` przepuszczający ten sam zestaw asercji dla `side: 'BUY'` i `side: 'SELL'` — ze szczególnym uwzględnieniem walidacji stop-lossa.

---

## Check-list zaliczenia

- [ ] Min. 8 testów `it` w `OrderForm.spec.ts`
- [ ] Pokryte: render, walidacja touched-first, emit, obsługa błędu API, stan loading
- [ ] Test nie używa `wrapper.html()` ani snapshotów (patrz Ćwiczenie 6 — dlaczego)
- [ ] Para potrafi na żywo wytłumaczyć, czemu test spada, gdy zmienić pojedynczą klasę CSS (wskazówka: nie powinien)
