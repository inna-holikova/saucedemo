const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ProductsPage } = require('../pages/productsPage');
const { BurgerMenuPage } = require('../pages/burgerMenuPage');
const { CartPage} = require('../pages/cartPage');

const { password } = require('../secret.config');
const { inventoryLink, aboutPageLink } = require('../urls');

test.describe('Burger Menu Tests', () => {
    let loginPage;
    let productsPage;
    let burgerMenuPage;
    let cartPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        burgerMenuPage = new BurgerMenuPage(page);
        cartPage = new CartPage(page);

        // Log in and navigate to the products page
        await loginPage.goto();
        await loginPage.login('standard_user', password);
        await expect(page).toHaveURL(inventoryLink);
    });

    test('Verify burger menu opens and contains expected items', async ({ page }) => {
        // Open the burger menu
        await burgerMenuPage.openMenu();

        // Verify the menu items
        const menuItems = await burgerMenuPage.getMenuItems();
        expect(menuItems).toEqual([
            'All Items',
            'About',
            'Logout',
            'Reset App State'
        ]);

        // Close the menu
        await burgerMenuPage.closeMenu();
    });

    test('Verify navigation to "All Items" page via burger menu', async ({ page }) => {
        // Open the burger menu
        await burgerMenuPage.openMenu();

        // Navigate to the inventory page
        await burgerMenuPage.navigateToInventory();

        // Verify that the user is redirected to the inventory page
        await expect(page).toHaveURL(inventoryLink);
    });

    test('Verify navigation to "About" page via burger menu', async ({ page }) => {
        // Open the burger menu
        await burgerMenuPage.openMenu();

        // Navigate to the about page
        await burgerMenuPage.navigateToAbout();

        // Verify that the user is redirected to the Sauce Labs about page
        await expect(page).toHaveURL(aboutPageLink);
    });

    test('Verify user can log out via burger menu', async ({ page }) => {
        // Open the burger menu
        await burgerMenuPage.openMenu();

        // Log out
        await burgerMenuPage.logout();

        // Verify that the user is redirected to the login page
        await expect(page).toHaveURL('/');
    });

    test('Verify "Reset App State" via burger menu', async ({ page }) => {
        // Add an item to the cart
        await productsPage.addToCartByIndex(0);

        // Open the burger menu and reset app state
        await burgerMenuPage.openMenu();
        await burgerMenuPage.resetAppState();

        // Verify that the cart is empty after resetting app state
        const cartBadge = await cartPage.getCartItemCount();
        expect(cartBadge).toBeNull();
    });
});
