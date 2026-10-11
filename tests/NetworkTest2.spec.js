const { test, expect, request } = require("@playwright/test");

test("Security test request intercept", async ({ page }) => {

  // Product and user details used during the UI flow.
  const productName = "Zara Coat 3";
  const email = "kartikahalawat01@gmail.com";

  // Step 1: Authenticate through the UI.
  // This establishes a normal user session before testing order authorization.
  await page.goto("https://rahulshettyacademy.com/client/");
  await page.locator("#userEmail").fill(email);
  await page.locator("#userPassword").fill("Kartik01*");
  await page.locator("[value='Login']").click();

  // Wait for product cards to appear, indicating that the application has loaded
  // its product data. This is more targeted than waiting for networkidle.
  await page.locator(".card-body b").first().waitFor();

  // Locate product cards. The locator is lazy; it does not retrieve elements
  // until an operation such as count(), first(), or allTextContents() is used.
  const products = await page.locator(".card-body");

  // Step 2: Navigate to My Orders to access the current user's order list.
  await page.locator("button[routerlink*='myorders']").click();

  // Step 3: Intercept the order-details API request.
  // The wildcard matches requests to this endpoint with different order IDs.
  //
  // Instead of sending the original requested URL, continue() changes the URL
  // to a specific order ID. This simulates an attempt to access another order
  // by manipulating a request parameter.
  //
  // Security concept: IDOR / Broken Object-Level Authorization (BOLA).
  // The backend must verify that the authenticated user owns the requested order.
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    (route) =>
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6",
      }),
  );

  // Step 4: Open the first order's details.
  // The application sends its usual request, but the route handler substitutes
  // the order ID before forwarding that request to the backend.
  await page.locator("button:has-text('View')").first().click();

  // Step 5: Verify the authorization control.
  // The expected message indicates that the application denied access to
  // the requested order rather than displaying its details.
  await expect(page.locator("p").last()).toHaveText(
    "You are not authorize to view this order"
  );
});