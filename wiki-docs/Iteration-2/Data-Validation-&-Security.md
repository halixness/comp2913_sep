<img src="https://www.shitpostbot.com/resize/585/400?img=%2Fimg%2Fsourceimages%2Fguess-ill-die-5845d8789c1c2.jpeg"/>

##  Data validation

During registration the data provided by the user (Name, Surname, email, passwords, e.t.c) is validated on the server side, to not be empty and/or be filled appropriately:



*  Name must be at least 3 characters long
*  Surname must be at least 3 characters long
*  email must be at least 6 characters long, and contain the pattern: @ followed by some number of characters, followed by a full stop, followed by some number of characters.
*  Birth date must be provided.
*  Phone must be a sequence of numeric characters.
*  Address, zipcode and city must be provided.
*  Password1, and Password2 must be at least 6 characters long, and must be equal in order to register.

##  Security

For security reasons passwords are stored combined with the "salt"(sequence of random characters generated on user registration and added to the password string before encryption) and encrypted with MD5. This allows password hashes to be different even if passwords are the same.