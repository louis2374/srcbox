# Test info

- Name: homepage has greeting text
- Location: C:\Users\aseaa\Documents\projects\srcbox\frontend\tests\first.spec.ts:4:5

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByText('Hello')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('Hello')

    at C:\Users\aseaa\Documents\projects\srcbox\frontend\tests\first.spec.ts:7:43
```

# Page snapshot

```yaml
- heading "Welcome Back" [level=1]
- text: New? Register
- link "here":
  - /url: /register
- textbox "Email": bingus@gmail.com
- textbox "Password": bingus123
- button "Login"
- alert
```

# Test source

```ts
  1 | // tests/example.spec.ts
  2 | import { test, expect } from '@playwright/test';
  3 |
  4 | test('homepage has greeting text', async ({ page }) =>
  5 | {
  6 |     await page.goto('/');
> 7 |     await expect(page.getByText('Hello')).toBeVisible();
    |                                           ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  8 | });
  9 |
```