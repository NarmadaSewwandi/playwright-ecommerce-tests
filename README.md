# E-commerce Test Automation with Playwright

![Playwright Tests](https://github.com/NarmadaSewwandi/playwright-ecommerce-tests/actions/workflows/playwright.yml/badge.svg)

End-to-end UI test suite for an online store ([Sauce Demo](https://www.saucedemo.com)), written in **Playwright + TypeScript**. It covers the core shopping journey (login, product browsing, cart and checkout) and runs automatically in **GitHub Actions** on every push and pull request.

## What is tested

| Area | Scenarios |
|---|---|
| Login | Valid login, locked-out user, wrong password, required-field validation, protected page access, logout |
| Product sorting | Name A–Z / Z–A, price low–high / high–low |
| Cart | Add and remove items, badge count, cart contents, persistence after reload |
| Checkout | Full order flow, order total calculation (subtotal + tax), required-field validation |

**21 test cases × 2 browsers = 42 test runs** (Chrome and Firefox).

## Tech stack

- Playwright Test, TypeScript
- Page Object Model with custom fixtures
- Data-driven tests for validation rules
- GitHub Actions CI with HTML report artifact
- Screenshots, videos and traces captured on failure

## Project structure

```
├── pages/              # Page objects (Login, Inventory, Cart, Checkout)
├── tests/
│   ├── fixtures.ts     # Injects page objects + a logged-in starting state
│   ├── login.spec.ts
│   ├── sorting.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── test-data/          # Demo users and customer details
├── playwright.config.ts
└── .github/workflows/playwright.yml
```

## How to run

```bash
npm ci
npx playwright install
npm test
```

Other commands:

```bash
npm run test:chromium            # one browser only
npm run test:headed              # watch the browser
npx playwright test --grep @smoke  # smoke tests only
npm run report                   # open the HTML report
```

## Design decisions

- **Stable locators:** tests use the site's `data-test` attributes instead of CSS classes, so styling changes don't break them.
- **Fixtures over repeated setup:** the `loggedIn` fixture starts tests on the product page, keeping each test focused on what it checks.
- **Assertions on calculations, not just UI:** the checkout test recomputes the subtotal from item prices and checks that total = subtotal + tax.
- **Weekly scheduled run:** catches changes in the site under test even when this repo isn't touched.

## CI report

Every CI run uploads the Playwright HTML report as an artifact (Actions tab → latest run → `playwright-report`).

<!-- Add a screenshot of the HTML report here once the first CI run passes:
![Report](docs/report.png) -->
