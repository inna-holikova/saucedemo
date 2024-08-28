const { cartLink } = require('../urls');

const selectors = require('../selectors/productsPage.selectors');

class ProductsPage {
    constructor(page) {
        this.page = page;
        this.selectors = selectors;
    }

    async getProductTitles() {
        return await this.page.$$eval(this.selectors.productTitles, 
            elements => elements.map(item => item.textContent));
    }

    async getProductPrices() {
        // Retrieve all elements matching the price selector
        const prices = await this.page.$$eval(this.selectors.productPricesSelector, prices =>
            prices.map(price => parseFloat(price.textContent.replace('$', '')))
        );
        return prices;
    }

    async sortProducts(option) {
        await this.page.selectOption(this.selectors.sortDropdown, option);
    }

    async addToCartByIndex(index) {
        const addToCartButtons = await this.page.$$(this.selectors.addToCartButton);
        await addToCartButtons[index].click();
    }

    async getCartItemCount() {
        const badge = await this.page.locator(this.selectors.cartBadge);
        return parseInt(await badge.textContent());
    }

    async checkAddToCartButton(index) {
        const addToCartButtons = await this.page.$$(this.selectors.addToCartButton);
        const firstBtn = addToCartButtons[index];
        return await firstBtn.textContent();
    }

    async goToCart() {
        await this.page.click(this.selectors.cartButton);
        // Optionally, we can wait for the cart page to load to ensure navigation was successful
        await this.page.waitForURL(cartLink);
    }
}

module.exports = { ProductsPage };
