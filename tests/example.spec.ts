import { test, expect } from '@playwright/test';
//POM
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { ItemCheckoutPage } from '../pages/ItemCheckoutPage';
//Data Files
import { products } from '../data/products.json';
import { title, expectedText, buttonAction } from '../data/expectedTexts.json';
import { userDetails} from '../data/userDetails.json';
import { productIds} from '../data/productIds.json';
import * as dotenv from 'dotenv';

dotenv.config();
let loginPage: LoginPage
let productPage: ProductPage
let itemCheckoutPage: ItemCheckoutPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  productPage = new ProductPage(page);
  itemCheckoutPage = new ItemCheckoutPage(page)
  await loginPage.goto();
  await loginPage.standardUserLogin(process.env.USERNAME || '', process.env.PASSWORD || '')
});

test('Check if user is able to sign in into the Swag Labs', async ({ page }) => {
  await expect(page.getByText(expectedText.swagLabs)).toBeVisible();
  await expect(productPage.pageTitle).toHaveText(title.productsPage);
});

test('Check if all the products are listed', async ({ page }) => {
  await expect(productPage.item).toHaveCount(expectedText.totalProductsListed);
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
  productPage.sortData(products.sortingOption.ZToA);
  const namesZA = await productNames.allTextContents();
  const sortedZA = [...namesZA].sort().reverse();
  expect(namesZA).toEqual(sortedZA)

  //Sort by Name: A to Z
  productPage.sortData(products.sortingOption.AToZ);
  const namesAZ = await productNames.allTextContents();
  const sortedAZ = [...namesAZ].sort();
  expect(namesAZ).toEqual(sortedAZ)
});

test('Verify product can be sorted using Price', async ({ page }) => {
  const productPrices = productPage.itemPrice
  //Sort by Name: price high to low
  productPage.sortData(products.sortingOption.HighToLow);
  const priceHighToLow = await productPrices.allTextContents();
  const priceHighToLowParsed = priceHighToLow.map(p => parseFloat(p.replace('$', '')))
  const sortedHighToLow = [...priceHighToLowParsed].sort((a, b) => b - a);
  expect(priceHighToLowParsed).toEqual(sortedHighToLow)

  //Sort by Name: price low to high
  productPage.sortData(products.sortingOption.LowToHigh);
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
  await expect(productPage.cartBadge).toHaveText(expectedText.itemsAddedToCart);
  await productPage.cartButton.click();
  await expect(productPage.pageTitle).toHaveText(title.cartPage);
  await expect(itemCheckoutPage.getItemNameFromCartList(productIds.item0)).toHaveText(products.productName.bikeLight);
  await expect(itemCheckoutPage.getItemNameFromCartList(productIds.item4)).toHaveText(products.productName.backpack);
  await itemCheckoutPage.removeBikeLightFromCart.click();
  await expect(itemCheckoutPage.getItemNameFromCartList(productIds.item0)).not.toBeVisible();
});

test('Check if user can order the Item', async ({ page }) => {
  await itemCheckoutPage.addBackpackToCart.click();
  await productPage.cartButton.click();
  await itemCheckoutPage.buttonAction(buttonAction.checkout);
  await expect(productPage.pageTitle).toHaveText(title.userDetailsPage);
  await itemCheckoutPage.enterUserDetails(productIds.firstName,userDetails.firstName);
  await itemCheckoutPage.enterUserDetails(productIds.lastName,userDetails.lastName);
  await itemCheckoutPage.enterUserDetails(productIds.postalCode,userDetails.postalCode);
  await itemCheckoutPage.buttonAction(buttonAction.continue);
  await expect(productPage.pageTitle).toHaveText(title.billDetailsPage);
  await expect(itemCheckoutPage.subtotal).toHaveText(expectedText.itemPrice);
  await expect(itemCheckoutPage.taxImplicable).toHaveText(expectedText.taxApplied);
  await expect(itemCheckoutPage.totalPrice).toHaveText(expectedText.totalPrice);
  await itemCheckoutPage.buttonAction(buttonAction.finish);
  await expect(productPage.pageTitle).toHaveText(title.orderCompletePage);
  await expect(itemCheckoutPage.orderCompletionHeader).toHaveText(expectedText.completionHeader);
  await expect(itemCheckoutPage.orderCompletionDesc).toHaveText(expectedText.completionDesc);
  await itemCheckoutPage.buttonAction(buttonAction.backToHomePage);
  await expect(productPage.pageTitle).toHaveText(title.productsPage);
});
