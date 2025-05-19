# Test info

- Name: Editor page >> js editor allows editing
- Location: C:\Users\louis\Documents\srcbox\frontend\tests\main.spec.ts:236:9

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('document.getElementById("test").innerHTML += " World";', { exact: true })
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('document.getElementById("test").innerHTML += " World";', { exact: true })

    at C:\Users\louis\Documents\srcbox\frontend\tests\main.spec.ts:244:59
```

# Page snapshot

```yaml
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
- list:
  - button "Post"
  - text: "Title:"
  - textbox "My Awesome Code"
  - text: "Description:"
  - textbox "Super cool description ngl"
  - listitem:
    - button "Load Template"
  - listitem:
    - button "Save"
  - listitem:
    - button "Reset"
- code:
  - textbox "Editor content"
- iframe
- code:
  - textbox "Editor content"
- code:
  - textbox "Editor content"
- img
- text: 1 error
- button "Hide Errors":
  - img
- alert
- alert
- alert
```

# Test source

```ts
  144 |         await page.goto('/login');
  145 |         await expect(page.getByText('Login')).toBeVisible();
  146 |     });
  147 |
  148 |     test('login inputs are visible', async ({ page }) =>
  149 |     {
  150 |         await page.goto('/login');
  151 |         await expect(page.getByPlaceholder('Email')).toBeVisible();
  152 |         await expect(page.getByPlaceholder('Password')).toBeVisible();
  153 |     });
  154 |
  155 |     test('valid login succeeds', async ({ page }) =>
  156 |     {
  157 |         await login(page, EMAIL, PASSWORD);
  158 |         await page.waitForURL("/explore")
  159 |     });
  160 |
  161 |     test('invalid email login fails', async ({ page }) =>
  162 |     {
  163 |         await login(page, INVALID_EMAIL, PASSWORD);
  164 |         await page.waitForSelector("text=\"Invalid email\"");
  165 |     });
  166 |
  167 |     test('weak password login fails', async ({ page }) =>
  168 |     {
  169 |         await login(page, EMAIL2, WEAK_PASSWORD);
  170 |         await page.waitForSelector("text=\"Invalid password\"");
  171 |     });
  172 |
  173 |     test('empty email login fails', async ({ page }) =>
  174 |     {
  175 |         await login(page, "", PASSWORD);
  176 |         await page.waitForSelector("text=\"Invalid email\"");
  177 |     });
  178 |
  179 |     test('empty password login fails', async ({ page }) =>
  180 |     {
  181 |         await login(page, EMAIL2, "");
  182 |         await page.waitForSelector("text=\"Invalid password\"");
  183 |     });
  184 |
  185 |     test('switch to register button visible', async ({ page }) =>
  186 |     {
  187 |         await page.goto('/login');
  188 |         await expect(page.getByText("here", { exact: true })).toBeVisible();
  189 |     });
  190 |
  191 |     test('here register button navigates to register page', async ({ page }) =>
  192 |     {
  193 |         await page.goto('/login');
  194 |         await page.getByText("here", { exact: true }).click();
  195 |         await page.waitForURL("/register");
  196 |     });
  197 | });
  198 |
  199 | test.describe("Editor page", () =>
  200 | {
  201 |     test('html editor loads', async ({ page }) =>
  202 |     {
  203 |         await login(page, EMAIL, PASSWORD);
  204 |         await page.waitForURL("/explore")
  205 |         await page.goto('/editor');
  206 |         await expect(page.getByText("<!--HTML-->", { exact: true })).toBeVisible();
  207 |     });
  208 |
  209 |     test('js editor loads', async ({ page }) =>
  210 |     {
  211 |         await login(page, EMAIL, PASSWORD);
  212 |         await page.waitForURL("/explore")
  213 |         await page.goto('/editor');
  214 |         await expect(page.getByText("// JS", { exact: true })).toBeVisible();
  215 |     });
  216 |
  217 |     test('css editor loads', async ({ page }) =>
  218 |     {
  219 |         await login(page, EMAIL, PASSWORD);
  220 |         await page.waitForURL("/explore")
  221 |         await page.goto('/editor');
  222 |         await expect(page.getByText("/*CSS*/", { exact: true })).toBeVisible();
  223 |     });
  224 |
  225 |     test('html editor allows editing', async ({ page }) =>
  226 |     {
  227 |         await login(page, EMAIL, PASSWORD);
  228 |         await page.waitForURL("/explore")
  229 |         await page.goto('/editor');
  230 |         await page.getByText("<!--HTML-->", { exact: true }).click();
  231 |         await clear_text(page);
  232 |         await paste_text(page, HTML);
  233 |         await expect(page.getByText(HTML, { exact: true })).toBeVisible();
  234 |     });
  235 |
  236 |     test('js editor allows editing', async ({ page }) =>
  237 |     {
  238 |         await login(page, EMAIL, PASSWORD);
  239 |         await page.waitForURL("/explore")
  240 |         await page.goto('/editor');
  241 |         await page.getByText("// JS", { exact: true }).click()
  242 |         await clear_text(page);
  243 |         await paste_text(page, JS);
> 244 |         await expect(page.getByText(JS, { exact: true })).toBeVisible();
      |                                                           ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
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
  341 |         await expect(frame.getByText("Hello World")).toBeVisible();
  342 |     });
  343 |
  344 |     test('Like post button updates', async ({ page }) =>
```