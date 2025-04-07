import { Locator, Page } from "@playwright/test";

export class ProductPage {
    readonly page: Page;
    readonly item;
    readonly itemName;
    readonly itemDescription;
    readonly itemPrice;
    readonly pageTitle;
    readonly cartBadge;
    readonly cartButton;


    constructor(page: Page) {
        this.page = page;
        this.pageTitle = page.locator('[data-test="title"]');
        this.item = page.locator('.inventory_item');
        this.itemName = page.locator('.inventory_details').locator('[data-test="inventory-item-name"]');
        this.itemDescription = page.locator('.inventory_details').locator('[data-test="inventory-item-desc"]');
        this.itemPrice = page.locator('.inventory_details').locator('[data-test="inventory-item-price"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartButton = page.locator('[data-test="shopping-cart-link"]');

    }

    getItemName(index: number) {
        return this.item.nth(index).locator('[data-test="inventory-item-name"]');
    }
    getItemDescription(index: number) {
        return this.item.nth(index).locator('[data-test="inventory-item-desc"]');
    }
    getItemPrice(index: number) {
        return this.item.nth(index).locator('[data-test="inventory-item-price"]');
    }
    async sortData(option: string) {
        await this.page.selectOption('[data-test="product-sort-container"]', option);
    }


}

