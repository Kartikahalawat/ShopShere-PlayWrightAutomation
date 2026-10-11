
import { test, expect } from '@playwright/test';

test('Browser Context Playwright test', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Intercept matching image requests and abort them before they load.
    // Only JPG, PNG, and JPEG requests matching this pattern are blocked.
    page.route('**/*.{jpg,png,jpeg}', route => route.abort());

    // 'request' fires when a network request is issued.
    // Use request.url() to inspect the requested resource or API endpoint.
    page.on('request', request => {
        console.log('Request URL:', request.url());
    });

    // 'response' fires when response headers arrive from the server.
    // Use response.status() to inspect the HTTP status code.
    // Aborted requests do not receive a normal HTTP response.
    page.on('response', response => {
        console.log('Response URL:', response.url());
        console.log('Status Code:', response.status());
    });

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    console.log(await page.title());

    const userName = page.locator('#username');
    const userPass = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn');
    const cardTitles = page.locator('.card-body a');

    await userName.fill('KartikAhalawat');
    await userPass.fill('Learning@830$3mK2');
    await signIn.click();

    const errorMessage = page.locator("[style*='block']");
    await expect(errorMessage).toContainText('Incorrect');

    await userName.fill('rahulshettyacademy');
    await signIn.click();

    console.log(await cardTitles.nth(0).textContent());
    console.log(await cardTitles.last().textContent());

    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
});
