//Login UI -> .json

//test browser -> .json, cart-order, orderdetails, orderhistory

const { test, expect} = require('@playwright/test');
let webContext;

test.beforeAll(async({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/client/");
    await page.locator("#userEmail").fill("kartikahalawat01@gmail.com");
    await page.locator("#userPassword").fill("Kartik01*");
    await page.locator("[value='Login']").click();

    //Waiting till all network calls are made
    //await page.waitForLoadState("networkidle");
    await page.locator(".card-body b").first().waitFor();

    await context.storageState({path: "state.json"});
    webContext = await browser.newContext({storageState: 'state.json'});
});



test('Client App Login', async () => {
    // chrome - plugins/cookies

    const productName = 'Zara Coat 3';
    const email = "kartikahalawat01@gmail.com";

    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client/");
    
    const products = await page.locator(".card-body");
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

    const count = await products.count();
    for (let i = 0; i < count; i++) {
        const title = await products.nth(i).locator("b").textContent();

        if (title?.trim().toLowerCase() === productName.trim().toLowerCase()) {
            await products.nth(i).locator("text='Add To Cart'").click();
            break;
        }
    }
    await page.locator("[routerlink*='cart']").click();
    await page.locator("div li").first().waitFor();
    const bool = page.locator("h3:has-text('ZARA COAT 3')").isVisible();

    expect(bool).toBeTruthy();

    await page.locator("text='Checkout'").click();
    await page.locator("[placeholder='Select Country']").pressSequentially("ind", {delay : 150}); //filling letter by letter with 150ms expected delay
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const optionsCount = await dropdown.locator("button").count();
    for(let i=0; i<optionsCount; i++){
        const text = (await dropdown.locator("button").nth(i).textContent())
                    .trim().toLowerCase();
        
        if(text.includes("india")){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    await expect(page.locator(".user__name [type='text']").first()).toHaveText(email);
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderId = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderId);
    await page.locator("button[routerlink*='myorders']").click();
    
    await page.locator("tbody").first().waitFor();
    const rows = await page.locator("tbody tr");


    for(let i=0; i < await rows.count(); i++){
        const rowOrderId = await rows.nth(i).locator("th").textContent();
        if(orderId.includes(rowOrderId)){
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    const orderIdDetails = await page.locator(".col-text").textContent();
    expect(orderId.includes(orderIdDetails)).toBeTruthy();

});

test('Test Case 2', async () => {
    // chrome - plugins/cookies

    const productName = 'Zara Coat 3';
    const email = "kartikahalawat01@gmail.com";

    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client/");
    
    const products = await page.locator(".card-body");
    await page.locator(".card-body b").first().waitFor();
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
});