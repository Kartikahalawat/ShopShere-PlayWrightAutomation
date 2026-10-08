import{test, expect, request} from "@playwright/test";

const loginPayLoad = {userEmail: "kartikahalawat01@gmail.com", userPassword: "Kartik01*"};
const orderPayLoad = {orders: [{country: "India", productOrderedId: "6960eac0c941646b7a8b3e68"}]};
let token;
let orderId;

test.beforeAll( async ()=>
{
    //Login API
    const apiContext = await request.newContext();
    const loginResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
        {
            data : loginPayLoad
        }
    );

    expect((loginResponse).ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    token = loginResponseJson.token;
    console.log(token);

    //Create Order
    const orderResponse = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
        {
            data : orderPayLoad,
            headers:{
                'Authorization' : token,
                'Content-Type' : "application/json"
            },
        }
    )
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    orderId = orderResponseJson.orders[0];
    console.log(orderId);
});

test.beforeEach( ()=>
{
 
});

test('Client App Login', async ({ page }) => {

    page.addInitScript(value => {
        window.localStorage.setItem('token',value);
    }, token);
    
    // await page.goto("https://rahulshettyacademy.com/client/");
    // await page.locator("#userEmail").fill(email);
    // await page.locator("#userPassword").fill("Kartik01*");
    // await page.locator("[value='Login']").click();

    //Waiting till all network calls are made
    //await page.waitForLoadState("networkidle");

    const productName = 'Zara Coat 3';
    const email = "kartikahalawat01@gmail.com";
    await page.goto("https://rahulshettyacademy.com/client/");
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

//Verify if order created is showing in history page
//Precondion - create order
