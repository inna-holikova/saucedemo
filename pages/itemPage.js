const selectors = require('../selectors/itemPage.selectors');

class ItemPage {
    constructor(page) {
        this.page = page;
        this.selectors = selectors;
    }

    async clickItemImage() {
        const itemImgs = await this.page.$$(this.selectors.itemImages);
        await itemImgs[0].click();
    }

    async getItemTitle() {
        return await this.page.textContent(this.selectors.itemTitle);
    }

    async addItemToCart() {
        await this.page.click(this.selectors.btnAdd);
        await this.page.waitForSelector(this.selectors.btnRemove);
        const btnRemoveText = await this.page.textContent(this.selectors.btnRemove);
        return btnRemoveText;
    }

    async backToInventoryPage() {
        await this.page.click(this.selectors.btnBack);
    }
}

module.exports = { ItemPage };
