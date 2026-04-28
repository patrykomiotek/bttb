# Ćwiczenie 5 — Playwright: formularz, walidacja, mock API

**Czas:** 90 min (Blok 7 — Dzień 2, rozszerzony)
**Forma:** pary FE + QA
**Plik docelowy:** `e2e/order.spec.ts`

---

## Cel

Ten sam use case co w Ćwiczeniu 2 (OrderForm), ale na trzecim poziomie piramidy — **domykamy pętlę unit → integracja → E2E**. Po tym ćwiczeniu każda para uzbrojona jest w trzy poziomy patrzenia na ten sam scenariusz.

---

## Scenariusz 1 — Prawdziwy E2E (40 min)

Backend z `server/index.ts` jest prawdziwy (in-memory). Scenariusz:

1. Zaloguj się jako `demo@xtb.local` / `Passw0rd`
2. Idź do `/order`
3. Wypełnij:
   - symbol: `EURUSD`
   - side: `BUY`
   - volume: `0.1`
4. Klik submit
5. Asercje:
   - [ ] `order-success` jest widoczne
   - [ ] Tekst zawiera `ORD-` (wygenerowane ID)
   - [ ] `/api/orders` (GET) zwraca tablicę z jednym elementem

### Walidacja po stronie klienta

- [ ] Symbol `abc` → `order-symbol-error` widoczne, submit niemożliwy
- [ ] Volume `0` → `order-volume-error` widoczne
- [ ] SL = openPrice + 1 przy BUY → błąd `order-stoploss-error`

**Wskazówka:** po każdym teście resetujcie stan backendu — `DELETE /api/orders` w `test.beforeEach` (lub przez `request` fixture).

---

## Scenariusz 2 — Mock API przez `page.route` (35 min)

Ten sam przepływ, ale bez prawdziwego backendu. Użyjcie `page.route('**/api/orders', route => ...)`:

- [ ] Scenariusz z wymuszonym błędem 500 → UI pokazuje `order-submit-error`
- [ ] Scenariusz z opóźnieniem 2s → przycisk jest zablokowany, tekst `Wysyłam…`
- [ ] Scenariusz z customowym `code: RATE_LIMITED` → UI wyświetla komunikat z serwera

```ts
await page.route('**/api/orders', async (route) => {
  await route.fulfill({ status: 500, body: JSON.stringify({ message: 'Internal' }) })
})
```

---

## Grupowa dyskusja (15 min — moderuje trener)

Pytania do pary:

- Kiedy prawdziwe E2E, kiedy mock?
- Który scenariusz jest szybszy? Który bardziej wiarygodny?
- Co tracicie, gdy mockujecie API?
- Czy mockowany E2E to nadal E2E, czy to integracja?

_Z agendy: „To jest intelektualne serce szkolenia. Uczestnik wychodzi z konkretnym zrozumieniem, kiedy jaki typ testu ma sens."_

---

## Wariant D ⚡ — fixture z autoryzacją i Page Object

Wydzielcie:
- [ ] `e2e/fixtures.ts` — fixture `authenticatedPage` (auto-login)
- [ ] `e2e/pages/OrderPage.ts` — Page Object z metodami `fill(...)`, `submit()`, `expectSuccess()`
- [ ] Przepiszcie testy ze Scenariusza 1 używając POM

Porównanie: który styl czyta się lepiej dla **waszego zespołu**?

## Wariant E ⚡ — visual regression z maskami

Dodajcie test:
```ts
await expect(page.locator('[data-testid="order-form"]')).toHaveScreenshot({
  mask: [page.locator('[data-testid="order-success"]')],
})
```

- [ ] Uruchom raz (generuje baseline)
- [ ] Zmień kolor przycisku w CSS → test failuje
- [ ] Dyskusja: kiedy to ma sens, kiedy to anti-pattern?

## Wariant F ⚡ — API contract test

Bez UI:
```ts
test('POST /api/orders zwraca 201 z ID', async ({ request }) => {
  const res = await request.post('http://localhost:3001/api/orders', {
    data: { symbol: 'EURUSD', side: 'BUY', volume: 0.1 },
  })
  expect(res.status()).toBe(201)
  expect(await res.json()).toMatchObject({ id: expect.stringMatching(/^ORD-/) })
})
```

Granica: kiedy API contract test, kiedy E2E przez UI?

## Anti-flakiness — checklist (do wklejenia na ścianie)

- Każdy test startuje od znanego stanu (reset API, świeża zakładka)
- Zero `page.waitForTimeout(...)` — zawsze auto-waiting
- Żadnych `page.locator('.btn.btn-primary:nth-child(3)')` — selektory semantyczne
- Asercje na tekst jeśli to WIDOCZNY tekst, nie na klasy
- `toHaveURL(...)`/`toBeVisible()` zamiast ręcznego `waitForSelector`
- Full-page screenshots TYLKO w artefaktach, nie jako asercje

---

## Check-list zaliczenia

- [ ] Scenariusz 1: 4 testy przechodzą na żywym backendzie
- [ ] Scenariusz 2: 3 testy z `page.route`
- [ ] Nikt nie użył `waitForTimeout`
- [ ] Para potrafi odpowiedzieć na pytania z dyskusji grupowej
