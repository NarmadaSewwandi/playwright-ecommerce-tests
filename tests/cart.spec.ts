import { test, expect } from './fixtures';

test.describe('Shopping cart', () => {
  test('adding products updates the cart badge @smoke', async ({ loggedIn }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await expect(loggedIn.cartBadge).toHaveText('1');

    await loggedIn.addToCart('Sauce Labs Bike Light');
    await expect(loggedIn.cartBadge).toHaveText('2');
  });

  test('removing a product from inventory clears the badge', async ({ loggedIn }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.removeFromCart('Sauce Labs Backpack');
    await expect(loggedIn.cartBadge).toBeHidden();
  });

  test('cart shows the products that were added', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.addToCart('Sauce Labs Fleece Jacket');
    await loggedIn.openCart();

    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Fleece Jacket']);
  });

  test('product can be removed from the cart page', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.addToCart('Sauce Labs Onesie');
    await loggedIn.openCart();

    await cartPage.remove('Sauce Labs Backpack');
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Onesie']);
  });

  test('cart contents persist after page reload', async ({ page, loggedIn }) => {
    await loggedIn.addToCart('Sauce Labs Bolt T-Shirt');
    await page.reload();
    await expect(loggedIn.cartBadge).toHaveText('1');
  });
});
