import { test, expect } from './fixtures';
import { customer } from '../test-data/users';

test.describe('Checkout', () => {
  test.beforeEach(async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.addToCart('Sauce Labs Bike Light');
    await loggedIn.openCart();
    await cartPage.checkout();
  });

  test('customer can complete an order @smoke', async ({ page, checkoutPage }) => {
    await checkoutPage.fillDetails(customer.firstName, customer.lastName, customer.postalCode);
    await checkoutPage.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('order totals add up correctly', async ({ checkoutPage }) => {
    await checkoutPage.fillDetails(customer.firstName, customer.lastName, customer.postalCode);

    const prices = (await checkoutPage.itemPrices.allInnerTexts()).map((t) => Number(t.replace('$', '')));
    const expectedSubtotal = prices.reduce((sum, p) => sum + p, 0);

    const subtotal = await checkoutPage.readAmount(checkoutPage.subtotal);
    const tax = await checkoutPage.readAmount(checkoutPage.tax);
    const total = await checkoutPage.readAmount(checkoutPage.total);

    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  const missingFields = [
    { field: 'first name', first: '', last: customer.lastName, postal: customer.postalCode, message: 'First Name is required' },
    { field: 'last name', first: customer.firstName, last: '', postal: customer.postalCode, message: 'Last Name is required' },
    { field: 'postal code', first: customer.firstName, last: customer.lastName, postal: '', message: 'Postal Code is required' },
  ];

  for (const c of missingFields) {
    test(`missing ${c.field} blocks checkout`, async ({ checkoutPage }) => {
      await checkoutPage.fillDetails(c.first, c.last, c.postal);
      await expect(checkoutPage.error).toContainText(c.message);
    });
  }
});
