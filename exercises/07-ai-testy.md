# Ćwiczenie 7 — Generowanie testów z Copilotem

**Czas:** 30 min (Blok 9 — Dzień 2)
**Forma:** pary + grupowe review

---

## Cel

Zobaczyć, co Copilot robi dobrze, a co źle, gdy generuje testy — i wyćwiczyć nawyk **review kodu AI**.

---

## Zadanie (15 min — pary)

Wybierzcie jedną z niestestowanych funkcji:

- `src/utils/helpers.ts` → `calculateMargin`
- `src/utils/helpers.ts` → `riskLevel`
- `src/composables/useRetryFetch.ts`

Wygenerujcie testy przez Copilot lub inne narzędzie AI (zgodnie z Waszymi uprawnieniami organizacyjnymi). Dopuszczalne podejścia:

- Krótki prompt („wygeneruj testy Vitest dla tej funkcji")
- Prompt z kontekstem („Vitest, TypeScript, projekt używa `describe/it` w języku polskim, zwracaj tylko kod")
- Copilot inline w pliku `.spec.ts`

**Nie akceptujcie bezmyślnie**. Wygenerowane testy wklejcie, uruchomcie (`npm test`), przeanalizujcie.

---

## Grupowe review (15 min — moderuje trener)

Każda para pokazuje na projektorze:

1. Użyty prompt
2. Wygenerowane testy (surowe)
3. Co zostawili, co wyrzucili, co poprawili

Pytania do dyskusji:

- **Co AI robi dobrze?** (pokrycie happy path, boilerplate, `it.each`)
- **Co robi źle?** (wymyśla API, testuje implementację, kopiuje logikę, halucynacje edge-case'ów, brak weryfikacji, że test rzeczywiście łapie bug)
- **Które anti-patterny z Ćwiczenia 6 pojawiły się w wygenerowanym kodzie?**

---

## Checklist review kodu AI (do zapisania)

Przed mergeniem wygenerowanego testu:

- [ ] Czy test naprawdę failowałby, gdybym odwrócił warunek w kodzie produkcyjnym?
- [ ] Czy nazwy są zdaniami o zachowaniu, czy bełkotem typu `it('should work correctly')`?
- [ ] Czy test nie referuje funkcji, której nie ma (halucynacja)?
- [ ] Czy nie kopiuje logiki produkcyjnej do `expected`?
- [ ] Czy pokrywa edge case'y, które **ja** bym pokrył, czy tylko happy path?
