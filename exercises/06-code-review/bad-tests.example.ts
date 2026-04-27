/**
 * Ćwiczenie 6 — CODE REVIEW ZŁYCH TESTÓW
 *
 * UWAGA: Ten plik ma rozszerzenie .example.ts — NIE jest włączany do `npm test`.
 * Chodzi o to, żeby grupa mogła przeczytać, zidentyfikować anti-patterny
 * i dyskutować — bez szumu z failujących testów.
 *
 * Każdy przykład ma ID (B1, B2, ...). Na sali omawiamy:
 *   1. Co konkretnie jest źle?
 *   2. Kasować czy refaktorować?
 *   3. Jak powinien wyglądać refaktor (pseudokod wystarczy)?
 *
 * Wskazówka dla trenera: każdy blok ma różne grzechy, część nakłada się
 * świadomie — żeby grupa widziała, że jeden test potrafi mieć 4 problemy.
 */

/* eslint-disable */
// @ts-nocheck
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { validateVolume, validateEmail } from '../../src/utils/validators'
import { calculatePnL } from '../../src/utils/helpers'
import OrderForm from '../../src/components/OrderForm.vue'

// ════════════════════════════════════════════════════════════════════
// B1 — Test bez asercji (czyli... test czego właściwie?)
// ════════════════════════════════════════════════════════════════════
describe('B1 — walidator email', () => {
  it('działa', () => {
    validateEmail('foo@bar.pl')
  })
})

// ════════════════════════════════════════════════════════════════════
// B2 — Snapshot na HTML całego komponentu
// (każda kosmetyczna zmiana łamie test; nie wiadomo co testujemy)
// ════════════════════════════════════════════════════════════════════
describe('B2 — OrderForm', () => {
  it('renderuje się poprawnie', () => {
    const wrapper = mount(OrderForm)
    expect(wrapper.html()).toMatchSnapshot()
  })
})

// ════════════════════════════════════════════════════════════════════
// B3 — Test uzależniony od implementacji (klasy CSS)
// Nie testuje zachowania. Refaktor stylów wywali test.
// ════════════════════════════════════════════════════════════════════
describe('B3 — badge kierunku', () => {
  it('ma klasę badge-up', () => {
    const wrapper = mount(OrderForm)
    expect(wrapper.find('.btn').classes()).toContain('btn')
  })
})

// ════════════════════════════════════════════════════════════════════
// B4 — Jeden `it` z 15 asercjami bez setupu per-case.
// Gdy fail — nie wiemy co się zepsuło. Brak `describe.each` / `it.each`.
// ════════════════════════════════════════════════════════════════════
describe('B4 — validateVolume', () => {
  it('testuje wszystko', () => {
    expect(validateVolume(0).valid).toBe(false)
    expect(validateVolume(-1).valid).toBe(false)
    expect(validateVolume(0.1).valid).toBe(true)
    expect(validateVolume(1001).valid).toBe(false)
    expect(validateVolume('abc').valid).toBe(false)
    expect(validateVolume('').valid).toBe(false)
    expect(validateVolume(null).valid).toBe(false)
    expect(validateVolume(undefined).valid).toBe(false)
    expect(validateVolume(0.123).valid).toBe(false)
    expect(validateVolume(1000).valid).toBe(true)
  })
})

// ════════════════════════════════════════════════════════════════════
// B5 — Mock własnej funkcji, którą mamy przetestować.
// Test zawsze przejdzie, bo testujemy mock.
// ════════════════════════════════════════════════════════════════════
describe('B5 — calculatePnL', () => {
  it('liczy P/L', () => {
    const spy = vi.fn(calculatePnL).mockReturnValue(42)
    expect(spy('BUY', 1, 2, 1)).toBe(42)
  })
})

// ════════════════════════════════════════════════════════════════════
// B6 — Test zależny od aktualnej daty/losowości.
// Przejdzie dzisiaj, jutro losowo.
// ════════════════════════════════════════════════════════════════════
describe('B6 — timestamp', () => {
  it('zwraca dzisiejszą datę', () => {
    const today = new Date().toISOString().slice(0, 10)
    expect(today.startsWith('2026')).toBe(true)
  })
})

// ════════════════════════════════════════════════════════════════════
// B7 — setTimeout bez fake timerów, test trwa 2 sekundy.
// ════════════════════════════════════════════════════════════════════
describe('B7 — debounce', () => {
  it('woła po 1s', async () => {
    const fn = vi.fn()
    const debounced = (cb: () => void) => setTimeout(cb, 1000)
    debounced(fn)
    await new Promise((r) => setTimeout(r, 1100))
    expect(fn).toHaveBeenCalled()
  })
})

// ════════════════════════════════════════════════════════════════════
// B8 — Nazwy `test 1`, `test 2`, `it('should work')`.
// Po failu nie widać co się zepsuło.
// ════════════════════════════════════════════════════════════════════
describe('B8 — walidatory', () => {
  it('test 1', () => {
    expect(validateEmail('a@b.c').valid).toBe(true)
  })
  it('test 2', () => {
    expect(validateEmail('xxx').valid).toBe(false)
  })
  it('should work', () => {
    expect(validateVolume(1).valid).toBe(true)
  })
})

// ════════════════════════════════════════════════════════════════════
// B9 — Test kopiuje logikę produkcyjną zamiast asertować kontrakt.
// (Jeśli logika ma bug, test ma ten sam bug.)
// ════════════════════════════════════════════════════════════════════
describe('B9 — calculatePnL (kopia logiki)', () => {
  it('BUY liczy się poprawnie', () => {
    const open = 100, now = 110, vol = 2
    const expected = Math.round((now - open) * vol * 100) / 100
    expect(calculatePnL('BUY', open, now, vol)).toBe(expected)
  })
})

// ════════════════════════════════════════════════════════════════════
// B10 — Shared state między testami (brak reset Pinii/MSW).
// Test #2 przechodzi tylko w parze z #1.
// ════════════════════════════════════════════════════════════════════
let counter = 0
describe('B10 — licznik', () => {
  it('#1 zwiększa licznik', () => {
    counter++
    expect(counter).toBe(1)
  })
  it('#2 licznik ma wartość 1', () => {
    expect(counter).toBe(1) // zadziała w izolacji? uruchom pojedynczo i sprawdź
  })
})
