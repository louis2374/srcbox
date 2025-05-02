// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('homepage has greeting text', async ({ page }) =>
{
    await page.goto('/');
    await expect(page.getByText('Hello')).toBeVisible();
});
