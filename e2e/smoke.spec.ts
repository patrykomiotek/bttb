import { test, expect } from '@playwright/test'

// Smoke test — uruchamialny out-of-the-box.
// Weryfikacja, że aplikacja + backend działają zanim zaczniemy ćwiczenia.
test('strona logowania się renderuje', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByTestId('login-form')).toBeVisible()
  await expect(page.getByTestId('login-submit')).toBeDisabled()
})

test('API /health odpowiada', async ({ request }) => {
  const res = await request.get('http://localhost:3001/api/health')
  expect(res.ok()).toBeTruthy()
  const body = await res.json()
  expect(body).toEqual({ ok: true })
})
