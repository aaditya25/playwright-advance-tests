import { test, expect } from '@playwright/test';

test('Check if user is able to access the URL', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Swag Labs/);
});

test('Check if user is able to sign in into the Swag Labs', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('[name="login-button"]').click();
  await expect(page.getByText('Swag Labs')).toBeVisible();
  await expect(page.locator('[data-test="secondary-header"]')).toBeVisible();
});

test('Check if all the products are listed', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('[name="login-button"]').click();
  await expect(page.locator('.inventory_item')).toHaveCount(6);
});

test('Check if product name, description and price displayed', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('[name="login-button"]').click();
  await expect(page.locator('.inventory_item').nth(0).locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
  await expect(page.locator('.inventory_item').nth(0).locator('[data-test="inventory-item-desc"]')).toHaveText('carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.');
  await expect(page.locator('.inventory_item').nth(0).locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
  });