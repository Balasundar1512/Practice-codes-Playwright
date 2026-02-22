class ApiUtils{



    constructor(apiContext, apipayload)
    {
        this.apiContext = apiContext;
        this.apipayload = apipayload;
        
    }
        

        async getToken()
        {

            

            const apiLoginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", {
            
                        data: this.apipayload
            
                    });
            
                    const LoginResponsejson = await apiLoginResponse.json();
                    const token = LoginResponsejson.token;
                    return token;
            

        }

        async createOrders(orderpayload)
        {
            let response = {};
            response.token = await this.getToken(); 
            const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order", 
                    {
            
                        data: orderpayload,
                        headers:
                            {
            
                                'Authorization' : response.token,
                                'content-type' : 'application/json'
                            },
                    })
            
                                          
                     const orderResponseJson = await orderResponse.json();
                     console.log(orderResponseJson);
                     const   orderid = orderResponseJson.orders[0];
                     response.orderid = orderid;
                     return response ;
            
        }



}
module.exports = {ApiUtils }