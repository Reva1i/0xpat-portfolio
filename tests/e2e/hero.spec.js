import { test, expect } from '@playwright/test'

test('swap widget default state', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('OPPORTUNITY')).toBeVisible()
  await expect(page.getByText('PAT KUO')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Hire' })).toBeVisible()
})

test('hire button triggers confirmation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Hire' }).click()
  await expect(page.getByText('PAT KUO ✓ Confirmed')).toBeVisible({ timeout: 2000 })
})

test('mailto link appears after hire', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Hire' }).click()
  const link = page.getByRole('link', { name: 'patkuo87225@gmail.com' })
  await expect(link).toBeVisible({ timeout: 2000 })
  await expect(link).toHaveAttribute('href', 'mailto:patkuo87225@gmail.com')
})
