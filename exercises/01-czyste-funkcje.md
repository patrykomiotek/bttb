# Ćwiczenie 1 — Testy czystych funkcji

**Czas:** 55 min (Blok 3 — Dzień 1)
**Forma:** pary FE + QA
**Uruchomienie:** `npm run test:watch`

---

## Kontekst

W katalogu `src/utils/` są trzy pliki:

- `validators.ts` — walidatory formularzy (login, order)
- `formatters.ts` — formatowanie cen, procentów, dat
- `helpers.ts` — obliczenia P/L, ryzyko, debounce, generowanie ID

Jeden przykładowy test istnieje (`formatters.spec.ts`). Reszta jest Wasza.

---

## Część A — Walidatory i formatery (25 min)

Napiszcie testy dla funkcji:

- [ ] `validateEmail` — minimum 3 przypadki (ok, zły format, pusty)
- [ ] `validatePassword` — minimum 4 przypadki (ok, za krótkie, brak wielkiej litery, brak cyfry)
- [ ] `validateVolume` — pokrycie edge cases (zero, ujemne, string, null, liczba zmiennoprzecinkowa z 3 miejscami po przecinku)
- [ ] `validateSymbol` — dobre i złe formaty (`EURUSD`, `AAPL.US`, `abc`, `123`)
- [ ] `formatPrice` — waluty, NaN, Infinity
- [ ] `formatDelta` — dodatni / ujemny / zero / NaN (kierunek i tekst)

**Wskazówki:**

- Użyj `describe` dla każdej funkcji, `it` dla pojedynczego case'a.
- Nazwa testu w formie zdania: `it('zwraca błąd dla pustego email')`.
- Asercje konkretnie: `toBe(false)`, `toEqual({ valid: false, message: '...' })`.
- Uważaj na testy formatera z `Intl` — różne Node/OS potrafią dawać różne spacje (NBSP vs zwykła). Jeśli napotkacie, spytajcie trenera.

---

## Część B — Funkcja „trudna do przetestowania" (20 min)

Plik `src/utils/helpers.ts` zawiera trzy funkcje zaprojektowane pod ten temat:

1. `canLoginAgain` — używa `Date.now()` bezpośrednio.
2. `generateOrderId` — `Math.random()` + `Date.now()`.
3. `debounce` — `setTimeout`.

**Zadanie:**

Każda para wybiera **jedną** z tych funkcji i próbuje ją pokryć testami. Dopuszczalne strategie (wybierzcie):

- Dependency injection — zmienić sygnaturę (np. `canLoginAgain(lastLoginAt, now, cooldownMs)`) i pokryć.
- `vi.setSystemTime(...)` + `vi.useFakeTimers()` — pokryć *bez* zmian w API.
- `vi.spyOn(Math, 'random')` — pokryć kontrakt (format), nie konkretną wartość.

**Po 20 minutach**: krótka runda — każda para pokazuje na ekranie swoją wersję i mówi:

- „Co się udało pokryć?"
- „Co zostało nie pokryte i dlaczego?"
- „Czy zmienilibyście produkcyjny kod, żeby ułatwić test?"

_To jest świadomie otwarty punkt — nie ma jednej dobrej odpowiedzi. Chodzi o to, żebyście zobaczyli trade-off między „zmieniam API kodu produkcyjnego" a „męczę się z mockowaniem wbudowanych API"._

---

## Część D ⚡ (dla doświadczonych - kalkulacje finansowe)

Plik `src/utils/risk.ts` zawiera 4 funkcje: `portfolioValue`, `marginCallTriggered`, `lotsToUnits`, `volumeTier`.

- [ ] Pokryjcie `portfolioValue` minimum 4 testami (zero pozycji, BUY+SELL mix, floating point: balance=100 + pozycja generująca 0.1+0.2)
- [ ] Pokryjcie `marginCallTriggered` z naciskiem na **branch coverage**: zero pozycji, threshold dokładnie na granicy, `equity === usedMargin`
- [ ] `volumeTier` z `it.each` — pokryjcie wszystkie progi i granice (0.0099, 0.01, 0.0999, 0.1, 9.99, 10)
- [ ] **Mutation test ręczny:** zmieńcie `<` na `<=` w `volumeTier` — czy któryś z waszych testów łapie regresję?

## Część C ⚡ (dla szybszych par, 10 min)

Zrefaktoryzujcie testy `validateVolume` na `it.each(...)`:

```ts
it.each([
  [0, false, 'zero'],
  [-1, false, 'ujemne'],
  [0.1, true, 'ok'],
  // ...
])('validateVolume(%s) → %s (%s)', (input, expected) => {
  expect(validateVolume(input).valid).toBe(expected)
})
```

Porównajcie czytelność. Kiedy `it.each` jest wygrane, a kiedy przesada?

---

## Check-list zaliczenia

- [ ] Co najmniej 15 testów `it` między wszystkimi funkcjami z Części A
- [ ] Jedna funkcja z `helpers.ts` pokryta (min. 3 asercje)
- [ ] Nazwy testów są zdaniami opisującymi zachowanie (nie `test 1`, `it works`)
- [ ] Pary przedstawiły swoje podejście z Części B
