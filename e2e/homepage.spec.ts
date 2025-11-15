import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and heading', async ({ page }) => {
    await expect(page).toHaveTitle(/Zipper/);
    await expect(page.getByRole('heading', { name: 'Zipper', level: 1 })).toBeVisible();
  });

  test('displays all header navigation links', async ({ page }) => {
    // Check for icon buttons with titles
    await expect(page.locator('a[title="Playground"]')).toBeVisible();
    await expect(page.locator('a[title="NPM Package"]')).toBeVisible();
    await expect(page.locator('a[title="GitHub Repository"]')).toBeVisible();
  });

  test('displays demo navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Progress' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Mixed-Type' })).toBeVisible();
  });

  test('displays file selection grid', async ({ page }) => {
    // Should have 100 file buttons (10 letters × 10 numbers, excluding I)
    const fileButtons = page.locator('button').filter({ hasText: /^[A-HJ-K]\d$/ });
    await expect(fileButtons).toHaveCount(100);
  });

  test('can select and deselect files', async ({ page }) => {
    const firstFile = page.locator('button').filter({ hasText: /^A0/ }).first();

    // Initially not selected
    await expect(firstFile).not.toHaveClass(/border-indigo-600/);

    // Click to select
    await firstFile.click();
    await expect(firstFile).toHaveClass(/border-indigo-600/);

    // Click again to deselect
    await firstFile.click();
    await expect(firstFile).not.toHaveClass(/border-indigo-600/);
  });

  test('select all button works', async ({ page }) => {
    const selectAllButton = page.getByRole('button', { name: 'Select All' });
    await selectAllButton.click();

    // Download button should show (100)
    await expect(page.getByRole('button', { name: /Download \(100\)/ })).toBeVisible();
  });

  test('clear button works', async ({ page }) => {
    // Select all first
    await page.getByRole('button', { name: 'Select All' }).click();

    // Then clear
    await page.getByRole('button', { name: 'Clear' }).click();

    // Download button should show (0) and be disabled
    const downloadButton = page.getByRole('button', { name: /Download \(0\)/ });
    await expect(downloadButton).toBeVisible();
    await expect(downloadButton).toBeDisabled();
  });

  test('displays stats correctly', async ({ page }) => {
    // Select 3 files
    await page.locator('button').filter({ hasText: /^A0/ }).first().click();
    await page.locator('button').filter({ hasText: /^A1/ }).first().click();
    await page.locator('button').filter({ hasText: /^A2/ }).first().click();

    // Check selected count
    const stats = page.locator('text=Selected').locator('..').locator('div').first();
    await expect(stats).toHaveText('3');
  });

  test('displays features section', async ({ page }) => {
    await expect(page.getByText('TypeScript support with full type definitions')).toBeVisible();
    await expect(page.getByText('Concurrent downloads with Promise.all')).toBeVisible();
    await expect(page.getByText('Progress tracking callbacks')).toBeVisible();
  });

  test('displays code example', async ({ page }) => {
    await expect(page.getByText("import { zipper } from '@diegoaltoworks/zipper'")).toBeVisible();
  });
});
