/*
    paymentMethod.js
        -- javascript front end functions for facilitating interaction
        and multi-form process on payment pages
        
    Contributers
        -- Samuel Barnes
*/


// Variable declarations
var membershipToggle = false; // Membership selected toggle
var cardToggle = false;
var paymentCount = 0;         // Payment current page
var optionId = 0;


/*
*       document load function (on ready)
*/
$(document).ready(function() {
    //Display the default card


    /*
    *  Display the memberships details on page load (from dropdown value)
    */
    if ($('#refresh-membership-auto')[0]) {
        displayMembership($('.membership__sport').val());
    }    


    /*
    *  Membership selection from sport type dropdown
    */
    $('.membership__sport').on('change', function(e) {
        displayMembership($(this).val());
    });


    /*
    *  Card selection from card dropdown
    */
    $('.payment__card').on('change', function(e) {
        displayCard($(this).val());
    });


    /*
    *  Select a card (info card) that is selectable
    */
    $('.details__card--selectable').on('click', function(e) {
        // toggle clicked
        membershipToggle = !membershipToggle;

        if (membershipToggle) 
            enableButton();
        else 
            disableButton();
        
        e.preventDefault();
    });


    /*
    *  Select a info card with payment details that is selectable
    */
    $('#card-select.details__card--selectable').on('click', function(e) {
        // toggle clicked
        cardToggle = !cardToggle;

        if (cardToggle) {
            enablePayment();
        } else {
            disablePayment();
        }  
    });


    /*
    *  Click the next button and progress to the next page subform 
    */
    $('.inline__button--next').on('click', function(e) {
        e.preventDefault();

        disableButton();

        // change the page
        paymentCount++;
        changePage(paymentCount, "next", 2);

        // show order in order total
        $('.total__content').removeClass('total__content--d-none');
        $('.total__total--default').addClass('total__total--d-none');
        $('.total__total--order').removeClass('total__total--d-none');
    });


    /*
    *  add the membership option Id to the url on confirmation (next)
    */
    $('#membership-next').on('click', function(e) {
        e.preventDefault();
        window.history.pushState({option: optionId}, '', '?option=' + optionId);
    })

    /*
    *  add the booking page to the url on confirmation (next)
    */
    $('#booking-next').on('click', function(e) {
        e.preventDefault();
        window.history.pushState({page: 2}, '', '?page=2');
    });


    /*
    *  Edit a specific part of the order and direct the user to that subform (loading the page)
    */
    $('.edit__slide').on('click', function(e) {
        // disable all buttons
        disableButton();
        disablePayment();

        // hide all order content (as it might change)
        $('.total__content').addClass('total__content--d-none');
        $('.total__payment').addClass('total__payment--d-none');
        $('.total__total--default').removeClass('total__total--d-none');
        $('.total__total--order').addClass('total__total--d-none');
        $('.total__pay').addClass('total__pay--d-none');

        // change page to targeted page
        target = $(this).attr('target_slide');
        paymentCount = Number(target) - 1;
        changePage(paymentCount, "prev", 2);
    })
});


/*
*   Function:   disable next button
*/
function disableButton() {
    membershipToggle = false;
    $('.details__card').removeClass('details__card--selected');
    $('.inline__button--disabled').removeClass('inline__button--d-none');
    $('.inline__button--next').addClass('inline__button--d-none');
}


/*
*   Function:   enable next button
*/
function enableButton() {
    membershipToggle = true;
    $('.details__card').addClass('details__card--selected');
    $('.inline__button--disabled').addClass('inline__button--d-none');
    $('.inline__button--next').removeClass('inline__button--d-none');
}


/*
*   Function:   enable payment button
*/
function enablePayment() {
    cardToggle = true;
    $('.total__payment').removeClass('total__payment--d-none');
    $('.total__pay').removeClass('total__pay--d-none');
}


/*
*   Function:   disable payment button
*/
function disablePayment() {
    cardToggle = false;
    $('.total__payment').addClass('total__payment--d-none');
    $('.total__pay').addClass('total__pay--d-none');
}


/*
*   Function:   Display card details from card Id
*   Input:      Id of card to display
*   Output:     Error message / card object details in info card
*/
function displayCard(cardId) {
    disableButton();
    disablePayment();

    $.ajax({
        url: '/ajax/get/card',
        method: 'POST',
        data: {
            'cardId': cardId
        },
        datatype: 'json',
        success: function(data) {
            data = JSON.parse(data);

            if (data.error) {
                $('#card-select.details__card--selectable').addClass('details__card--d-none');
                $('#card-error.details__card--empty').removeClass('details__card--d-none');

            } else {
                // replace the details in the info card
                $('#card-select.details__card--selectable').removeClass('details__card--d-none');
                $('#card-error.details__card--empty').addClass('details__card--d-none');
                $('#card-type, #order-payment').text(data.results.type + " ending in " + data.results.number);
                $('#card-expire').text(data.results.expire_date);
            }
        },
        error: function(error){
            alert(error);
        }
    });
}


/*
*   Function:   display membership details from pricing Id
*   Input:      Id of pricing to display details of
*   Output:     Error message / pricing details in info card
*/
function displayMembership(pricingId) {
    disableButton();

    // get the sport description, price, name, saving etc and display this information

    $.ajax({
        url: '/ajax/get/pricing',
        method: 'POST',
        data: {
            'pricingId': pricingId
        },
        datatype: 'json',
        success: function(data) {
            data = JSON.parse(data);

            if (data.error) {
                $('#order-select.details__card--selectable').addClass('details__card--d-none');
                $('#order-error.details__card--empty').removeClass('details__card--d-none');
            } else {
                updateMembershipDetails(data.results, paymentCount);
                optionId = data.results.id;
            }
        },
        error: function(error) {
            alert(error);
        }
    });
}


/*
*   Function:   update membership details
*   Input:      membership name, amount, monthly, savings, description
*   Output:     Membership details replaced in info card
*/
function updateMembershipDetails(data) {
    $('#order-error.details__card--empty').addClass('details__card--d-none');
    $('#order-select.details__card--selectable').removeClass('details__card--d-none');

    $price = $("<div></div>").attr({id: "membership-price", class: "content__price"});

    var title = "";

    if (data.type == 1) {
        title = "Monthly " + data.name + " Membership";
        $price.append("<p>Billed at £" + data.amount + " per month</p>");
        $('#order-plan, #order-total').text("£" + data.amount + " p/m");
    } else if (data.type == 2) {
        title = "Annual " + data.name + " Membership";
        $price.append("<p>Billed at £" + data.monthly + " annually</p>");
        $price.append("<p>- £" + data.savings + " for annual savings</p>");
        $price.append("<p>Total billed at £" + data.amount + " annually</p>");
        $('#order-plan').text("£" + data.monthly + " p/y");
        $('#order-savings').text("£" + data.savings);
        $('#order-total').text("£" + data.amount + " p/y");

    } else {
        title = "Annual Sports Pass Membership"
        $price.append("<p>Billed at £" + data.amount + " annually</p>");
        $('#order-plan, #order-total').text("£" + data.amount + " p/y");
    }

    $('#item-title, #membership-type, #order-type').text(title);
    $('#membership-description').text(data.description);
    
    $price.append("<p class=\"price__last\">Option to renew automatically</p>");
    $('#membership-price').replaceWith($price);
} 
