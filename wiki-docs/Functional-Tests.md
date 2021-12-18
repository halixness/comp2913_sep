# Functional Tests
## Membership, Bookings and Payments
Paying for activities and memberships comprise many moving parts (Stripe API, database integration, front-end validation), so the functional test approach was taken to carry out testing.

Valid test cards taken from [Stripe Docs](https://stripe.com/docs/testing).

Key: A# for activity of ID # (e.g. A1 for Activity 1: Swimming)

### 29/04/20 (All tests passed)

Normal data:

| No  | Item       | Type             | Card Number      | Expiry | CVC | Expected Result | Result | Action Taken |
| --- | ---        | ---              | ---              | ---    | --- | ---             | ---    |---          |
| 0   | A1 : Swimming | Visa        | 4242424242424242 | 01/22  | 000 | Confirmed (£15) | Confirmed (£15)  | None |
| 1   | A2 : Kick Boxing | Visa Debit       | 4000056655665556 | 04/22  | 000 | Confirmed (£15) | Confirmed (£15) | None |
| 2   | A3 : Football | Master       | 5555555555554444 | 01/22  | 000 | Confirmed (£15) | Confirmed (£15) | None |
| 3   | A4 : Squash| Master Debit | 5200828282828210 | 04/22  | 000 | Confirmed (£15) | Confirmed (£15) | None |
| 4   | A5 : Running| Amex | 378282246310005  | 01/22  | 000 | Confirmed (£15) | Confirmed (£15) | None |
| 5   | A6 : Gym Access| Diners Club      | 3056930009020004 | 01/22  | 000 | Confirmed (£15) | Card declined | Stripe API issue - None taken         |

Extreme data:

| No  | Item       | Type             | Card Number      | Expiry | CVC | Expected Result | Result | Action Taken |
| --- | --- | ---              | ---              | ---    | --- | ---             | ---    |---          |
| 6   | Squash Monthly - A4| Visa             | 4242424242424242 | 04/20  | 000 | Confirmed (£0)| Confirmed (£0) | None         |
| 7   | Squash Annual - A4 | Visa Debit       | 4000056655665556 | 04/20  | 000 | Confirmed (£0)  | Confirmed (£0) | None         |
| 8   | Running Monthly - A5| Master       | 5555555555554444 | 04/20  | 000 | Confirmed (£0)  | Confirmed (£0) | None         |
| 9   | Running Annual - A5| Master Debit | 5200828282828210 | 04/20  | 000 | Confirmed (£0) | Confirmed (£0) | None         |
| 10  | Sports Pass - A1| Amex | 378282246310005  | 04/20  | 000 | Confirmed (£0) | Confirmed (£0) | None         |
| 11  | Sports Pass - A2| Diners Club      | 3056930009020004 | 04/20  | 000 |Confirmed (£0)| Card declined | Stripe API issue - None taken         |
| 12  | Squash Monthly - A1 | Visa             | 4242424242424242 | 04/20  | 000 | Confirmed (£15)| Confirmed (£15) | None         |
| 13  | Squash Annual - A2 | Visa Debit       | 4000056655665556 | 04/20  | 000 | Confirmed (£15)  | Confirmed (£15) | None      |

Abnormal data:

| No   | Item |  Type             | Card Number      | Expiry | CVC | Expected Result | Result | Action Taken |
| ---  | ---  | ---              | ---              | ---    | --- | ---             | ---    |---          |
| 12   | A1 : Swimming | Visa - expired             | 4242424242424242 | 01/01  | 000 | ERROR | ERROR | None         |
| 13   | A2 : Kick Boxing | Visa - invalid date             | 4242424242424242 | 99/22  | 000 | ERROR | Not accepted | None         |
| 14   | A3 : Football | Visa - invalid date             | 4242424242424242 | 1  | 000 | ERROR | ERROR | None         |
| 15   | A4 : Squash| Visa - invalid date             | 4242424242424242 |   | 000 | ERROR | ERROR | None         |
| 16   | A5 : Running| Master - invalid CVC       | 5555555555554444 | 01/22  | 9 | ERROR    | ERROR | None  |
| 17   | Squash Monthly - A4 | Master - invalid CVC      | 5555555555554444 | 01/22  | 9999 | ERROR | Not accepted | None         |
| 18   | Squash Annual - A4 | Master - invalid CVC       | 5555555555554444 | 01/22  |  | ERROR  | ERROR | None         |
| 19   | Running Monthly - A5 | Invalid          | 1 | 01/22  | 000 | ERROR | ERROR | None         |
| 20   | Running Annual - A5 | Invalid      | abcdabcdabcdabcd | 01/22  | 000 | ERROR  | Not accepted | None      |
| 21   | Sports Pass | Invalid  | 4242424242424242 4242424242424242 | 01/22  | 000 | ERROR | Not accepted | None |
| 22   | Sports Pass | Invalid          |  | 01/22  | 000 | ERROR              | ERROR | None         |

## Payment confirmation emails

A new account under the email sc18j3j@leeds.ac.uk was created for testing.

Various payments were made using the account to test if payment confirmation was sent and the correct details appeared in the email.

### 02/05/20 (All tests passed)

Booking with card payment:

![Booking with card payment](https://gitlab.com/joejeffcock/comp2913_sep/-/raw/master/doc/tests/A18.png)


<br>

Booking with membership:

![Booking with membership](https://gitlab.com/joejeffcock/comp2913_sep/-/raw/master/doc/tests/A19.png)


<br>

Monthly membership:

![Monthly membership](https://gitlab.com/joejeffcock/comp2913_sep/-/raw/master/doc/tests/M52.png)


<br>

Annual membership:

![Annual membership](https://gitlab.com/joejeffcock/comp2913_sep/-/raw/master/doc/tests/M53.png)


<br>

Sports pass:

![Sports Pass](https://gitlab.com/joejeffcock/comp2913_sep/-/raw/master/doc/tests/M54.png)

