const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('./utils/APiUtils');

// Credentials used by the API login request.
// The API returns an authentication token after successful login.
const loginPayLoad = {
    userEmail: "kartikahalawat01@gmail.com",
    userPassword: "Kartik01*"
};

// Request body used to create an order through the API.
// The productOrderedId identifies the product to be ordered.
const orderPayLoad = {
    orders: [
        {
            country: "India",
            productOrderedId: "6960eac0c941646b7a8b3e68"
        }
    ]
};

// Shared variables used to store the API context and API response.
// The response contains both the authentication token and the created order ID.
let response;
let apiContext;

// beforeAll runs once before the tests in this file.
// We create the order through the API instead of using the UI,
// saving time and keeping the UI test focused on order verification.
test.beforeAll(async () => {

    // Create an API request context to send HTTP requests.
    apiContext = await request.newContext();

    // Initialize the utility class responsible for login and order creation.
    const apiUtils = new APiUtils(apiContext, loginPayLoad);

    // Create the order and wait for the API operation to complete.
    // The returned object contains response.token and response.orderId.
    response = await apiUtils.createOrder(orderPayLoad);

});

test.beforeEach(() => {
    // This hook runs before each test.
    // Add test-specific setup here if required in the future.
});

// Verify that the order created through the API appears in the UI order history.
test('Place the order', async ({ page }) => {

    // Inject the authentication token into localStorage before page scripts run.
    // This allows the browser to access the authenticated session without
    // manually entering credentials and submitting the login form.
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    // Open the application. The token has already been registered for injection.
    await page.goto("https://rahulshettyacademy.com/client/");

    // Navigate to the My Orders page to view the user's order history.
    await page.locator("button[routerlink*='myorders']").click();

    // Wait until the order history table is available in the page.
    await page.locator("tbody").first().waitFor();

    // Locate all order rows displayed in the order history table.
    const rows = page.locator("tbody tr");

    // Iterate through the rows to find the order created by the API.
    for (let i = 0; i < await rows.count(); i++) {

        // Read the order ID displayed in the current row's table header cell.
        const rowOrderId = await rows.nth(i).locator("th").textContent();

        // Compare the UI order ID with the order ID returned by the API.
        // includes() checks whether one string contains the other.
        if (response.orderId.includes(rowOrderId)) {

            // Open the matching order's details page by clicking its first button.
            await rows.nth(i).locator("button").first().click();

            // Stop searching once the matching order has been found.
            break;
        }
    }

    // Read the order ID displayed on the order details page.
    const orderIdDetails = await page.locator(".col-text").textContent();

    // Assert that the details page displays the order ID created through the API.
    // A successful assertion confirms that the expected order details were opened.
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

});

