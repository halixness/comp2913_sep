# Iteration 2: Construction Phase (users and security)

## APIs

<img width="500px" src="https://gitlab.com/joejeffcock/comp2913_sep/-/wikis/uploads/255e5e77db5fea0c5a0c536e4d6c8d17/3riv1y.jpg" />

<h3>Login (POST/JSON)</h3>

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"email":"mail@gmail.com","password":"123456"}' \
  http://127.0.0.1:3000/api/login
```

<h3>Register (POST/JSON)</h3>

```
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"name":"John","surname":"Banana","email":"hopethistestworks@gmail.com","birth":"2000-01-01","phone":"123456789","address_1":"Leeds","address_2":"","zipcode":"1234","city":"Leeds","password":"hellohello","confirm_password":"hellohello"}' \
  http://127.0.0.1:3000/api/register
```

## Links to developer manuals
* ![api.js](../Developer Manual/api.js)
* ![userRoutes.js](../Developer Manual/userRoutes.js)

## Links to testing
* ![Unit tests](Unit tests)