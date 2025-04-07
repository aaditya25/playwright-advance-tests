import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/ProductPage';
import { products } from '../data/products.json'
import { ItemCheckoutPage } from '../pages/ItemCheckoutPage';

let loginPage: LoginPage
let productPage: ProductPage
let itemCheckoutPage: ItemCheckoutPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  productPage = new ProductPage(page);
  itemCheckoutPage = new ItemCheckoutPage(page)
  await loginPage.goto();
  await loginPage.standardUserLogin('standard_user', 'secret_sauce')
});


test('Check if user is able to sign in into the Swag Labs', async ({ page }) => {
  await expect(page.getByText('Swag Labs')).toBeVisible();
  await expect(productPage.pageTitle).toHaveText('Products');
});

test('Check if all the products are listed', async ({ page }) => {
  await expect(productPage.item).toHaveCount(6);
});

test('Check if product name, description and price displayed on products page', async ({ page }) => {
  await expect(productPage.getItemName(0)).toHaveText(products.productName.backpack);
  await expect(productPage.getItemDescription(0)).toHaveText(products.productDescription.productBackpackDescription);
  await expect(productPage.getItemPrice(0)).toHaveText(products.productPrices.productBackpackPrice)
});

test('Open product 2 and check if product name, description and price displayed', async ({ page }) => {
  await productPage.getItemName(1).click();
  await expect(productPage.itemName).toHaveText(products.productName.bikeLight);
  await expect(productPage.itemDescription).toHaveText(products.productDescription.productBikeLightDescription);
  await expect(productPage.itemPrice).toHaveText(products.productPrices.productBikeLightPrice)
});


test('Verify product can be sorted using name', async ({ page }) => {
  const productNames = productPage.itemName
  //Sort by Name: Z to A
  productPage.sortData('za');
  const namesZA = await productNames.allTextContents();
  const sortedZA = [...namesZA].sort().reverse();
  expect(namesZA).toEqual(sortedZA)

  //Sort by Name: A to Z
  productPage.sortData('az');
  const namesAZ = await productNames.allTextContents();
  const sortedAZ = [...namesAZ].sort();
  expect(namesAZ).toEqual(sortedAZ)
});


test('Verify product can be sorted using Price', async ({ page }) => {
  const productPrices = productPage.itemPrice
  //Sort by Name: price high to low
  productPage.sortData('hilo');
  const priceHighToLow = await productPrices.allTextContents();
  const priceHighToLowParsed = priceHighToLow.map(p => parseFloat(p.replace('$', '')))
  const sortedHighToLow = [...priceHighToLowParsed].sort((a, b) => b - a);
  expect(priceHighToLowParsed).toEqual(sortedHighToLow)

  //Sort by Name: price low to high
  productPage.sortData('lohi');
  const priceLowToHigh = await productPrices.allTextContents();
  const priceLowToHighParsed = priceLowToHigh.map(p => parseFloat(p.replace('$', '')))
  const sortedLowToHigh = [...priceLowToHighParsed].sort((a, b) => a - b);
  expect(priceLowToHighParsed).toEqual(sortedLowToHigh)
});

test('Verify if user can add items to cart and can also remove them', async ({ page }) => {
  await itemCheckoutPage.addBackpackToCart.waitFor({ state: 'visible' });
  await itemCheckoutPage.addBackpackToCart.click();
  await itemCheckoutPage.addBikeLightToCart.click();
  await expect(itemCheckoutPage.removeBackpackFromCart).toBeVisible();
  await expect(itemCheckoutPage.removeBikeLightFromCart).toBeVisible();
  await expect(productPage.cartBadge).toHaveText('2');
  await productPage.cartButton.click();
  await expect(productPage.pageTitle).toHaveText('Your Cart');
  await expect(itemCheckoutPage.getItemNameFromCartList('#item_0_title_link')).toHaveText(products.productName.bikeLight);
  await expect(itemCheckoutPage.getItemNameFromCartList('#item_4_title_link')).toHaveText(products.productName.backpack);
  await itemCheckoutPage.removeBikeLightFromCart.click();
  await expect(itemCheckoutPage.getItemNameFromCartList('#item_0_title_link')).not.toBeVisible();
});


test('Check if user can order the Item', async ({ page }) => {
  await itemCheckoutPage.addBackpackToCart.click();
  await productPage.cartButton.click();
  await itemCheckoutPage.buttonAction('checkout');
  await expect(productPage.pageTitle).toHaveText('Checkout: Your Information');
  await itemCheckoutPage.enterUserDetails('firstName','adi');
  await itemCheckoutPage.enterUserDetails('lastName','chaudhari');
  await itemCheckoutPage.enterUserDetails('postalCode','411021');

  await itemCheckoutPage.buttonAction('continue');
  await expect(productPage.pageTitle).toHaveText('Checkout: Overview');
  await expect(itemCheckoutPage.subtotal).toHaveText('Item total: $29.99');
  await expect(itemCheckoutPage.taxImplicable).toHaveText('Tax: $2.40');
  await expect(itemCheckoutPage.totalPrice).toHaveText('Total: $32.39');
  await itemCheckoutPage.buttonAction('finish');
  await expect(productPage.pageTitle).toHaveText('Checkout: Complete!');
  await expect(itemCheckoutPage.orderCompletionHeader).toHaveText('Thank you for your order!');
  await expect(itemCheckoutPage.orderCompletionDesc).toHaveText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
  await itemCheckoutPage.buttonAction('back-to-products');
  await expect(productPage.pageTitle).toHaveText('Products');
});
