const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('./utils/APiUtils');

// Credentials used by APiUtils to authenticate through the API.
// This avoids performing the login through the UI before creating an order.
const loginPayLoad = {
    userEmail: "kartikahalawat01@gmail.com",
    userPassword: "Kartik01*"
};

// Order details passed to the create-order API.
// The product ID must correspond to a valid product in the application.
const orderPayLoad = {
    orders: [
        {
            country: "India",
            productOrderedId: "6960eac0c941646b7a8b3e68"
        }
    ]
};

// Mock response returned to the frontend when the orders API is intercepted.
// This lets us verify how the UI behaves when the backend reports no orders.
const fakePayLoadOrders = {
    data: [],
    message: "No Orders"
};

let response;
let apiContext;

test.beforeAll(async () => {
    // Create a standalone API context to send HTTP requests without using a browser page.
    apiContext = await request.newContext();

    // Reuse the API utility to authenticate and create an order before the UI test begins.
    // The returned response contains the token used to authenticate the browser session.
    const apiUtils = new APiUtils(apiContext, loginPayLoad);
    response = await apiUtils.createOrder(orderPayLoad);
});

test.beforeEach(() => {
    // Add per-test setup here if required.
});

test('Place the order', async ({ page }) => {

    // Inject the API-generated token into localStorage before application JavaScript executes.
    // This simulates an authenticated session without navigating through the login screen.
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client/");

    // INTERCEPTING THE ORDERS API:
    // 1. The frontend sends a request to the real orders endpoint.
    // 2. route.fetch() forwards that request to the actual backend.
    // 3. We replace the real response body with our mocked empty-orders payload.
    // 4. route.fulfill() sends the modified response back to the browser.
    //
    // Note: The backend is still called here; this is response modification,
    // not a fully mocked request.
    await page.route(
        "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {

            // Fetch the original server response so its status and headers can be reused.
            const response = await route.fetch();

            // Convert the JavaScript object into a JSON string because the response body
            // must be sent as serialized JSON.
            const body = JSON.stringify(fakePayLoadOrders);

            // Return the original response metadata with the mocked response body.
            // The frontend receives an empty order list instead of the actual orders.
            await route.fulfill({
                response,
                body
            });
        }
    );

    // Open My Orders. The page should request the orders API, triggering the route handler.
    await page.locator("button[routerlink*='myorders']").click();

    // Wait until the orders API response is received before inspecting the rendered UI.
    // This helps avoid reading the page before the orders request has completed.
    await page.waitForResponse(
        "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"
    );

    // Inspect the relevant UI text to observe how the application handles the mocked response.
    console.log(await page.locator(".mt-4").textContent());
});