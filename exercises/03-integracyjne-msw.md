# Ćwiczenie 3 — Testy integracyjne z MSW

**Czas:** 75 min (Blok 5 — Dzień 1, rozszerzony)
**Forma:** pary FE + QA
**Plik docelowy:** `src/components/InstrumentList.spec.ts` + `src/composables/useInstrumentPrice.spec.ts` (opcjonalnie)

---

## Kontekst

Testujemy przepływ **komponent → store → API**. MSW jest skonfigurowane globalnie (patrz `tests/setup.ts` i `src/mocks/handlers.ts`). W testach per-case możecie nadpisać handlery przez `server.use(...)`.

W `tests/examples/instruments.integration.spec.ts` jest przykładowy test happy path.

---

## Scenariusz 1 — Happy path (25 min)

Napiszcie testy dla `InstrumentList.vue`:

- [ ] Po zamontowaniu komponent ma stan `instruments-loading` widoczny
- [ ] Po odpowiedzi z API pokazuje tabelę z wierszami (`instrument-row-EURUSD`)
- [ ] Wiersz zawiera sformatowaną cenę i procent zmiany
- [ ] Klik w „Odśwież" ponownie wywołuje fetch (zliczcie requesty przez `msw`)

**Wskazówki:**

- `await flushPromises()` zamiast `setTimeout` do czekania na fetch.
- Do liczenia requestów użyjcie `let calls = 0` w handlerze nadpisanym przez `server.use`.

---

## Scenariusz 2 — Błąd + retry + loading (35 min)

Composable `useRetryFetch` robi do 3 prób z backoffem. Napiszcie 4 testy:

- [ ] Happy path: jedna próba, `attempts === 1`, dane są obecne
- [ ] Dwa błędy, trzecia próba OK: `attempts === 3`, brak błędu
- [ ] Trzy błędy: `attempts === 3`, `error` ma wiadomość
- [ ] Podczas trwania retry `loading === true` (zanim `run()` się rozwiąże)

**Wskazówki:**

- Do scenariuszy „N-ty request failuje": licznik w closure + warunek w handlerze.
- Fake timers są przydatne, żeby nie czekać fizycznie na backoff:

  ```ts
  vi.useFakeTimers()
  const promise = hook.run()
  await vi.runAllTimersAsync()
  await promise
  ```

---

## Wariant D ⚡ — useFeatureFlags z fallbackiem

`src/composables/useFeatureFlags.ts` — gdy API failuje, używa lokalnego defaultu.

- [ ] API zwraca flagi → `flags.value` = merge defaults + response
- [ ] API failuje → `usedFallback === true`, `flags.value` = defaults
- [ ] Po fallbacku `loaded === true` (flow się nie wiesza)
- [ ] Wstrzyknięcie częściowych flag (tylko 1 z 3) → reszta z defaultów

## Wariant E ⚡ — race condition w retry

W `useRetryFetch` symulujcie scenariusz: użytkownik klika "Odśwież" 2× szybko, gdy pierwszy retry trwa.

- [ ] Czy widzicie race condition?
- [ ] Co byście zmienili w composable, żeby ten scenariusz nie występował?
- [ ] Napiszcie test który łapie problem (failuje w obecnej implementacji)

_Cel: nauczenie się, że TEST może być narzędziem do **odkrywania** błędów, nie tylko ich utrwalania._

## Bonus — Mockowanie WebSocketów (15 min) ⚡

`useInstrumentPrice.ts` otwiera prawdziwy `WebSocket`. W testach trzeba go podmienić.

Zainspirujcie się wzorcem z `tests/examples/websocket.example.md` (ściąga dla trenera). Przykładowe podejścia:

- Zmockować konstruktor `WebSocket` przez `vi.stubGlobal('WebSocket', FakeWS)`.
- Odpalić instancję, wywołać ręcznie `onopen` i `onmessage`.
- Asertować, że `price` się aktualizuje.

---

## Check-list zaliczenia

- [ ] Scenariusz 1: min. 4 testy, wszystkie zielone
- [ ] Scenariusz 2: min. 4 testy, w tym jeden z `vi.useFakeTimers()`
- [ ] Pokazaliście trenerowi dyskusję: „czego nie da się dobrze przetestować przez MSW?" (hint: kod obsługujący `fetch` w ogóle, np. timeout)
