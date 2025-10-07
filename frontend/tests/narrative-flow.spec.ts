import { test, expect } from '@playwright/test';

test('loads the Echoes of Lisboa narrative arcs', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Echoes of Lisboa' })).toBeVisible();
  await expect(page.getByText('Vibrations on Rua da Saudade')).toBeVisible();
  await expect(page.getByRole('button', { name: /load/i })).toBeVisible();
});
