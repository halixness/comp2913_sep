This router contains web endpoints to serve user dashboard pages and endpoints to process user related data.

| Method | Route | Description |
|:----------|:------|:-------|
|POST|**/login**|post login by email and password, returns a session id
|POST|**/register**|register user with required params, returns a session id
|GET|**/account**|user dashboard page (after login)
|GET|**/account/bookings**|user bookings page (check user bookings/cancel)
|GET|**/account/details**|user details page (edit personal details)
|GET|**/account/details**|user details page (edit personal details)
|POST|**/account/update/details**|update user details page, process POST form
|POST|**/account/update/address**|update user address
|POST|**/account/update/password**|update user password
|GET|**/account/memberships**|user memberships page (check, cancel)
|GET|**/account/payment**|user payments page (check, change payment methods)
|GET|**/account/payment/receipt**|display payment receipt to user by payment id
|POST|**/account/add/card**|add new payment card, process POST params
|GET|**/account/payment/cash**|submit new cash payment page
|POST|**/account/payment/cash**|process new cash payment POST submission
|GET|**/account/payment/cash/receipt**|display cash payment receipt
|GET|**/logout**|logs user out and redirects to homepage
