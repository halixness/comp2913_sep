# Non-Functional Requirements

## Responsive, mobile-friendly UI
* Layout and scale of website is adaptive to device size

## Accessibility
* Block font and clear presentation used throughout
* Blue, yellow, green and purple primary colours (no red-green combinations)

## Good security for user accounts and data
*  Payment information is stored with service provider; designed for secure storage
*  CSRF protection on all requests
*  Passwords are hashed using MD5 to prevent theft

## Secure payments
* Use of Stripe API designed to handle secure payments

## Ethical - no information should be shared without consent
* MySQL database is password-protected
* User data can only be served to clients provided correct credentials are used