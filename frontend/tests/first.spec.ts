// tests/example.spec.ts
import { test, expect } from '@playwright/test';

const USERNAME = "nerd_man";
const EMAIL = "nerd@gmail.com";
const PASSWORD = "trash_password123!";

test.describe("Register page", () =>
{
    test('register button is visible', async ({ page }) =>
    {
        await page.goto('/register');
        await expect(page.getByText('Register')).toBeVisible();
    });

    test('register inputs are visible', async ({ page }) =>
    {
        await page.goto('/register');
        await expect(page.getByPlaceholder('Username')).toBeVisible();
        await expect(page.getByPlaceholder('Email')).toBeVisible();
        await expect(page.getByPlaceholder('Password', { exact: true })).toBeVisible();
        await expect(page.getByPlaceholder('Confirm Password')).toBeVisible();
    });

    test('register succeeds', async ({ page }) =>
    {
        await page.goto('/register');
        await page.getByPlaceholder('Username').fill(USERNAME)
        await page.getByPlaceholder('Email').fill(EMAIL)
        await page.getByPlaceholder('Password', { exact: true }).fill(PASSWORD)
        await page.getByPlaceholder('Confirm Password').fill(PASSWORD);
        await page.getByText("Register").click();
        await page.waitForURL("/explore")
    });

    test('login succeeds', async ({ page }) =>
    {
        await page.goto('/login');
        await page.getByPlaceholder('Email').fill(EMAIL)
        await page.getByPlaceholder('Password', { exact: true }).fill(PASSWORD)
        await page.getByText("Login").click();
        await page.waitForURL("**/explore*")
    });
})