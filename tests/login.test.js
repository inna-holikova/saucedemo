const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/loginPage');
const { ProductsPage } = require('../pages/productsPage');

const { users } = require('../testData.config');
const { password } = require('../secret.config');
const { inventoryLink } = require('../urls');

test.describe('SauceDemo Login Tests', () => {
    let loginPage;
    let productsPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        productsPage = new ProductsPage(page);
        await loginPage.goto();
    });

    users.forEach(user => {
        test(`Login test for ${user.description}`, async ({ page }) => {
            await loginPage.login(user.username, password);

            if (user.shouldLogin) {
                // Verify successful login by checking if we navigated to the products page
                await expect(page).toHaveURL(inventoryLink);
                // Verify that the product page elements are visible
                const productTitles = await productsPage.getProductTitles();
                expect(productTitles.length).toBeGreaterThan(0); // Assuming products are visible
            } else {
                // Verify unsuccessful login by checking if an error message is displayed
                const errorMessage = await loginPage.getErrorMessage();
                expect(errorMessage).toContain('Epic sadface'); // Expected error message for failed login
            }
        });
    });
});
