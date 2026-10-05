import{test, expect} from '@playwright/test';

test('Playwright Special Locators', async ({page})=> {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    
    //5 sec default timeout for expect assertions
    //explicitly setting timeout 10 sec for this assertion
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).isVisible({timeout: 10_000});

    await page.getByRole("link", {name : "Shop"}).click();
    await page.locator("app-card").filter({hasText: "Nokia Edge"}).getByRole("button").click();
});

test('Playwright Test Level timeout', async ({page})=> {

    const slowexpect = expect.configure({timeout : 9000}); //setting expect timeout at TEST Level

    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", {name: 'Submit'}).click();
    await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    
    //5 sec default timeout for expect assertions
    //explicitly setting timeout 10 sec for this assertion
    await expect(page.getByText("Success! The Form has been submitted successfully!.")).toBeVisible({timeout: 10_000});

    await page.getByRole("link", {name : "Shop"}).click();
    await slowexpect(page.locator(".my-4").first()).toHaveText("Shop Name"); //Using TestLevel Timeout

    await page.locator("app-card").filter({hasText: "Nokia Edge"}).getByRole("button").click();
});