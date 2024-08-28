const selectors = require('../selectors/checkoutCompletePage.selectors');

class CheckoutCompletePage {
    constructor(page) {
        this.page = page;
        this.selectors = selectors;
    }

    async goBackToHome() {
        await this.page.click(this.selectors.backHomeButton);
    }
}

module.exports = { CheckoutCompletePage };
