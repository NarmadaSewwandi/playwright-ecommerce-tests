import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PASSWORD, users } from '../test-data/users';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** Starts the test already logged in as the standard user. */
  loggedIn: InventoryPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutPage: async ({ page }, use) => use(new CheckoutPage(page)),
  loggedIn: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.standard, PASSWORD);
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
