# Automate FirstPromoter Affiliate and Stripe Coupon

In FirstPromoter, affiliate partners can sign up and obtain their own affiliate link for promotion. However, they should not use this link; instead, they should receive a unique coupon code.

FirstPromoter supports this functionality, and you can find the detailed instructions here: [How to track sales with coupon codes in FirstPromoter](https://help.firstpromoter.com/en/articles/8971002-how-to-track-sales-with-coupon-codes-in-firstpromoter).

The issue: I need to manually create a unique coupon code for each affiliate partner in Stripe, which is a time-consuming process.

The solution: Automate this task. Whenever a new affiliate partner registers in FirstPromoter, a unique coupon code should automatically be generated in Stripe and assigned to the affiliate partner in FirstPromoter.

This process needs to run automatically and reliably. The relevant API documentation is available here:
- [FirstPromoter API](https://docs.firstpromoter.com/#modify-existing-promoter)
- [Stripe API](https://docs.stripe.com/api/coupons)

# Running the Script
Ensure you have the required packages installed, and then run the script using Node.js:

First, run 
```sh 
npm install
``` 

Create a .env file to store your API keys:

```env
FIRST_PROMOTER_API_KEY=your_first_promoter_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

and then run 
```sh 
npm start
```

You can send a POST request to http://localhost:3000/automate with the following JSON payload to trigger the task:

```sh
{
  "promoterId": "your_promoter_id",
  "promoterData": {
    "email": "new-email@example.com",
    "custom_field": "new-value"
  }
}
```

This setup allows you to dynamically input promoterId and promoterData through the /automate route.

# Test 

### Explanation

 - Dependencies: I use supertest for HTTP assertions, chai for general assertions, and nock to mock external API calls.

### Running the Tests
 - Run your tests using the command:

```sh
npm test
```
