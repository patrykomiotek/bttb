# Ćwiczenie 4 — Pierwszy scenariusz E2E

**Czas:** 35 min (Blok 6 — Dzień 2)
**Forma:** pary FE + QA — **QA prowadzi** (z agendy)
**Plik docelowy:** `e2e/login.spec.ts`

---

## Przygotowanie

Upewnijcie się, że `npm run dev:full` działa (web + API). Playwright sam wystartuje webServer przy `npm run e2e`, ale UI mode łatwiej debugować przy ręcznym uruchomieniu.

```bash
npm run e2e:ui
```

---

## Zadanie

Napiszcie scenariusz: **logowanie → nawigacja → wylogowanie**.

### Kroki

1. `page.goto('/login')`
2. Wypełnijcie email: `demo@xtb.local` i hasło: `Passw0rd`
3. Klik `login-submit`
4. Asercja: URL to `/dashboard` i widoczny `dashboard-title`
5. Klik w link `nav-order` — URL to `/order`
6. Klik `nav-logout` — URL to `/login`, przycisk logout znika

### Check-list

- [ ] Wszystkie selektory przez `getByTestId` lub `getByRole`
- [ ] **Zero** `page.waitForTimeout(...)` — użyjcie auto-waitingu z `expect(...).toBeVisible()`
- [ ] Test uruchamia się samodzielnie (bez zależności od poprzedniego stanu)

---

## Scenariusz negatywny (5 min)

- [ ] Logowanie z błędnym hasłem → widoczny `login-error`, URL pozostaje `/login`

---

## Dyskusja po ćwiczeniu (5 min)

- Które selektory wybraliście i dlaczego?
- Co robi `expect(locator).toBeVisible()` pod maską, że nie musimy ręcznie czekać?
- Kiedy użycie `getByText('Zaloguj')` jest OK, a kiedy pułapka?
