class APiUtils {

    // The constructor receives the API request context and login credentials.
    // 'this' makes these values accessible to other methods in this class.
    constructor(apiContext, loginPayLoad) {
        this.apiContext = apiContext;
        this.loginPayLoad = loginPayLoad;
    }

    // Logs in through the API and returns the authentication token.
    // This token will later be used to authenticate the browser session.
    async getToken() {

        // Send a POST request to the login endpoint.
        // The login credentials are sent in the request body as JSON.
        const loginResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                data: this.loginPayLoad
            }
        );

        // Convert the HTTP response body into a JavaScript object.
        const loginResponseJson = await loginResponse.json();

        // Extract the authentication token from the login response.
        const token = loginResponseJson.token;

        // Log the token for debugging purposes.
        // Avoid logging authentication tokens in shared or production environments.
        console.log(token);

        // Return the token so other methods can use it.
        return token;
    }

    // Creates an order through the API and returns the token and order ID.
    async createOrder(orderPayLoad) {

        // Create an object to store the values needed by the UI test.
        let response = {};

        // Authenticate first and store the returned token.
        // await ensures that the token is available before creating the order.
        response.token = await this.getToken();

        // Send a POST request to the order creation endpoint.
        const orderResponse = await this.apiContext.post(
            "https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                // Send the order details, including country and product ID.
                data: orderPayLoad,

                // Pass the authentication token and indicate that the request
                // body contains JSON data.
                headers: {
                    Authorization: response.token,
                    "Content-Type": "application/json"
                }
            }
        );

        // Parse the order creation response into a JavaScript object.
        const orderResponseJson = await orderResponse.json();

        // Log the response to help inspect the API result during debugging.
        console.log(orderResponseJson);

        // Extract the first order ID returned by the API.
        const orderId = orderResponseJson.orders[0];

        // Store the order ID alongside the token.
        response.orderId = orderId;

        // Return both values to the test file:
        // response.token   -> used to authenticate the browser
        // response.orderId -> used to verify the order in the UI
        return response;
    }
}

// Export the class so the test file can import and instantiate it.
module.exports = { APiUtils };
