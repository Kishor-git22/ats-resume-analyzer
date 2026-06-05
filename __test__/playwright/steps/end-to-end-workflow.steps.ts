import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { When, Then } = createBdd();

let routeResolver: (value: unknown) => void;

Then('I should see the initial upload zone and global stats', async ({ page }) => {
  await expect(page.getByText(/Drop your resume PDF here/i).first()).toBeVisible();
  await expect(page.locator('text=/Resumes Analyzed/i').first()).toBeVisible();
});

When('I submit a valid resume', async ({ page }) => {
  const routePromise = new Promise((resolve) => {
    routeResolver = resolve;
  });

  await page.route('/api/review', async (route) => {
    // Pause response until routePromise is resolved
    await routePromise;
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
        rewrites: [
          { original: 'Did stuff', suggested: 'Accomplished things', reason: 'Better verbs' },
        ],
      }),
    });
  });

  await page.getByRole('button', { name: /Paste text/i }).click();
  await page
    .getByPlaceholder(/Paste your full resume text here/i)
    .fill(
      'This is a test resume text that is intentionally made very long so that it easily passes the minimum character count of one hundred characters required by the form validation before it allows the user to submit.',
    );

  const submitBtn = page.getByRole('button', { name: /Review my resume/i });
  await expect(submitBtn).toBeEnabled();
  await submitBtn.click();
});

Then('I should see the loading state', async ({ page }) => {
  // Wait for the upload zone to disappear
  await expect(page.getByRole('button', { name: /Review my resume/i })).toBeHidden();
  // Wait for the loading state to appear
  await expect(page.getByText(/Reading your resume/i).first()).toBeVisible({ timeout: 10000 });
});

Then('the API responds with a successful review', async () => {
  if (routeResolver) routeResolver(true);
});

Then('I should see the overall score and category scores', async ({ page }) => {
  await expect(page.getByText('92').first()).toBeVisible();
  await expect(page.getByText('95').first()).toBeVisible(); // from categoryScores
});

Then('I should see the summary, strengths, weaknesses, and rewrites', async ({ page }) => {
  await expect(page.getByText(/A very strong resume/i).first()).toBeVisible();
  await expect(page.getByText(/Clear structure/i).first()).toBeVisible();
  await expect(page.getByText(/Could use more metrics/i).first()).toBeVisible();
  await expect(page.getByText(/Accomplished things/i).first()).toBeVisible();
});
