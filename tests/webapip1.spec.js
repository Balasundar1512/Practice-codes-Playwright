//with API Authentication we are bypassing login page and order page



const {test, expect, request} = require("@playwright/test")
const {ApiUtils} =  require('./utils/ApiUtils'); 

 const apipayload = {userEmail: "maki123@gmail.com", userPassword: "User@123"}
const orderpayload = {orders: [{country: "Canada", productOrderedId: "6960eac0c941646b7a8b3e68"}]}

let response;
test.beforeAll(async () => {
        
        const apiContext = await request.newContext();
        const apiutils = new ApiUtils(apiContext, apipayload);
        response = await apiutils.createOrders(orderpayload);
        




    });


test('End to End client app suppressed code', async ({page}) => {

        page.addInitScript(value =>{
            window.localStorage.setItem('token', value);
        }, response.token );

        await page.goto('https://rahulshettyacademy.com/client/#/auth/login');

        await page.locator("button[routerlink*='myorders']").click();
        const ordhistry = page.locator('tr');
        await ordhistry.first().waitFor();
        await ordhistry.filter({hasText: response.orderid}).getByRole('button', {name: "View"}).click();

        const ordersummary = page.locator('.email-wrapper');
        await ordersummary.waitFor();
        const orderiddtls = await page.locator('.col-text').textContent();
        expect(response.orderid.includes(orderiddtls)).toBeTruthy();

        async function address(page, addrstype, email, country) {                        //For function we need to give work
                                                                                    
            const section = page.locator('.address').filter({hasText: addrstype});                    

            await expect(section).toBeVisible();
            await expect(section).toContainText(email);
            await expect(section).toContainText(`Country - ${country}`);
    
            
        }                                                                           
                                                                                        
        await address(page, ' Billing Address ', 'maki123@gmail.com', 'Canada');                  //After we need to give details for the work
        await address(page, ' Delivery Address ', 'maki123@gmail.com', 'Canada');
       await page.pause();
        
});