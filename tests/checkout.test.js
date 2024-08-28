const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ProductsPage } = require('../pages/productsPage');
const { CartPage } = require('../pages/cartPage');
const { CheckoutPage } = require('../pages/checkoutPage');

const { password } = require('../secret.config');
const { inventoryLink, checkoutSt2Link, checkoutCompleteLink } = require('../urls');
const { firstName, lastName, postalCode } = require('../testData.config');

test.describe('SauceDemo Checkout Page Tests', () => {
    let loginPage;
    let productsPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        // Log in as a standard user
        await loginPage.goto();
        await loginPage.login('standard_user', password);
        await expect(page).toHaveURL(inventoryLink);

        // Add an item to the cart and go to checkout step one
        await productsPage.addToCartByIndex(0);
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();
    });

    test('Verify error when checkout information is missing', async ({ page }) => {
        // Submit the checkout form without filling in the details
        await checkoutPage.submitCheckoutInformation();

        // Verify that an error message is displayed
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage).toContain('Error: First Name is required');
    });

    test('Complete checkout with valid information', async ({ page }) => {
        // Fill in valid checkout information
        await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);
        await checkoutPage.submitCheckoutInformation();

        // Verify that we are on the checkout overview page
        await expect(page).toHaveURL(checkoutSt2Link);

        // Finish the checkout
        await checkoutPage.finishCheckout();

        // Verify that we are on the checkout complete page
        await expect(page).toHaveURL(checkoutCompleteLink);

        // Verify the checkout completion header
        const completeHeader = await checkoutPage.getCheckoutCompleteHeader();
        expect(completeHeader).toContain('Thank you for your order!');
    });

    test('Verify error when postal code is missing', async ({ page }) => {
        // Fill in checkout information without the postal code
        await checkoutPage.fillCheckoutInformation(firstName, lastName, '');
        await checkoutPage.submitCheckoutInformation();

        // Verify that an error message is displayed
        const errorMessage = await checkoutPage.getErrorMessage();
        expect(errorMessage).toContain('Error: Postal Code is required');
    });

    test('Verify that checkout flow can be canceled', async ({ page }) => {
        // Fill in valid checkout information
        await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);
        await checkoutPage.submitCheckoutInformation();

        // Verify that we are on the checkout overview page
        await expect(page).toHaveURL(checkoutSt2Link);

        // Cancel the checkout and return to the inventory page
        await checkoutPage.cancelCheckout();

        // Verify that we are back on the inventory page
        await expect(page).toHaveURL(inventoryLink);
    });

    test('Verify that checkout summary information is correct', async ({ page }) => {
        // Fill in valid checkout information
        await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);
        await checkoutPage.submitCheckoutInformation();

        // Verify that we are on the checkout overview page
        await expect(page).toHaveURL(checkoutSt2Link);

        // Verify that the items, prices, and total match what was added to the cart
        const itemPrices = await checkoutPage.getItemPrices();
        
        // Calculate the expected subtotal
         const subtotal = itemPrices.reduce((sum, price) => sum + price, 0);

        // Get the tax amount from the page
        const tax = await checkoutPage.getTax();

        // Calculate the expected total (subtotal + tax)
        const expectedTotal = (subtotal + tax).toFixed(2);

        // Get the total amount displayed on the page
        const total = await checkoutPage.getTotal();

        // Assert that the displayed total matches the expected total
        expect(total).toBe(parseFloat(expectedTotal));
    });
});
