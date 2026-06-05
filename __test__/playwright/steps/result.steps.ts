import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { When, Then } = createBdd();

When('I mock the API to return a successful review', async ({ page }) => {
  await page.route('/api/review', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        overallScore: 92,
        summary: 'A very strong resume.',
        categoryScores: {
          impact: 95,
          clarity: 90,
          atsCompatibility: 88,
          structure: 95,
        },
        strengths: ['Clear structure'],
        weaknesses: ['Could use more metrics'],
        missingSections: [],
        rewrites: [],
      }),
    });
  });
});

When('I click the {string} button', async ({ page }, text: string) => {
  await page.getByRole('button', { name: text }).click();
});

When('I enter {string} into the text area', async ({ page }, text: string) => {
  await page.getByPlaceholder(/Paste your full resume text here/i).fill(text);
});

When('I click "Review Resume"', async ({ page }) => {
  await page.getByRole('button', { name: /Review my resume/i }).click();
});

Then('I should see the result view with a score', async ({ page }) => {
  // Wait for the score to appear
  await expect(page.getByText('92').first()).toBeVisible();
  await expect(page.getByText(/A very strong resume/i).first()).toBeVisible();
});
