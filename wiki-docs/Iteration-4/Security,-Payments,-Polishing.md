<img src="https://i.kym-cdn.com/entries/icons/facebook/000/021/807/ig9OoyenpxqdCQyABmOQBZDI0duHk2QZZmWg2Hxd4ro.jpg"/>

## Payments

  In order to guarantee secure payments, Stripe API was used to process the payments, store card details, and re-use card details without the need to transfer/enter the details again. 

  Stripe allows creating "Customer" objects, and later assign "Card" objects to them. 

  Asymmetric encryption is used in order to connect to the stripe when the new card is being added. Stripe requires the https:// connection to pass the card details, however the testing could be done with http only, and this is implemented on our website.

  After the card is registered it is assigned to the user in our local database, and assigned to a "Customer" object  in the Stripe database. On registration any card is given a stripe "payment method id" which is stored in the database, and used to create charges. 