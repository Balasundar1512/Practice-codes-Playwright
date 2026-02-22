//Using storageState method to bypass login and create order page

const {test, expect, selectors} = require('@playwright/test');
const { text } = require('node:stream/consumers');

let webContext;

test.beforeAll(async ({browser})=> {


    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator('#userEmail').fill("maki123@gmail.com");
    await page.locator('#userPassword').fill("User@123");
    await page.getByRole('button', {name: 'Login'}).click();
    await page.waitForLoadState('networkidle');
    await context.storageState({path: 'State.json'});
    webContext = await browser.newContext({storageState: "State.json"});

})

test('End to End client app', async () => {

        const prodname = "ZARA COAT 3"

        const page = await webContext.newPage(); 
        await page.goto("https://rahulshettyacademy.com/client");
        const products = page.locator('.card-body');
        
        const count = await products.count();
        for(let i=0; i< count; ++i){
            if(await products.nth(i).locator("b").textContent() === prodname){

                await products.nth(i).getByRole('button', {name: ' Add To Cart'}).click();
                break;
            }
        }
        await expect(page.getByText(' Product Added To Cart ')).toBeVisible();
        await page.locator("[routerlink*='cart']").click();
        await page.locator("div li").first().waitFor();
        const proditem = await page.locator("li").filter({hasText: prodname})
        await expect(proditem).toBeTruthy; 
        await proditem.getByRole('button', {name: "Buy Now"}).click();
        
        //personal information    //coupen code-rahulshettyacademy
        const expdate = page.locator('.input.ddl');
        await expdate.first().selectOption('10');
        await expdate.last().selectOption('27');
        async function fillfield(page, lableText, value) {
            const input=await page.locator('div.field, div.field.small')
            .filter({hasText: lableText})
            .locator('input');

        await expect(input).toBeVisible();
        await input.fill(value);
            
        }

        await fillfield(page, 'CVV Code ', '321');
        await fillfield(page, 'Name on Card ', 'Bala');
        await fillfield(page, 'Apply Coupon ', 'rahulshettyacademy');
        await page.getByRole('button', {name: 'Apply Coupon'}).click();
        
        await expect(page.locator('.mt-1').filter({hasText: '* Coupon Applied'})).toBeVisible();

        await expect(page.locator('.user__name.mt-5 label')).toHaveText("maki123@gmail.com");
        const countryinput = await page.locator("input[placeholder*='Select Country']");
        await countryinput.click();
        await countryinput.type("ind", { delay: 150 });
        const optdropdown = page.locator('.ta-results');
        await optdropdown.waitFor();
        const optcount = await optdropdown.locator("button").count();
        for(let i=0; i < optcount; ++i){

           const text = await optdropdown.locator("button").nth(i).textContent();
            if(text === " India"){

                await optdropdown.locator("button").nth(i).click();
                break;
            }
        }

        await page.locator('.action__submit').click();

        await expect(page.locator("h1")).toHaveText(" Thankyou for the order. ");
        const orderid =  await page.locator('label.ng-star-inserted').textContent();
        await page.locator("button[routerlink*='myorders']").click();
        await page.locator('.table').waitFor();
        const orderrows = page.locator("tbody tr");
        const rowcount = await orderrows.count();
        for(let i=0; i < rowcount; ++i){
            
            const orderrowid = await orderrows.nth(i).locator("th").textContent();
            if(orderid.includes(orderrowid)){
 
                await orderrows.nth(i).locator("button").first().click();
                break;

            }
        }    

        const ordersummary = page.locator('.email-wrapper');
        await ordersummary.waitFor();
        const orderiddtls = await page.locator('.col-text').textContent();
        await expect(orderid.includes(orderiddtls)).toBeTruthy();

        async function address(page, addrstype, email, country) {                        //For function we need to give work
                                                                                    
            const section = page.locator('.address').filter({hasText: addrstype});                    

            await expect(section).toBeVisible();
            await expect(section).toContainText(email);
            await expect(section).toContainText(`Country - ${country}`);
    
            
        }                                                                           
                                                                                        
        await address(page, ' Billing Address ', "maki123@gmail.com", 'India');                  //After we need to give details for the work
        await address(page, ' Delivery Address ', "maki123@gmail.com", 'India');


        
        
        
        
        
        
        
        
        
        
        
        
        //await page.pause();
        
});