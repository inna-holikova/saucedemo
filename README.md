# Project Structure
```
├── tests/                                 # Directory containing test scripts
│   ├── login.test.js                      # Tests for user authentication
│   ├── products.test.js                   # Tests for product page functionalities
│   ├── cart.test.js                       # Tests for cart operations
│   ├── checkout.test.js                   # Tests for checkout processes
│   ├── checkoutComplete.test.js           # Tests for completing checkout
│   ├── burgerMenuPage.test.js             # Tests for burger menu
│   ├── item.test.js                       # Tests for item page
├── pages/                                 # Page Object Model (POM) classes
│   ├── burgerMenuPage.js                  # Page class for burger menu
│   ├── productsPage.js                    # Page class for the products page
│   ├── cartPage.js                        # Page class for the cart page
│   ├── checkoutPage.js                    # Page class for the checkout page
│   ├── checkoutCompletePage.js            # Page class for the checkout complete page
│   ├── itemPage.js                        # Page class for the item page
│   ├── loginPage.js                       # Page class for the login page
├── playwright-report/                     # Directory for Playwright reports
├── test-results/                          # Directory for test result outputs
├── selectors/                             # Directory containing selectors
│   ├── burgerMenuPage.selectors.js        # Selectors for burger menu
│   ├── productsPage.selectors.js          # Selectors for the products page
│   ├── cartPage.selectors.js              # Selectors for the cart page
│   ├── checkoutPage.selectors.js          # Selectors for the checkout page
│   ├── checkoutCompletePage.selectors.js  # Selectors for the checkout complete page
│   ├── itemPage.selectors.js              # Selectors for the item page
│   ├── loginPage.selectors.js             # Selectors for the login page
├── .gitignore                             # Git ignore file
├── package-lock.json                      # Lockfile for npm dependencies
├── playwright.config.js                   # Playwright configuration file
├── package.json                           # Node.js dependencies and scripts
├── README.md                              # Project documentation
├── secret.config.js                       # Credentials configuration file
├── testData.config.js                     # Test data configuration file
├── urls.js                                # URLs configuration file

```

# Prerequisites
Before you begin, ensure you have met the following requirements:
- **Node.js** (v12.0.0 or later)
- **npm** or **yarn** (for managing dependencies)

# Installation
### 1. Clone the repository:
```
git clone https://github.com/inna-holikova/saucedemo.git
cd saucedemo
```

### 2. Install dependencies:
`npm install`
or if you prefer using Yarn:
`yarn install`

### 3. Install Playwright browsers:
`npx playwright install`

# Running Tests
To run all tests using the default browser (Chromium):
`npx playwright test`

To run tests in a specific browser (e.g., Firefox):
`npx playwright test --project=firefox`

To run a specific test file:
`npx playwright test tests/products.test.js`

# Test Scenarios
The tests cover the following scenarios:

- **Authentication:** Logging in with various user types and verifying login functionality.
- **Product Page:** Sorting products by price, adding items to the cart, and verifying product details.
- **Cart Operations:** Adding/removing items, checking the cart badge, and validating cart contents.
- **Checkout Process:** Filling out checkout forms, verifying the total cost, and ensuring an empty cart checkout is blocked.
- **Burger Menu:** Testing the functionality of the burger menu options like logout.
- **Item Page:** Verifying item details, navigating between items, and adding items to the cart from the item page.

# Page Object Model (POM)
This project uses the Page Object Model (POM) pattern to improve code maintainability and reusability. Each page in the application has a corresponding class that contains methods to interact with the elements on that page.

Example of a page class (**checkoutCompletePage.js**):

```
// checkoutCompletePage.js
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
```
# Selectors

The **selectors/** directory contains separate files for each page's selectors. This organization helps keep the code clean and makes it easier to update selectors if the application changes.
Example selector file (**loginPage.selectors.js**):

```
module.exports = {
    usernameInput: '#user-name',
    passwordInput: '#password',
    loginButton: '#login-button',
    loginPageError: '[data-test="error"]'
}
```

# Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch: **git checkout -b feature-branch-name**.
3. Make your changes and commit them: **git commit -m 'Add some feature'**.
4. Push to the branch: **git push origin feature-branch-name**.
5. Submit a pull request.



