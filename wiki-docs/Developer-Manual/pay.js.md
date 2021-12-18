This router contains the endpoints to process payments (card payments, cash payments managed with another router).

| Method | Route | Description |
|:----------|:------|:-------|
|GET|**/stripe-key**|get stripe api token to process with backend
|POST|**/setup-intent**|get stripe user token by user id
|POST|**/pay**|process payment given user id, item id, card payment id












