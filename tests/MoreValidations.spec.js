import{test, expect} from '@playwright/test';

//test.describe.configure({mode: 'parallel'});
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

test("Screenshot & Visual Comparison", async({page})=>{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#displayed-text").screenshot({path : 'screenshot2.png'});
    await page.locator("#hide-textbox").click();
    await page.screenshot({path : 'screenshot.png'});
    await expect(page.locator("#displayed-text")).toBeHidden();
});

test.skip('visual testing', async({page})=>{
    await page.goto("https://flightware.com/");
    await page.screenshot({path :'flight.png'});

    expect(await page.screenshot()).toMatchSnapshot('flight.png');
});