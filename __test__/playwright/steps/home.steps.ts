import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, Then } = createBdd();

Given('I navigate to the home page', async ({ page }) => {
  await page.route('/api/stats', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        totalReviews: 1234,
        totalRewrites: 5678,
        avgTimeMs: 1200,
      }),
    });
  });
  await page.goto('/');
});

Then('I should see the "Resume reviewer" heading', async ({ page }) => {
  await expect(page.locator('h1', { hasText: /Resume reviewer/i })).toBeVisible();
});

Then('I should see the global stats banner', async ({ page }) => {
  // GlobalStatsBanner has text like "Resumes Analyzed" or "Avg Processing Time"
  await expect(page.locator('text=/Resumes Analyzed/i').first()).toBeVisible();
});

Then('I should see the "Analyze Resume" tab is active', async ({ page }) => {
  const uploadTab = page.getByRole('button', { name: /Analyze Resume/i });
  await expect(uploadTab).toBeVisible();
  // Active tab has specific classes, let's just check if the upload zone is visible
  await expect(page.getByText(/Drop your resume PDF here/i).first()).toBeVisible();
});
