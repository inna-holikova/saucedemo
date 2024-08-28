const selectors = require('../selectors/burgerMenuPage.selectors');

class BurgerMenuPage {
    constructor(page) {
        this.page = page;
        this.selectors = selectors;
    }

    async openMenu() {
        await this.page.click(this.selectors.burgerButton);
        await this.page.waitForSelector(this.selectors.menuItems, { state: 'visible' });
    }

    async closeMenu() {
        await this.page.click(this.selectors.closeButton);
        await this.page.waitForSelector(this.selectors.menuItems, { state: 'hidden' });
    }

    async isMenuHidden() {
        const isHidden = await this.page.isHidden(this.selectors.menuItems);
        return isHidden;
    }

    async navigateToInventory() {
        await this.page.click(this.selectors.inventoryLink);
    }

    async navigateToAbout() {
        await this.page.click(this.selectors.aboutLink);
    }

    async logout() {
        await this.page.click(this.selectors.logoutLink);
    }

    async resetAppState() {
        await this.page.click(this.selectors.resetLink);
    }

    async getMenuItems() {
        return this.page.$$eval(this.selectors.menuItems, 
            items => items.map(item => item.textContent.trim()));
    }
}

module.exports = { BurgerMenuPage };