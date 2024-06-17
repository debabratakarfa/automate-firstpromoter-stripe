# Automate FirstPromoter Affiliate and Stripe Coupon

In FirstPromoter, affiliate partners can sign up and obtain their own affiliate link for promotion. However, they should not use this link; instead, they should receive a unique coupon code.

FirstPromoter supports this functionality, and you can find the detailed instructions here: [How to track sales with coupon codes in FirstPromoter](https://help.firstpromoter.com/en/articles/8971002-how-to-track-sales-with-coupon-codes-in-firstpromoter).

The issue: I need to manually create a unique coupon code for each affiliate partner in Stripe, which is a time-consuming process.

The solution: Automate this task. Whenever a new affiliate partner registers in FirstPromoter, a unique coupon code should automatically be generated in Stripe and assigned to the affiliate partner in FirstPromoter.

This process needs to run automatically and reliably. The relevant API documentation is available here:
- [FirstPromoter API](https://docs.firstpromoter.com/#modify-existing-promoter)
- [Stripe API](https://docs.stripe.com/api/coupons)
