import { expect, test } from '@playwright/test';

test.describe('Playground Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/playground');
  });

  test('has correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Playground', level: 1 })).toBeVisible();
  });

  test('displays consistent header with icons', async ({ page }) => {
    // Check for icon buttons with titles
    await expect(page.locator('a[title="NPM Package"]')).toBeVisible();
    await expect(page.locator('a[title="GitHub Repository"]')).toBeVisible();
    await expect(page.locator('a[title="Home"]')).toBeVisible();
  });

  test('displays configuration panel', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Configuration' })).toBeVisible();
    await expect(page.getByText('File List (JSON)')).toBeVisible();
    await expect(page.getByText('ZIP Filename')).toBeVisible();
    await expect(page.getByText('Timeout (ms)')).toBeVisible();
    await expect(page.getByText('Continue on error')).toBeVisible();
  });

  test('displays file list textarea with default content', async ({ page }) => {
    const textarea = page.getByPlaceholder(/\[{"url": "\/file.pdf"/);
    await expect(textarea).toBeVisible();

    const content = await textarea.inputValue();
    expect(content).toContain('A0.pdf');
    expect(content).toContain('B0.pdf');
    expect(content).toContain('C0.pdf');
  });

  test('displays zip filename input with default value', async ({ page }) => {
    const input = page.getByLabel('ZIP Filename');
    await expect(input).toHaveValue('my-files.zip');
  });

  test('displays timeout input with default value', async ({ page }) => {
    const input = page.getByLabel('Timeout (ms)');
    await expect(input).toHaveValue('30000');
  });

  test('continue on error checkbox is checked by default', async ({ page }) => {
    const checkbox = page.getByLabel('Continue on error');
    await expect(checkbox).toBeChecked();
  });

  test('displays run code button', async ({ page }) => {
    const runButton = page.getByRole('button', { name: /▶ Run Code/ });
    await expect(runButton).toBeVisible();
    await expect(runButton).toBeEnabled();
  });

  test('displays clear console button', async ({ page }) => {
    const clearButton = page.getByRole('button', { name: 'Clear Console' });
    await expect(clearButton).toBeVisible();
  });

  test('displays generated code section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Generated Code' })).toBeVisible();

    const codeBlock = page.locator('pre').filter({ hasText: "import { zipper }" });
    await expect(codeBlock).toBeVisible();
  });

  test('displays copy code button', async ({ page }) => {
    const copyButton = page.getByRole('button', { name: 'Copy Code' });
    await expect(copyButton).toBeVisible();
  });

  test('displays console output section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Console Output' })).toBeVisible();
    await expect(page.getByText('Console output will appear here')).toBeVisible();
  });

  test('displays tips section', async ({ page }) => {
    await expect(page.getByText('💡 Tips')).toBeVisible();
    await expect(page.getByText('Modify the configuration and click "Run Code" to test')).toBeVisible();
  });

  test('can modify zip filename', async ({ page }) => {
    const input = page.getByLabel('ZIP Filename');
    await input.fill('custom-archive.zip');
    await expect(input).toHaveValue('custom-archive.zip');

    // Check it updates in generated code
    const codeBlock = page.locator('pre').filter({ hasText: "zipFilename:" });
    await expect(codeBlock).toContainText('custom-archive.zip');
  });

  test('can modify timeout', async ({ page }) => {
    const input = page.getByLabel('Timeout (ms)');
    await input.fill('60000');
    await expect(input).toHaveValue('60000');

    // Check it updates in generated code
    const codeBlock = page.locator('pre').filter({ hasText: "timeout:" });
    await expect(codeBlock).toContainText('60000');
  });

  test('can toggle continue on error checkbox', async ({ page }) => {
    const checkbox = page.getByLabel('Continue on error');

    // Uncheck
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();

    // Check it updates in generated code
    const codeBlock = page.locator('pre').filter({ hasText: "continueOnError:" });
    await expect(codeBlock).toContainText('false');

    // Re-check
    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await expect(codeBlock).toContainText('true');
  });

  test('reset to default button works', async ({ page }) => {
    const textarea = page.getByPlaceholder(/\[{"url": "\/file.pdf"/);

    // Modify the content
    await textarea.fill('[{"url": "/test.pdf", "name": "test.pdf"}]');

    // Click reset
    await page.getByRole('button', { name: 'Reset to Default' }).click();

    // Should be back to default
    const content = await textarea.inputValue();
    expect(content).toContain('A0.pdf');
  });

  test('demo navigation links work', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Intro' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Progress' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Mixed-Type' })).toBeVisible();
  });
});
