const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ProductsPage } = require('../pages/productsPage');
const { CartPage } = require('../pages/cartPage');
const { CheckoutPage } = require('../pages/checkoutPage');
const { CheckoutCompletePage } = require('../pages/checkoutCompletePage');

const { password } = require('../secret.config');
const { inventoryLink, checkoutSt2Link, checkoutCompleteLink } = require('../urls');
const { firstName, lastName, postalCode } = require('../testData.config');

test.describe('SauceDemo Checkout Complete Page Tests', () => {
    let loginPage;
    let productsPage;
    let cartPage;
    let checkoutPage;
    let checkoutCompletePage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);
        checkoutCompletePage = new CheckoutCompletePage(page);

        // Log in as a standard user
        await loginPage.goto();
        await loginPage.login('standard_user', password);
        await expect(page).toHaveURL(inventoryLink);

        // Add an item to the cart and go to checkout step one
        await productsPage.addToCartByIndex(0);
        await productsPage.goToCart();
        await cartPage.proceedToCheckout();

        // Fill in valid checkout information
        await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);
        await checkoutPage.submitCheckoutInformation();

        // Verify that we are on the checkout overview page
        await expect(page).toHaveURL(checkoutSt2Link);

        // Finish the checkout
        await checkoutPage.finishCheckout();

        // Verify that we are on the checkout complete page
        await expect(page).toHaveURL(checkoutCompleteLink);
    });

    test('Check the goBackHome button', async ({ page }) => {
        await checkoutCompletePage.goBackToHome();
        await expect(page).toHaveURL(inventoryLink);

        // Check if products are loaded
        const productTitles = await productsPage.getProductTitles();
        expect(productTitles.length).toBeGreaterThan(0); 

        // Verify that the cart is empty
        const cartBadge = await cartPage.getCartItemCount();
        expect(cartBadge).toBeNull();
    });
});