import{test, expect} from '@playwright/test';

test("Popup Validations", async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    // await page.goto("http://google.com");
    // await page.goBack();
    // await page.goForward();

    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    //await page.pause();
    page.on("dialog", dialog => dialog.accept());      //will accept whenever a dialog appears
    await page.locator("#confirmbtn").click();

    await page.locator("#mousehover").hover();

    const framesPage = page.frameLocator("#courses-iframe");
    framesPage.locator("li a[href*='lifetime-access']:visible").click();
    const textCheck = await framesPage.locator(".text h2").textContent();
    console.log(textCheck.split(" ")[1]);

});