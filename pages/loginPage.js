const selectors = require('../selectors/loginPage.selectors');

class LoginPage {
    constructor(page) {
        this.page = page;
        this.selectors = selectors;
    }

    async goto() {
        await this.page.goto('/');
    }

    async login(username, password) {
        await this.page.fill(this.selectors.usernameInput, username);
        await this.page.fill(this.selectors.passwordInput, password);
        await this.page.click(this.selectors.loginButton);
    }

    async getErrorMessage() {
        return await this.page.textContent(this.selectors.loginPageError);
    }
}

module.exports = { LoginPage };