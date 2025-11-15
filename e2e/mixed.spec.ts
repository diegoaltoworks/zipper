import { expect, test } from '@playwright/test';

test.describe('Mixed Files Demo Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/mixed');
  });

  test('has correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Mixed File Types', level: 1 })).toBeVisible();
  });

  test('displays consistent header with icons', async ({ page }) => {
    // Check for icon buttons with titles
    await expect(page.locator('a[title="Playground"]')).toBeVisible();
    await expect(page.locator('a[title="NPM Package"]')).toBeVisible();
    await expect(page.locator('a[title="GitHub Repository"]')).toBeVisible();
    await expect(page.locator('a[title="Home"]')).toBeVisible();
  });

  test('displays file type selection buttons', async ({ page }) => {
    await expect(page.getByRole('button', { name: /Select All PDFs/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Select All PNGs/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Select All Text/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Select Mixed Sample' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear All' })).toBeVisible();
  });

  test('displays file type stats', async ({ page }) => {
    await expect(page.getByText('PDFs')).toBeVisible();
    await expect(page.getByText('PNGs')).toBeVisible();
    await expect(page.getByText('Text Files')).toBeVisible();
    await expect(page.getByText('Total')).toBeVisible();
  });

  test('select all PDFs button works', async ({ page }) => {
    const selectPDFsButton = page.getByRole('button', { name: /Select All PDFs/ });
    await selectPDFsButton.click();

    // Check PDF count updated
    const pdfStat = page.locator('div.bg-red-50 div.text-2xl').first();
    await expect(pdfStat).toHaveText('30'); // A-E, 0-5 = 5*6 = 30
  });

  test('select all PNGs button works', async ({ page }) => {
    const selectPNGsButton = page.getByRole('button', { name: /Select All PNGs/ });
    await selectPNGsButton.click();

    // Check PNG count updated
    const pngStat = page.locator('div.bg-blue-50 div.text-2xl').first();
    await expect(pngStat).toHaveText('30'); // F-K (excluding I), 0-5 = 5*6 = 30
  });

  test('select all text files button works', async ({ page }) => {
    const selectTextButton = page.getByRole('button', { name: /Select All Text/ });
    await selectTextButton.click();

    // Check text file count updated
    const txtStat = page.locator('div.bg-yellow-50 div.text-2xl').first();
    await expect(txtStat).toHaveText('10'); // L0-L9 = 10
  });

  test('select mixed sample button works', async ({ page }) => {
    const selectMixedButton = page.getByRole('button', { name: 'Select Mixed Sample' });
    await selectMixedButton.click();

    // Should have some files selected
    const totalStat = page.locator('div.bg-green-50 div.text-2xl').first();
    const text = await totalStat.textContent();
    expect(parseInt(text || '0')).toBeGreaterThan(0);
  });

  test('clear all button works', async ({ page }) => {
    // Select some files first
    await page.getByRole('button', { name: /Select All PDFs/ }).click();

    // Then clear
    await page.getByRole('button', { name: 'Clear All' }).click();

    // All counts should be 0
    await expect(page.locator('div.bg-red-50 div.text-2xl').first()).toHaveText('0');
    await expect(page.locator('div.bg-blue-50 div.text-2xl').first()).toHaveText('0');
    await expect(page.locator('div.bg-yellow-50 div.text-2xl').first()).toHaveText('0');
    await expect(page.locator('div.bg-green-50 div.text-2xl').first()).toHaveText('0');
  });

  test('displays info section', async ({ page }) => {
    await expect(page.getByText('About This Demo')).toBeVisible();
    await expect(page.getByText('Mix PDFs, PNGs, and text files in a single download')).toBeVisible();
  });

  test('demo navigation links work', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Intro' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Progress' })).toBeVisible();
  });
});
