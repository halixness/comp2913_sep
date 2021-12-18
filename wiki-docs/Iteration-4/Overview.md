# Iteration 4: Construction Phase (payment and finalisation)

## Payments

  In order to guarantee secure payments, Stripe API was used to process the payments, store card details, and re-use card details without the need to transfer/enter the details again. 

  Stripe allows creating "Customer" objects, and later assign "Card" objects to them. 

  Asymmetric encryption is used in order to connect to the stripe when the new card is being added. Stripe requires the https:// connection to pass the card details, however the testing could be done with http only, and this is implemented on our website.

  After the card is registered it is assigned to the user in our local database, and assigned to a "Customer" object  in the Stripe database. On registration any card is given a stripe "payment method id" which is stored in the database, and used to create charges. 

## Final Backlog
* [Download spreadsheet](https://gitlab.com/joejeffcock/comp2913_sep/-/blob/master/doc/project_backlog/backlog_sports.xlsx)

## Video Demonstrations
![Final product demonstration](uploads/954fdc9513c1443b9c2ceea6e5800517/sprint_4_0.mp4)
![Web app update](uploads/801e81af0cc70fdfa4682e2ef224f5cf/sprint_4_1.mp4)

## Links to developer manuals
* ![pay.js](../Developer Manual/pay.js)
* ![paymentRoutes.js](../Developer Manual/paymentRoutes.js)

## Links to testing
* ![Functional tests](Functional tests)