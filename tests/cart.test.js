const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ProductsPage } = require('../pages/productsPage');
const { CartPage } = require('../pages/cartPage');
const { BurgerMenuPage } = require('../pages/burgerMenuPage');

const { password } = require('../secret.config');
const { inventoryLink, checkoutSt1Link, cartLink } = require('../urls');

test.describe('SauceDemo Cart Page Tests', () => {
    let loginPage;
    let productsPage;
    let cartPage;
    let burgerMenuPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        cartPage = new CartPage(page);
        burgerMenuPage = new BurgerMenuPage(page);

        // Log in as a standard user
        await loginPage.goto();
        await loginPage.login('standard_user', password);
        await expect(page).toHaveURL(inventoryLink);
    });

    test('Verify items are added to the cart', async ({ page }) => {
        // Add items to the cart
        await productsPage.addToCartByIndex(0);
        await productsPage.addToCartByIndex(1);

        // Go to cart page
        await productsPage.goToCart();  
        const cartItems = await cartPage.getCartItems();  

        // Verify that the correct items are in the cart
        expect(cartItems.length).toBe(2);  
    });

    test('Remove an item from the cart', async ({ page }) => {
        // Add items to the cart
        await productsPage.addToCartByIndex(0);
        await productsPage.addToCartByIndex(1);

        // Go to cart page
        await productsPage.goToCart();

        // Remove the first item
        await cartPage.removeItemByIndex(0);
        const cartItems = await cartPage.getCartItems();

        // Verify that only one item remains in the cart
        expect(cartItems.length).toBe(1);
    });

    test('Proceed to checkout from cart', async ({ page }) => {
        // Add an item to the cart
        await productsPage.addToCartByIndex(0);

        // Go to cart page
        await productsPage.goToCart();

        // Proceed to checkout
        await cartPage.proceedToCheckout();

        // Verify that the URL is the checkout page
        await expect(page).toHaveURL(checkoutSt1Link);
    });

    test('Verify that checkout with an empty cart is not possible', async ({ page }) => {
        // Go to the cart page directly (without adding any items)
        await productsPage.goToCart();
    
        // Verify that the cart is empty
        const cartBadge = await cartPage.getCartItemCount();
        expect(cartBadge).toBeNull();
 
        // Attempt to proceed to checkout
        await cartPage.proceedToCheckout();
    
        // Verify that the user is still on the cart page or a message is displayed
        // depending on the application behavior (You may need to update this part based on actual behavior)
        await expect(page).toHaveURL(cartLink);
    
        // Optionally, check for any error message displayed
        const errorMessage = await cartPage.getErrorMessage();
        if (errorMessage) {
            const errorText = await errorMessage.textContent();
            expect(errorText).toContain('Your cart is empty');
        } else {
            //Ensure the user is not redirected to the checkout process
            await expect(page).not.toHaveURL(checkoutSt1Link);
        }
    });

    test('Verify cart count is updated after removing an item', async ({ page }) => {
        // Add items to the cart
        await productsPage.addToCartByIndex(0);
        await productsPage.addToCartByIndex(1);

        // Go to cart page
        await productsPage.goToCart();

        // Remove the first item
        await cartPage.removeItemByIndex(0);
        
        // Verify cart badge reflects correct item count
        const itemCount = await productsPage.getCartItemCount();
        expect(itemCount).toBe(1);
    });

    test('Continue shopping from the cart', async ({ page }) => {
        // Add the first item to the cart
        await productsPage.addToCartByIndex(0);

        // Go to cart page
        await productsPage.goToCart();

        // Continue shopping
        await cartPage.continueShopping();

        // Verify that the URL is the products page
        await expect(page).toHaveURL(inventoryLink);
    });

    test('Verify that cart is empty after logging in with a different user', async ({ page }) => {
        // Add an item to the cart
        await productsPage.addToCartByIndex(0);
    
        // Verify that the cart has 1 item
        let cartBadge = await cartPage.getCartItemCount();
        expect(cartBadge).not.toBeNull();
        expect(await cartBadge.textContent()).toBe('1');
    
        // Log out using the burger menu
        await burgerMenuPage.openMenu();
        await burgerMenuPage.logout(); 
        
        // Log in with a different user
        await loginPage.login('problem_user', password);
        await expect(page).toHaveURL(inventoryLink);
    
        // Verify that the cart is empty (i.e., no cart badge)
        cartBadge = await cartPage.getCartItemCount();
        expect(cartBadge).toBeNull();
    });
});
