# Ćwiczenie 6 — Code review złych testów

**Czas:** 30 min (Blok 8 — Dzień 2)
**Forma:** grupowe — pary czytają, rotujące prezentacje

---

## Materiał

Plik: [`bad-tests.example.ts`](./bad-tests.example.ts)

W pliku jest 10 przykładów (B1–B10). Każdy jest celowo zły w jednym (lub kilku) wymiarze. Plik **nie jest** włączany do `npm test` — otwórzcie go w edytorze i czytajcie.

## Przebieg

### 1. Praca w parach (5 min)

Przeczytajcie cały plik. Każda para wybiera **3 najgorsze** przypadki (wg siebie) i przygotowuje:

- Co konkretnie jest źle?
- Kasować czy refaktorować? (werdykt jednym słowem)
- Jak powinien wyglądać refaktor? (pseudokod wystarczy)

### 2. Rotacja prezentacji (15 min)

Każda para prezentuje jeden przypadek (2 min). Reszta grupy dopowiada, jeśli zauważyła coś dodatkowego. Trener moderuje.

### 3. Synteza (10 min)

Grupowa dyskusja pod moderacją trenera:

- Kiedy kasować test, kiedy refaktorować?
- Który przypadek z B1–B10 widzieliście **realnie** w produkcyjnym kodzie?
- Jeden przypadek, który chcecie zgłosić w swoim zespole po szkoleniu?

---

## Po szkoleniu (opcjonalne zadanie domowe)

Znajdźcie w Waszym repo jeden test podobny do któregoś z B1–B10. Napiszcie do siebie plan naprawy. _Nie musicie go teraz robić — samo nazwanie już jest wartością._
