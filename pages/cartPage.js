const selectors = require('../selectors/cartPage.selectors');

class CartPage {
    constructor(page) {
        this.page = page;
        this.selectors = selectors;
    }

    async getCartItems() {
        return await this.page.$$eval(this.selectors.cartItemName, items => items.map(item => item.textContent));
    }

    async removeItemByIndex(index) {
        const removeButtons = await this.page.$$(this.selectors.removeButton);
        await removeButtons[index].click();
    }

    async continueShopping() {
        await this.page.click(this.selectors.continueShoppingButton);
    }

    async proceedToCheckout() {
        await this.page.click(this.selectors.checkoutButton);
    }

    async getCartItemCount() {
        return await this.page.$(this.selectors.cartBadge);
    }

    async getErrorMessage() {
        return await this.page.$(this.selectors.errorMsg);
    }
}

module.exports = { CartPage };
