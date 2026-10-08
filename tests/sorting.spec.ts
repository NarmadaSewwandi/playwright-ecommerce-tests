import { test, expect } from './fixtures';

test.describe('Product sorting', () => {
  test('sorts names A to Z', async ({ loggedIn }) => {
    await loggedIn.sortBy('az');
    const names = await loggedIn.getNames();
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test('sorts names Z to A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.getNames();
    expect(names).toEqual([...names].sort((a, b) => b.localeCompare(a)));
  });

  test('sorts prices low to high', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sorts prices high to low', async ({ loggedIn }) => {
    await loggedIn.sortBy('hilo');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
