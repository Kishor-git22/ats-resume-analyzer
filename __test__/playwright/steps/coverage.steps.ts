import { createBdd } from 'playwright-bdd';
import fs from 'fs';
import path from 'path';

const { After } = createBdd();

After(async ({ page }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const coverage = await page.evaluate(() => (window as any).__coverage__);
  if (coverage) {
    const dir = path.join(process.cwd(), '.nyc_output');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    fs.writeFileSync(path.join(dir, `coverage-${Date.now()}.json`), JSON.stringify(coverage));
  }
});
