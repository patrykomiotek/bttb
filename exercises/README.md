# Ćwiczenia — spis

Każde ćwiczenie ma osobny plik MD z kontekstem, zadaniami i wariantem „dla szybszych par". Kolejność = kolejność bloków w agendzie.

| Nr  | Blok      | Czas   | Plik                                         |
| --- | --------- | ------ | -------------------------------------------- |
| 1   | Blok 3    | 55 min | [01-czyste-funkcje.md](./01-czyste-funkcje.md) |
| 2   | Blok 4    | 90 min | [02-komponenty-vue.md](./02-komponenty-vue.md) |
| 3   | Blok 5    | 75 min | [03-integracyjne-msw.md](./03-integracyjne-msw.md) |
| 4   | Blok 6    | 35 min | [04-pierwszy-e2e.md](./04-pierwszy-e2e.md)   |
| 5   | Blok 7    | 90 min | [05-playwright-formularz.md](./05-playwright-formularz.md) |
| 6   | Blok 8    | 30 min | [06-code-review/](./06-code-review/)         |
| 7   | Blok 9    | 30 min | [07-ai-testy.md](./07-ai-testy.md)           |

## Konwencje

- **Pary**: FE + QA w każdej parze (zgodnie z kontraktem warsztatowym).
- **Każde ćwiczenie ma check-list**: dopóki wszystkie punkty ✅, para nie kończy.
- **Rozszerzenia** (oznaczone ⚡): dla szybszych par — nie wymagane do zaliczenia.
- **Konwencja testów**: `*.spec.ts` obok źródła albo w `tests/**`. Nie mieszamy z `.example.ts`.

## Komendy szybkiego dostępu

```bash
npm run test:watch           # Vitest watch (ćw. 1–3)
npm run test:ui              # Vitest UI (ładne raportowanie)
npm run dev:full             # web + API — potrzebne do ćw. 4–5
npm run e2e:ui               # Playwright UI mode (ćw. 4–5)
```
