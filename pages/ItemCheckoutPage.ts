import { Page } from "@playwright/test";

export class ItemCheckoutPage {
    readonly page: Page;
    readonly addBackpackToCart;
    readonly addBikeLightToCart;
    readonly removeBackpackFromCart;
    readonly removeBikeLightFromCart;
    readonly listOfItemsInCart;
    readonly subtotal;
    readonly taxImplicable;
    readonly totalPrice;
    readonly orderCompletionHeader;
    readonly orderCompletionDesc;

    constructor(page: Page) {
        this.page = page;
        this.addBackpackToCart = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.addBikeLightToCart = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
        this.removeBackpackFromCart = page.locator('[data-test="remove-sauce-labs-backpack"]');
        this.removeBikeLightFromCart = page.locator('[data-test="remove-sauce-labs-bike-light"]');
        this.listOfItemsInCart = page.locator('[data-test="cart-list"]');
        this.subtotal = page.locator('[data-test="subtotal-label"]');
        this.taxImplicable = page.locator('[data-test="tax-label"]');
        this.totalPrice = page.locator('[data-test="total-label"]');
        this.orderCompletionHeader = page.locator('[data-test="complete-header"]');
        this.orderCompletionDesc = page.locator('[data-test="complete-text"]');
    }

    getItemNameFromCartList(itemPosition: string) {
        return this.listOfItemsInCart.locator(itemPosition).locator('[data-test="inventory-item-name"]')
    }

    async enterUserDetails(dataID: string, userDatas: string) {
        await this.page.locator(`[data-test="${dataID}"]`).fill(userDatas);
    }

    async buttonAction(action: string){
        await this.page.locator(`[name="${action}"]`).click();
    }
}