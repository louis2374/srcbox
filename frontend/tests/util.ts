import { Page } from "@playwright/test";

export const login = async (p_page: Page, p_email: string, p_password: string) =>
{
    await p_page.goto('/login');
    await p_page.getByPlaceholder('Email').fill(p_email)
    await p_page.getByPlaceholder('Password', { exact: true }).fill(p_password)
    await p_page.getByText("Login").click();
}

export const clear_text = async (p_page: Page) =>
{
    // I had to slow this a bit as monaco was slow
    await p_page.waitForTimeout(100);
    p_page.keyboard.press("Control+A");
    await p_page.waitForTimeout(100);
    p_page.keyboard.press("Backspace");
    await p_page.waitForTimeout(100);
}

export const paste_text = async (p_page: Page, p_text: string) =>
{
    await p_page.evaluate((text) =>
    {
        navigator.clipboard.writeText(text);
    }, p_text);
    await p_page.waitForTimeout(100);
    p_page.keyboard.press("Control+V")
    await p_page.waitForTimeout(100);
}