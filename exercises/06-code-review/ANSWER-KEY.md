# Ćwiczenie 6 — klucz odpowiedzi (tylko dla trenera)

Nie udostępniaj grupie przed ćwiczeniem.

| ID  | Główny anti-pattern                                  | Werdykt                    |
| --- | ----------------------------------------------------- | -------------------------- |
| B1  | Brak asercji                                          | Kasować lub poprawić intencję |
| B2  | Snapshot całego HTML-a                                | Refaktor: asertuj zachowanie (aria-label/tekst), nie DOM |
| B3  | Assert na klasę CSS zamiast na zachowanie             | Kasować lub asertować widoczny stan użytkownika |
| B4  | Jeden `it` z 15 asercjami                             | Refaktor: `it.each` |
| B5  | Mock własnej funkcji testowanej                       | Kasować — test bezwartościowy |
| B6  | Zależność od aktualnej daty                           | Refaktor: `vi.setSystemTime` |
| B7  | Realny `setTimeout` w teście                          | Refaktor: `vi.useFakeTimers` |
| B8  | Bezużyteczne nazwy (`test 1`, `should work`)          | Rename — zdanie "co robi system, gdy..." |
| B9  | Kopia logiki produkcyjnej w expected                  | Asertuj konkretną wartość, nie wynik przeliczenia |
| B10 | Shared state między testami                           | Użyj `beforeEach`/`setActivePinia`, resetuj MSW |

## Jak poprowadzić dyskusję (30 min)

1. **5 min** — grupa przegląda plik w parach, wybiera 3 najgorsze przypadki.
2. **15 min** — każda para prezentuje jeden przypadek (2 min), reszta dopowiada.
3. **10 min** — wspólnie decydujemy: kasować czy refaktorować? Kiedy jedno, kiedy drugie?

## Pytania naprowadzające (gdy grupa utknie)

- "Co by się stało, gdyby dzisiaj zmienić implementację — test dalej miałby sens?"
- "Gdyby ten test failował u kolegi jutro, czy potrafilibyście od razu powiedzieć, co zepsuli?"
- "Test chroni nas przed regresją, czy po prostu dokumentuje obecny stan kodu?"
