
const { test, expect, request } = require('@playwright/test');
const { customtest } = require("../utils/Fixtures.js");

customtest("Fixtures custom", async ({ authenticatedPage, createOrder, testDataForOrder }) => {
    // Verify that an order created through the API is available in the user's order history.
    // The custom fixtures handle authentication and order creation before the test runs.
    await authenticatedPage.goto("https://rahulshettyacademy.com/client/");

    await authenticatedPage.locator("button[routerlink*='myorders']").click();
    await authenticatedPage.locator("tbody").first().waitFor();

    // Use the order ID returned by the API fixture to validate the UI, avoiding dependence on a hardcoded ID.
    await expect(authenticatedPage.getByText(createOrder.orderId)).toBeVisible();

    console.log(testDataForOrder.productName);
});
