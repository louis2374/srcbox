import { test, expect } from '@playwright/test';
import { clear_text, login, paste_text } from './util';

// Similar to backend. These are not so proper, really I should have before all functions to create account and login, each test / section should
// be entirely independent in seperate files and ect. These tests use a flow system, which requires to top requests to succeed, as they create the account and ect.
// This is not really a problem for me as I will not be having a huge number of tests, and this application will not
// be continued once I hand this in.

const USERNAME = "nerd_man";
const USERNAME2 = "nerd_man2";
const EMAIL = "nerd@gmail.com";
const EMAIL2 = "nerd2@gmail.com";
const INVALID_EMAIL = "bademail";
const PASSWORD = "trash_password123!";
const WEAK_PASSWORD = "hi";
const COMMENT = "what is this??";

// Post
const CSS = `#test {
    color: pink;
}`
const HTML = `<div id="test">Hello</div>`;
const JS = `document.getElementById("test").innerHTML += " World";`

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

    test('valid register succeeds', async ({ page }) =>
    {
        await page.goto('/register');
        await page.getByPlaceholder('Username').fill(USERNAME)
        await page.getByPlaceholder('Email').fill(EMAIL)
        await page.getByPlaceholder('Password', { exact: true }).fill(PASSWORD)
        await page.getByPlaceholder('Confirm Password').fill(PASSWORD);
        await page.getByText("Register").click();
        await page.waitForURL("/explore")
    });

    test('duplicate name register fails', async ({ page }) =>
    {
        await page.goto('/register');
        await page.getByPlaceholder('Username').fill(USERNAME)
        await page.getByPlaceholder('Email').fill(EMAIL2)
        await page.getByPlaceholder('Password', { exact: true }).fill(PASSWORD)
        await page.getByPlaceholder('Confirm Password').fill(PASSWORD);
        await page.getByText("Register").click();
        await page.waitForSelector("text=\"Username already in use\"");
    });

    test('invalid email register fails', async ({ page }) =>
    {
        await page.goto('/register');
        await page.getByPlaceholder('Username').fill(USERNAME2)
        await page.getByPlaceholder('Email').fill(INVALID_EMAIL)
        await page.getByPlaceholder('Password', { exact: true }).fill(PASSWORD)
        await page.getByPlaceholder('Confirm Password').fill(PASSWORD);
        await page.getByText("Register").click();
        await page.waitForSelector("text=\"Invalid email\"");
    });

    test('weak password register fails', async ({ page }) =>
    {
        await page.goto('/register');
        await page.getByPlaceholder('Username').fill(USERNAME2)
        await page.getByPlaceholder('Email').fill(EMAIL2)
        await page.getByPlaceholder('Password', { exact: true }).fill(WEAK_PASSWORD)
        await page.getByPlaceholder('Confirm Password').fill(WEAK_PASSWORD);
        await page.getByText("Register").click();
        await page.waitForSelector("text=\"Password requires at least 8 chars, one number and one letter\"");
    });

    test('confirm password does not match register fails', async ({ page }) =>
    {
        await page.goto('/register');
        await page.getByPlaceholder('Username').fill(USERNAME2)
        await page.getByPlaceholder('Email').fill(EMAIL2)
        await page.getByPlaceholder('Password', { exact: true }).fill(PASSWORD)
        await page.getByPlaceholder('Confirm Password').fill(WEAK_PASSWORD);
        await page.getByText("Register").click();
        await page.waitForSelector("text=\"Passwords do not match\"");
    });

    test('empty username register fails', async ({ page }) =>
    {
        await page.goto('/register');
        await page.getByPlaceholder('Email').fill(EMAIL2)
        await page.getByPlaceholder('Password', { exact: true }).fill(PASSWORD)
        await page.getByPlaceholder('Confirm Password').fill(PASSWORD);
        await page.getByText("Register").click();
        await page.waitForSelector("text=\"Username is empty\"");
    });

    test('empty email register fails', async ({ page }) =>
    {
        await page.goto('/register');
        await page.getByPlaceholder('Username').fill(USERNAME2)
        await page.getByPlaceholder('Password', { exact: true }).fill(PASSWORD)
        await page.getByPlaceholder('Confirm Password').fill(PASSWORD);
        await page.getByText("Register").click();
        await page.waitForSelector("text=\"Invalid email\"");
    });

    test('empty password register fails', async ({ page }) =>
    {
        await page.goto('/register');
        await page.getByPlaceholder('Username').fill(USERNAME2)
        await page.getByPlaceholder('Email').fill(EMAIL2)
        await page.getByText("Register").click();
        await page.waitForSelector("text=\"Password requires at least 8 chars, one number and one letter\"");
    });

    test('switch to login button visible', async ({ page }) =>
    {
        await page.goto('/register');
        await expect(page.getByText("here", { exact: true })).toBeVisible();
    });

    test('here login button navigates to login page', async ({ page }) =>
    {
        await page.goto('/register');
        await page.getByText("here", { exact: true }).click();
        await page.waitForURL("/login");
    });
});

test.describe("Login page", () =>
{
    test('login button is visible', async ({ page }) =>
    {
        await page.goto('/login');
        await expect(page.getByText('Login')).toBeVisible();
    });

    test('login inputs are visible', async ({ page }) =>
    {
        await page.goto('/login');
        await expect(page.getByPlaceholder('Email')).toBeVisible();
        await expect(page.getByPlaceholder('Password')).toBeVisible();
    });

    test('valid login succeeds', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
    });

    test('invalid email login fails', async ({ page }) =>
    {
        await login(page, INVALID_EMAIL, PASSWORD);
        await page.waitForSelector("text=\"Invalid email\"");
    });

    test('weak password login fails', async ({ page }) =>
    {
        await login(page, EMAIL2, WEAK_PASSWORD);
        await page.waitForSelector("text=\"Invalid password\"");
    });

    test('empty email login fails', async ({ page }) =>
    {
        await login(page, "", PASSWORD);
        await page.waitForSelector("text=\"Invalid email\"");
    });

    test('empty password login fails', async ({ page }) =>
    {
        await login(page, EMAIL2, "");
        await page.waitForSelector("text=\"Invalid password\"");
    });

    test('switch to register button visible', async ({ page }) =>
    {
        await page.goto('/login');
        await expect(page.getByText("here", { exact: true })).toBeVisible();
    });

    test('here register button navigates to register page', async ({ page }) =>
    {
        await page.goto('/login');
        await page.getByText("here", { exact: true }).click();
        await page.waitForURL("/register");
    });
});

test.describe("Editor page", () =>
{
    test('html editor loads', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await expect(page.getByText("<!--HTML-->", { exact: true })).toBeVisible();
    });

    test('js editor loads', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await expect(page.getByText("// JS", { exact: true })).toBeVisible();
    });

    test('css editor loads', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await expect(page.getByText("/*CSS*/", { exact: true })).toBeVisible();
    });

    test('html editor allows editing', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await page.getByText("<!--HTML-->", { exact: true }).click();
        await clear_text(page);
        await paste_text(page, HTML);
        await expect(page.getByText(HTML, { exact: true })).toBeVisible();
    });

    test('js editor allows editing', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await page.getByText("// JS", { exact: true }).click()
        await clear_text(page);
        await paste_text(page, JS);
        await expect(page.getByText(JS, { exact: true })).toBeVisible();
    });

    test('css editor accepts text', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await page.getByText("/*CSS*/", { exact: true }).click();
        await clear_text(page);
        await paste_text(page, CSS);
    });

    test('commit button is disabled if there is no title or description', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await page.locator('button', { hasText: "Post" }).click();
        await expect(page.locator('button', { hasText: "Commit" })).toBeDisabled();
    });

    test('commit button is disabled if there is no title', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await page.locator('button', { hasText: "Post" }).click();
        await page.getByPlaceholder("Super cool description ngl").fill("Some desc");
        await expect(page.locator('button', { hasText: "Commit" })).toBeDisabled();
    });

    test('commit button is disabled if there is no description', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await page.locator('button', { hasText: "Post" }).click();
        await page.getByPlaceholder("My Awesome Code").fill("Some Title");
        await expect(page.locator('button', { hasText: "Commit" })).toBeDisabled();
    });

    test('commit button is enabled if there is title and description', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await page.locator('button', { hasText: "Post" }).click();
        await page.getByPlaceholder("My Awesome Code").fill("Some Title");
        await page.getByPlaceholder("Super cool description ngl").fill("Some desc");
        await expect(page.locator('button', { hasText: "Commit" })).toBeEnabled();
    });

    test('upload post', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")
        await page.goto('/editor');
        await page.locator('button', { hasText: "Post" }).click();
        await page.getByPlaceholder("My Awesome Code").fill("Some Title");
        await page.getByPlaceholder("Super cool description ngl").fill("Some desc");


        // Add the code
        await page.getByText("<!--HTML-->", { exact: true }).click();
        await clear_text(page);
        await paste_text(page, HTML);
        await page.getByText("// JS", { exact: true }).click();
        await clear_text(page);
        await paste_text(page, JS);
        await page.getByText("/*CSS*/", { exact: true }).click();
        await clear_text(page);
        await paste_text(page, CSS);

        await expect(page.locator('button', { hasText: "Commit" })).toBeEnabled();

        // Post it
        await page.locator('button', { hasText: "Commit" }).click();

        await page.waitForURL("**/view/**")
    });
});

test.describe("Explore page", () =>
{
    test('First post loaded', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")

        // Need to check inside the iframe
        const post = await page.waitForSelector('iframe');
        const frame = await post.contentFrame();

        if (!frame) throw new Error("Post not found");

        // Hello world is what i defined the post be to above
        await expect(frame.getByText("Hello World")).toBeVisible();
    });

    test('Like post button updates', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")

        await page.getByLabel("Like").click();

        const likes = await page.getByLabel("Like").textContent();

        // Updates the count
        expect(likes).toBe("1");
        expect(page.getByLabel("Like")).toHaveClass(/text-accent/);

        // Takes a sec for webserver to update
        await page.waitForTimeout(400);
    });

    test('Unlike post button updates', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")

        await page.getByLabel("Like").click();

        const likes = await page.getByLabel("Like").textContent();

        // Wait for the iframe to load
        await page.waitForSelector("iframe")

        expect(likes).toBe("0");

        // Has a space in front bc it will have hover:test-accent, but not text-accent on its own
        expect(page.getByLabel("Like")).not.toHaveClass(/ text-accent/);
    });

    test('Comment window opens', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")

        await page.getByLabel("Comment").click();

        expect(page.getByText("Comments")).toBeVisible();
    });

    test('Comment window closes', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")

        // Open
        await page.getByLabel("Comment").click();
        await page.waitForTimeout(100);

        // Close
        await page.getByLabel("Comment").click();

        expect(page.getByText("Comments")).not.toBeVisible();
    });

    test('Post comment greyed with no text', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")

        // Open
        await page.getByLabel("Comment").click();
        const input = await page.waitForSelector("form>button");

        expect(await input.isDisabled()).toBe(true);
    });

    test('Post comment not greyed with text', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")

        // Open
        await page.getByLabel("Comment").click();

        // Type
        await page.getByPlaceholder("Howd you center the div?").fill("Test");

        const input = await page.waitForSelector("form>button");
        expect(await input.isDisabled()).toBe(false);
    });

    test('Can post comment', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")

        // Open
        await page.getByLabel("Comment").click();

        // Type
        await page.getByPlaceholder("Howd you center the div?").fill(COMMENT);

        // Send comment
        const button = await page.waitForSelector("form>button");

        // Takes a sec to remove the text from the input
        await page.waitForTimeout(50);
        await button.click();

        await expect(page.getByText(COMMENT)).toBeVisible();

        // I know its not good to use this in tests, but i need to use it to account for server speeds
        await page.waitForTimeout(400);
    });

    test('Comment count updates', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")

        const comments = await page.getByLabel("Comment").textContent();

        expect(comments).toBe("1");
    });

    test('Open in editor button works', async ({ page }) =>
    {
        await login(page, EMAIL, PASSWORD);
        await page.waitForURL("/explore")

        await page.getByLabel("Open in editor").click();

        await page.waitForURL("**/editor/**");
    });
});