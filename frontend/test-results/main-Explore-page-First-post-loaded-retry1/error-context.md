# Test info

- Name: Explore page >> First post loaded
- Location: C:\Users\louis\Documents\srcbox\frontend\tests\main.spec.ts:329:9

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('Hello World')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('Hello World')

    at C:\Users\louis\Documents\srcbox\frontend\tests\main.spec.ts:341:54
```

# Page snapshot

```yaml
- alert
- navigation:
  - link "Srcbox":
    - /url: /
  - link "Home":
    - /url: /
    - img
    - text: Home
  - link "Explore":
    - /url: /explore
    - img
    - text: Explore
  - link "Editor":
    - /url: /editor
    - img
    - text: Editor
  - link "Featured":
    - /url: /featured
    - img
    - text: Featured
  - link "Profile":
    - /url: /profile
    - img
    - text: Profile
  - img
- heading "Some Title" [level=2]
- iframe
- button "Like":
  - img
  - text: "0"
- button "Comment":
  - img
  - text: "0"
- button "Fork":
  - img
  - text: "0"
- button "Open in editor":
  - img
- button "Run":
  - img
  - text: "12"
```

# Test source

```ts
  241 |         await page.getByText("// JS", { exact: true }).click()
  242 |         await clear_text(page);
  243 |         await paste_text(page, JS);
  244 |         await expect(page.getByText(JS, { exact: true })).toBeVisible();
  245 |     });
  246 |
  247 |     test('css editor accepts text', async ({ page }) =>
  248 |     {
  249 |         await login(page, EMAIL, PASSWORD);
  250 |         await page.waitForURL("/explore")
  251 |         await page.goto('/editor');
  252 |         await page.getByText("/*CSS*/", { exact: true }).click();
  253 |         await clear_text(page);
  254 |         await paste_text(page, CSS);
  255 |     });
  256 |
  257 |     test('commit button is disabled if there is no title or description', async ({ page }) =>
  258 |     {
  259 |         await login(page, EMAIL, PASSWORD);
  260 |         await page.waitForURL("/explore")
  261 |         await page.goto('/editor');
  262 |         await page.locator('button', { hasText: "Post" }).click();
  263 |         await expect(page.locator('button', { hasText: "Commit" })).toBeDisabled();
  264 |     });
  265 |
  266 |     test('commit button is disabled if there is no title', async ({ page }) =>
  267 |     {
  268 |         await login(page, EMAIL, PASSWORD);
  269 |         await page.waitForURL("/explore")
  270 |         await page.goto('/editor');
  271 |         await page.locator('button', { hasText: "Post" }).click();
  272 |         await page.getByPlaceholder("Super cool description ngl").fill("Some desc");
  273 |         await expect(page.locator('button', { hasText: "Commit" })).toBeDisabled();
  274 |     });
  275 |
  276 |     test('commit button is disabled if there is no description', async ({ page }) =>
  277 |     {
  278 |         await login(page, EMAIL, PASSWORD);
  279 |         await page.waitForURL("/explore")
  280 |         await page.goto('/editor');
  281 |         await page.locator('button', { hasText: "Post" }).click();
  282 |         await page.getByPlaceholder("My Awesome Code").fill("Some Title");
  283 |         await expect(page.locator('button', { hasText: "Commit" })).toBeDisabled();
  284 |     });
  285 |
  286 |     test('commit button is enabled if there is title and description', async ({ page }) =>
  287 |     {
  288 |         await login(page, EMAIL, PASSWORD);
  289 |         await page.waitForURL("/explore")
  290 |         await page.goto('/editor');
  291 |         await page.locator('button', { hasText: "Post" }).click();
  292 |         await page.getByPlaceholder("My Awesome Code").fill("Some Title");
  293 |         await page.getByPlaceholder("Super cool description ngl").fill("Some desc");
  294 |         await expect(page.locator('button', { hasText: "Commit" })).toBeEnabled();
  295 |     });
  296 |
  297 |     test('upload post', async ({ page }) =>
  298 |     {
  299 |         await login(page, EMAIL, PASSWORD);
  300 |         await page.waitForURL("/explore")
  301 |         await page.goto('/editor');
  302 |         await page.locator('button', { hasText: "Post" }).click();
  303 |         await page.getByPlaceholder("My Awesome Code").fill("Some Title");
  304 |         await page.getByPlaceholder("Super cool description ngl").fill("Some desc");
  305 |
  306 |
  307 |         // Add the code
  308 |         await page.getByText("<!--HTML-->", { exact: true }).click();
  309 |         await clear_text(page);
  310 |         await paste_text(page, HTML);
  311 |         await page.getByText("// JS", { exact: true }).click();
  312 |         await clear_text(page);
  313 |         await paste_text(page, JS);
  314 |         await page.getByText("/*CSS*/", { exact: true }).click();
  315 |         await clear_text(page);
  316 |         await paste_text(page, CSS);
  317 |
  318 |         await expect(page.locator('button', { hasText: "Commit" })).toBeEnabled();
  319 |
  320 |         // Post it
  321 |         await page.locator('button', { hasText: "Commit" }).click();
  322 |
  323 |         await page.waitForURL("**/view/**")
  324 |     });
  325 | });
  326 |
  327 | test.describe("Explore page", () =>
  328 | {
  329 |     test('First post loaded', async ({ page }) =>
  330 |     {
  331 |         await login(page, EMAIL, PASSWORD);
  332 |         await page.waitForURL("/explore")
  333 |
  334 |         // Need to check inside the iframe
  335 |         const post = await page.waitForSelector('iframe');
  336 |         const frame = await post.contentFrame();
  337 |
  338 |         if (!frame) throw new Error("Post not found");
  339 |
  340 |         // Hello world is what i defined the post be to above
> 341 |         await expect(frame.getByText("Hello World")).toBeVisible();
      |                                                      ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  342 |     });
  343 |
  344 |     test('Like post button updates', async ({ page }) =>
  345 |     {
  346 |         await login(page, EMAIL, PASSWORD);
  347 |         await page.waitForURL("/explore")
  348 |
  349 |         await page.getByLabel("Like").click();
  350 |
  351 |         const likes = await page.getByLabel("Like").textContent();
  352 |
  353 |         // Updates the count
  354 |         expect(likes).toBe("1");
  355 |         expect(page.getByLabel("Like")).toHaveClass(/text-accent/);
  356 |
  357 |         // Takes a sec for webserver to update
  358 |         await page.waitForTimeout(400);
  359 |     });
  360 |
  361 |     test('Unlike post button updates', async ({ page }) =>
  362 |     {
  363 |         await login(page, EMAIL, PASSWORD);
  364 |         await page.waitForURL("/explore")
  365 |
  366 |         await page.getByLabel("Like").click();
  367 |
  368 |         const likes = await page.getByLabel("Like").textContent();
  369 |
  370 |         // Wait for the iframe to load
  371 |         await page.waitForSelector("iframe")
  372 |
  373 |         expect(likes).toBe("0");
  374 |
  375 |         // Has a space in front bc it will have hover:test-accent, but not text-accent on its own
  376 |         expect(page.getByLabel("Like")).not.toHaveClass(/ text-accent/);
  377 |     });
  378 |
  379 |     test('Comment window opens', async ({ page }) =>
  380 |     {
  381 |         await login(page, EMAIL, PASSWORD);
  382 |         await page.waitForURL("/explore")
  383 |
  384 |         await page.getByLabel("Comment").click();
  385 |
  386 |         expect(page.getByText("Comments")).toBeVisible();
  387 |     });
  388 |
  389 |     test('Comment window closes', async ({ page }) =>
  390 |     {
  391 |         await login(page, EMAIL, PASSWORD);
  392 |         await page.waitForURL("/explore")
  393 |
  394 |         // Open
  395 |         await page.getByLabel("Comment").click();
  396 |         await page.waitForTimeout(100);
  397 |
  398 |         // Close
  399 |         await page.getByLabel("Comment").click();
  400 |
  401 |         expect(page.getByText("Comments")).not.toBeVisible();
  402 |     });
  403 |
  404 |     test('Post comment greyed with no text', async ({ page }) =>
  405 |     {
  406 |         await login(page, EMAIL, PASSWORD);
  407 |         await page.waitForURL("/explore")
  408 |
  409 |         // Open
  410 |         await page.getByLabel("Comment").click();
  411 |         const input = await page.waitForSelector("form>button");
  412 |
  413 |         expect(await input.isDisabled()).toBe(true);
  414 |     });
  415 |
  416 |     test('Post comment not greyed with text', async ({ page }) =>
  417 |     {
  418 |         await login(page, EMAIL, PASSWORD);
  419 |         await page.waitForURL("/explore")
  420 |
  421 |         // Open
  422 |         await page.getByLabel("Comment").click();
  423 |
  424 |         // Type
  425 |         await page.getByPlaceholder("Howd you center the div?").fill("Test");
  426 |
  427 |         const input = await page.waitForSelector("form>button");
  428 |         expect(await input.isDisabled()).toBe(false);
  429 |     });
  430 |
  431 |     test('Can post comment', async ({ page }) =>
  432 |     {
  433 |         await login(page, EMAIL, PASSWORD);
  434 |         await page.waitForURL("/explore")
  435 |
  436 |         // Open
  437 |         await page.getByLabel("Comment").click();
  438 |
  439 |         // Type
  440 |         await page.getByPlaceholder("Howd you center the div?").fill(COMMENT);
  441 |
```