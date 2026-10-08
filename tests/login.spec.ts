import { test, expect } from './fixtures';
import { PASSWORD, users } from '../test-data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in and see products @smoke', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard, PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventoryPage.title).toHaveText('Products');
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test('locked out user sees an error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut, PASSWORD);
    await expect(loginPage.error).toContainText('this user has been locked out');
  });

  test('wrong password is rejected', async ({ loginPage }) => {
    await loginPage.login(users.standard, 'wrong_password');
    await expect(loginPage.error).toContainText('Username and password do not match');
  });

  const requiredFields = [
    { name: 'username', user: '', pass: PASSWORD, message: 'Username is required' },
    { name: 'password', user: users.standard, pass: '', message: 'Password is required' },
  ];

  for (const field of requiredFields) {
    test(`empty ${field.name} shows validation message`, async ({ loginPage }) => {
      await loginPage.login(field.user, field.pass);
      await expect(loginPage.error).toContainText(field.message);
    });
  }

  test('logged-out user cannot open inventory directly', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.error).toContainText("You can only access '/inventory.html' when you are logged in");
  });

  test('user can log out', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(users.standard, PASSWORD);
    await inventoryPage.logout();
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
