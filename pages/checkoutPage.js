const selectors = require('../selectors/checkoutPage.selectors');

class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.selectors = selectors;
    }

    async fillCheckoutInformation(firstName, lastName, postalCode) {
        await this.page.fill(this.selectors.firstNameInput, firstName);
        await this.page.fill(this.selectors.lastNameInput, lastName);
        await this.page.fill(this.selectors.postalCodeInput, postalCode);
    }

    async submitCheckoutInformation() {
        await this.page.click(this.selectors.continueButton);
    }

    async finishCheckout() {
        await this.page.click(this.selectors.finishButton);
    }

    async cancelCheckout() {
        await this.page.click(this.selectors.cancelButton);
    }

    async getErrorMessage() {
        return await this.page.textContent(this.selectors.errorMessage);
    }

    async getCheckoutCompleteHeader() {
        return await this.page.textContent(this.selectors.checkoutCompleteHeader);
    }

    async getItemPrices() {
        return await this.page.$$eval(this.selectors.itemPrices, prices => prices.map(price => 
            parseFloat(price.textContent.replace('$', ''))));
    }

    async getTax() {
        const taxText = await this.page.textContent(this.selectors.taxText);
        return parseFloat(await taxText.replace('Tax: $', ''));
    }

    async getTotal() {
        const totalText = await this.page.textContent(this.selectors.totalText);
        return parseFloat(await totalText.replace('Total: $', ''));
    }
}

module.exports = { CheckoutPage };
