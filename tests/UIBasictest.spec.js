import{test, expect} from '@playwright/test';

test('Browser Context Playwright test', async ({ browser }) => {
    // chrome - plugins/cookies

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title);

    const userName = page.locator('#username');
    const userPass = page.locator("[type='password']");
    const signIn = page.locator("#signInBtn");
    const cardTitles = page.locator(".card-body a");

    //css, xpath
    await userName.fill("KartikAhalawat");
    await userPass.fill("Learning@830$3mK2");
    await signIn.click();

    //wait until this locator shown up page
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');

    await userName.fill("");
    await userName.fill("rahulshettyacademy");
    await signIn.click();

    console.log(await cardTitles.nth(0).textContent());
    console.log(await cardTitles.last().textContent());
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
});


test('Page Playwright test', async ({ page }) => {
    await page.goto("https://google.com");
    //get title
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
});

test('UI Controls', async ({page})=>
{
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const userName = page.locator('#username');
    const userPass = page.locator("[type='password']");
    const dropdown = page.locator("select.form-control");
    const documentLink = page.locator("[href*='documents-request']");

    await userName.fill("KartikAhalawat");
    await userPass.fill("Learning@830$3mK2");

    
    await dropdown.selectOption("consult");
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    
    console.log(page.locator(".radiotextsty").last().isChecked());
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    
    await page.locator("#terms").click();
    await expect(page.locator("#terms")).toBeChecked();

    //Checking unchecked 
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms").isChecked()).toBeFalsy();

    //Checking blinking text
    await expect(documentLink).toHaveAttribute("class", "blinkingText");
    
    // await page.pause();

});

test('Child windows handl', async ({browser})=>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const userName = page.locator("#username");
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");
    
    const [newPage] = await Promise.all(
    [
        context.waitForEvent('page'), //listen for any new page
        documentLink.click()  //new page is opened
    ])  //Driver will come out from this loop only after execution of all steps 

    const text = await newPage.locator(".red").textContent();
    const domain = text.split("@")[1].split(" ")[0];
    console.log(domain);

    await page.locator("#username").fill(domain);
    console.log(await page.locator("#username").inputValue());
});