import { test, expect } from '@playwright/test'

const SECTIONS = ['liquidity', 'yield', 'launchpad', 'about']

for (const section of SECTIONS) {
  test(`nav link scrolls to #${section}`, async ({ page }) => {
    await page.goto('/')
    const navLink = page.locator(`nav a[href="#${section}"]`)
    await expect(navLink).toBeVisible()
    await navLink.click()
    await page.waitForTimeout(600)
    const el = page.locator(`#${section}`)
    await expect(el).toBeInViewport()
  })
}
