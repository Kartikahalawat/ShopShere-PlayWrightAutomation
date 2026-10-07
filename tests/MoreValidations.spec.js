import{test, expect} from '@playwright/test';

test("Popup Validations", async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.goto("http://google.com");
    await page.goBack();
    await page.goForward();
});