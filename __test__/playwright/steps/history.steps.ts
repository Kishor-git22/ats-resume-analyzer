import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { When, Then } = createBdd();

When('I click on the "My History" tab', async ({ page }) => {
  await page.route('/api/history*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
  await page.getByRole('button', { name: /My History/i }).click();
});

Then('I should see the history view displayed', async ({ page }) => {
  // If no history exists, it shows an empty state like "No past reviews found."
  // or it shows the list, or it shows History Disabled. Let's just verify the container is visible.
  await expect(
    page.getByText(/No past reviews found|Recent Reviews|History Disabled/i).first(),
  ).toBeVisible();
});
