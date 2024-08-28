const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ProductsPage } = require('../pages/productsPage');

const { password } = require('../secret.config');
const { inventoryLink } = require('../urls');

test.describe('SauceDemo Products Page Tests', () => {
    let loginPage;
    let productsPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        
        await loginPage.goto();
        await loginPage.login('standard_user', password);
        await expect(page).toHaveURL(inventoryLink);
    });

    test('Verify all products are visible', async ({ page }) => {
        const productTitles = await productsPage.getProductTitles();
        expect(productTitles.length).toBeGreaterThan(0); // Check if products are loaded
    });

    test('Verify product sorting (A to Z)', async ({ page }) => {
        await productsPage.sortProducts('az');
        const productTitles = await productsPage.getProductTitles();
        const sortedTitles = [...productTitles].sort(); // Sort the titles manually
        expect(productTitles).toEqual(sortedTitles); // Compare the sorted titles
    });

    test('Verify product sorting (Z to A)', async ({ page }) => {
        await productsPage.sortProducts('za');
        const productTitles = await productsPage.getProductTitles();
        const sortedTitles = [...productTitles].sort().reverse(); // Sort the titles manually in reverse
        expect(productTitles).toEqual(sortedTitles); // Compare the sorted titles
    });

    test('Verify products can be sorted by price low to high', async ({ page }) => {
        // Sort products by price (low to high)
        await productsPage.sortProducts('Price (low to high)');

        // Get the prices of all the products after sorting
        const prices = await productsPage.getProductPrices();

        // Verify that the prices are sorted in ascending order
        const sortedPrices = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sortedPrices);
    });

    test('Verify products can be sorted by price high to low', async ({ page }) => {
        // Sort products by price (high to low)
        await productsPage.sortProducts('Price (high to low)');

        // Get the prices of all the products after sorting
        const prices = await productsPage.getProductPrices();

        // Verify that the prices are sorted in descending order
        const sortedPrices = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sortedPrices);
    });

    test('Add a product to the cart', async ({ page }) => {
        await productsPage.addToCartByIndex(0);
        const itemCount = await productsPage.getCartItemCount();
        await expect(itemCount).toBe(1); // Check if 1 item is added to the cart
        
        const btnText = await productsPage.checkAddToCartButton(0);
        await expect(btnText).toBe('Remove');
    });

    test('Add multiple products to the cart', async ({ page }) => {
        await productsPage.addToCartByIndex(0);
        await productsPage.addToCartByIndex(1);
        const itemCount = await productsPage.getCartItemCount();
        expect(itemCount).toBe(2); // Check if 2 items are added to the cart

        const btnTextFirst = await productsPage.checkAddToCartButton(0);
        const btnTextSecond = await productsPage.checkAddToCartButton(1);
        await expect(btnTextFirst).toBe('Remove');
        await expect(btnTextSecond).toBe('Remove');
    });
});
