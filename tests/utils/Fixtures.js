
const base = require("@playwright/test");
const { APiUtils } = require('./APiUtils');
const { request } = require('@playwright/test');

const loginPayLoad = {
    userEmail: "kartikahalawat01@gmail.com",
    userPassword: "Kartik01*"
};

const orderPayLoad = {
    orders: [
        {
            country: "India",
            productOrderedId: "6960eac0c941646b7a8b3e68"
        }
    ]
};

let response;
let apiContext;

exports.customtest = base.test.extend({

    authenticatedPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto("https://rahulshettyacademy.com/client/");
        await page.locator("#userEmail").fill("kartikahalawat01@gmail.com");
        await page.locator("#userPassword").fill("Kartik01*");
        await page.locator("[value='Login']").click();

        // Wait for authenticated application content before handing the page to the test.
        // This keeps login setup inside the fixture instead of repeating it in every test.
        await page.locator(".card-body b").first().waitFor();

        await use(page);

        // Dispose of the isolated browser context after the test finishes to prevent resource leaks.
        await context.close();
    },

    createOrder: async ({}, use) => {
        apiContext = await request.newContext();

        const apiUtils = new APiUtils(apiContext, loginPayLoad);

        // Create the order through the API and expose its response to the test.
        // This separates test-data setup from UI validation and provides the generated order ID.
        response = await apiUtils.createOrder(orderPayLoad);

        await use(response);

        // Release the API request context after the fixture's consumers finish.
        await apiContext.dispose();
    },

    // Keep reusable test data in a fixture so tests can access it without duplicating values.
    testDataForOrder: {
        productName: 'ADIDAS ORIGINAL'
    }
});
