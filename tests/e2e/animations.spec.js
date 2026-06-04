import { test, expect } from '@playwright/test'

test('stats bar numbers are visible after scrolling into view', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => window.scrollBy(0, 600))
  await page.waitForTimeout(500)
  await expect(page.getByText('Peak Monthly Volume')).toBeVisible()
  await expect(page.getByText('TVL Sourced')).toBeVisible()
})
