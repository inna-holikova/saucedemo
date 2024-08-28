const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ProductsPage } = require('../pages/productsPage');
const {ItemPage } = require('../pages/itemPage');
const { CartPage } = require('../pages/cartPage');

const { password } = require('../secret.config');
const { inventoryLink } = require('../urls');


test.describe('SauceDemo Item Tests', () => {
    let loginPage;
    let productsPage;
    let itemPage
    let cartPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        itemPage = new ItemPage(page);
        cartPage = new CartPage(page);

        await loginPage.goto();
        await loginPage.login('standard_user', password);
        await expect(page).toHaveURL(inventoryLink);
    });

    test('Verify item page', async ({ page }) => {
        await itemPage.clickItemImage();
        const url = page.url();
        expect(url.includes('inventory-item')).toBe(true);  

        const itemTitle = await itemPage.getItemTitle();

        const btnRemove = await itemPage.addItemToCart();
        expect(btnRemove).toBe('Remove');  

        expect(await productsPage.getCartItemCount()).toBe(1);  

        itemPage.backToInventoryPage();
        await expect(page).toHaveURL(inventoryLink);  

        await productsPage.goToCart();
        const cartItemTitles = await cartPage.getCartItems();
        const cartItemTitle = cartItemTitles[0];
        expect(itemTitle).toBe(cartItemTitle);  
    });
});