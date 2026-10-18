class DashboardPage {
    constructor(page){
        this.products = page.locator(".card-body");
        this.productsText = page.locator(".card-body b");
        this.cart = page.locator("[routerlink*='cart']");
    }

    async searchProductAddCart(productName){
        const titles = await this.productsText.allTextContents();
        console.log(titles);

        const count = await this.products.count();
        for (let i = 0; i < count; i++) {
            const title = await this.products.nth(i).locator("b").textContent();

            if (title?.trim().toLowerCase() === productName.trim().toLowerCase()) {
                await this.products.nth(i).locator("text='Add To Cart'").click();
                break;
            }
        }
    }

    async navigateToCart(){
        await this.cart.click();
    }
}

module.exports = {DashboardPage};