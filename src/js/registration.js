/*
    registation.js
        -- javascript front end functions for facilitating interaction
        and multi-form process on registration page
        
    Contributers
        -- Samuel Barnes
*/


/*
*       document load function (on ready)
*/
$(document).ready(function() {

    // Variable declarations
    var pageCount = 0;            // Registration current page
    var registertoggle = false;   // login / registration page toggle (for switching pages)


    /*
    *  Transition from login to registration form (and vise-versa)
    */ 
   $('.half__form-transition-header, .half__bottom-link--transition').on('click', function(e) {
        registertoggle = !registertoggle

        if (registertoggle) {                                   // Show the registration form / Hide login form
            $('.login__half--login').css('display', 'none');
            $('.login__half--register').css('display', 'flex');
            $('.form-transition-header__text').text("Login");
        } else {                                                // Show the login form / Hide the registration form
            $('.login__half--login').css('display', 'flex');
            $('.login__half--register').css('display', 'none');
            $('.form-transition-header__text').text("Register");
        }
        
        e.preventDefault();                                     // Prevent form submission                  
    });


    /*
    *  Remove animation after animation complete (for shake animation)
    */  
   $('.login-form__input').on(
        "webkitAnimationEnd oanimationend msAnimationEnd animationend",
        function() {
            $(this).removeClass("wobble-horizontal");
        }
    );



    /*
    *  Function:   Register form (subform 1) Submit AJAX Request 
    *  Input:      Request Body
    *  Output:     Success/Error function
    */  
   $('#form-1').submit(function(e) {
        var errorIds = ['name-error', 'surname-error', 'email-error', 'password-error', 'confirm_password-error'];
        $.each(errorIds, function(key, value) { // Clear the errors each time the form is submitted
            $('#' + value).text("");
            $('#' + value).addClass('d-none')
        });

        $.ajax({
            url: '/ajax/register/response-1',
            type: 'POST',
            data: $('#form-1').serialize(),
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);
                if (data.error) {
                    $.each(data.error, function(key, value) {
                        $('#' + value.path + '-error').text(value.message);
                        $('#' + value.path + '-error').removeClass('login-form__error--d-none');
                        $('#' + value.path).addClass('wobble-horizontal');
                    });
                } else {
                    pageCount++;
                    changePage(pageCount, "next", 2);
                }
            },
            error: function(error) {
                alert(error);
            }
        }); 

        e.preventDefault();
    }); 


    /*
    *  Function:   Register form (subform 2) Submit AJAX Request 
    *  Input:      Request Body
    *  Output:     Success/Error function
    */ 
    $('#form-2').submit(function(e) {
        var errorIds = ['birth-error', 'phone-error'];
        $.each(errorIds, function(key, value) { // Clear the errors each time the form is submitted
            $('#' + value).text("");
            $('#' + value).addClass('d-none')
        });

        $.ajax({
            url: '/ajax/register/response-2',
            type: 'POST',
            data: $('#form-2').serialize(),
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);
                if (data.error) {
                    $.each(data.error, function(key, value) {
                        $('#' + value.path + '-error').text(value.message);
                        $('#' + value.path + '-error').removeClass('login-form__error--d-none');
                        $('#' + value.path).addClass('wobble-horizontal');
                    });
                } else {
                    pageCount++;
                    changePage(pageCount, "next", 2);
                }
            },
            error: function(error) {
                alert(error);
            }
        });

        e.preventDefault();
    });


    /*
    *  Function:   Register form (subform 3) Submit AJAX Request 
    *  Input:      Request Body
    *  Output:     Success/Error function
    */ 
    $('#form-3').submit(function(e) {
        var errorIds = ['address_1-error', 'address_1-error', 'city-error', 'zipcode-error'];
        $.each(errorIds, function(key, value) { // Clear the errors each time the form is submitted 
            $('#' + value).text("");
            $('#' + value).addClass('d-none')
        });

        $.ajax({
            url: '/ajax/register/response-3',
            type: 'POST',
            data: $('#form-3').serialize(),
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);
                if (data.error) {
                    $.each(data.error, function(key, value) {
                        $('#' + value.path + '-error').text(value.message);
                        $('#' + value.path + '-error').removeClass('login-form__error--d-none');
                        $('#' + value.path).addClass('wobble-horizontal');
                    });
                } else {
                    combineForms(); // Combine all forms data and submit
                }
            },
            error: function(error) {
                alert(error);
            }   
        });

        e.preventDefault();
    });


    /*
    *  Function:   Call to subform 3 to submit all forms 
    */
    $('#form-4').submit(function(e) {
        $('#form-3').submit();
        e.preventDefault();
    });


    /*
    *  Function:   Return to the previous form
    *  Input:      The current page count
    *  Output:     The new page count 
    */
    $('.login-form__btn--return').on('click', function(e) {
        pageCount--;
        changePage(pageCount, "back", 2);
    });
});



/*
    *  Function:   Combine the forms from the different pages of registration
    *  Input:      Form data from registration
    *  Output:     A new form with all the forms combined, submitted
*/
function combineForms() {
    var $newForm = $("<form></form>").attr({method: "POST", action: "/user/register"});

    // Get all the values from form 1
    $('#form-1').find(":input:not(:submit, :button)").each(function() {
        $newForm.append($("<input type=\"hidden\" />")  
            .attr('name', this.name)   
            .val($(this).val())  
        );
    });

    // Get all the values from form 2
    $('#form-2').find(":input:not(:submit, :button)").each(function() {
        if (this.name != "_csrf") {
            $newForm.append($("<input type=\"hidden\" />")  
                .attr('name', this.name)   
                .val($(this).val())  
            );
        }
    });

    // Get all the values from form 3
    $('#form-3').find(":input:not(:submit, :button)").each(function() {
        if (this.name != "_csrf") {
            $newForm.append($("<input type=\"hidden\" />")  
                .attr('name', this.name)   
                .val($(this).val())  
            );
        }
    });

    // Append the body to the document so it can be submitted
    $newForm.appendTo(document.body).submit();
}