class LoginPage {
    constructor(page){
        this.page = page;
        this.signInbutton = page.locator("[value='Login']");
        this.userName = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
    }

    async goTo(){
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

    async validLogin(userName, password){
        await this.userName.type(userName); //type of fill (both works)
        await this.password.fill(password);
        await this.signInbutton.click();
        await this.page.locator(".card-body b").first().waitFor();
    }
}

module.exports = {LoginPage};