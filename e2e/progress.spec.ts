import { expect, test } from '@playwright/test';

test.describe('Progress Demo Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/progress');
  });

  test('has correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Progress', level: 1 })).toBeVisible();
  });

  test('displays consistent header with icons', async ({ page }) => {
    // Check for icon buttons with titles
    await expect(page.locator('a[title="Playground"]')).toBeVisible();
    await expect(page.locator('a[title="NPM Package"]')).toBeVisible();
    await expect(page.locator('a[title="GitHub Repository"]')).toBeVisible();
    await expect(page.locator('a[title="Home"]')).toBeVisible();
  });

  test('displays progress bar', async ({ page }) => {
    await expect(page.getByText('Ready to download')).toBeVisible();

    // Check progress bar exists
    const progressBar = page.locator('div.bg-gradient-to-r.from-indigo-500').first();
    await expect(progressBar).toBeVisible();
  });

  test('displays download button', async ({ page }) => {
    const downloadButton = page.getByRole('button', { name: 'Start Download (50 files)' });
    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).toBeEnabled();
  });

  test('displays stats cards', async ({ page }) => {
    await expect(page.getByText('Complete')).toBeVisible();
    await expect(page.getByText('Files/second')).toBeVisible();
    await expect(page.getByText('ETA')).toBeVisible();
  });

  test('displays info section', async ({ page }) => {
    await expect(page.getByText('About This Demo')).toBeVisible();
    await expect(page.getByText('Downloads 50 mixed files (PDFs and PNGs)')).toBeVisible();
  });

  test('displays network throttling tip', async ({ page }) => {
    await expect(page.getByText(/Slow 3G/)).toBeVisible();
  });

  test('demo navigation links work', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Basic Demo' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Mixed Files' })).toBeVisible();
  });
});
