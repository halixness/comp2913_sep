/*
    main.js
        -- javascript front end functions for providing interation to the user
        
    Contributers
        -- Samuel Barnes
*/


/*
*    Scroll function
*/
$(window).scroll(function() {
    showScrollToggle();

    if ($(document).scrollTop() > 200){
        $('.header-spacing').addClass('header-spacing--scroll');
        $('.header').addClass('header--scroll');
    } else{
        $('.header-spacing').removeClass('header-spacing--scroll');
        $('.header').removeClass('header--scroll');
    }	
});


/*
*       document load function (on ready)
*/
$(document).ready(function() {

    // Variable declarations
    var hamburgerPressed = false; // Menu dropdown toggle
    var accountToggle = false;    // Account side-bar toggle


    /*
    *  For switching between pages of the selector item class
    */
    $('.selector__item').on('click', function(e) {
        $('.selector__item').removeClass('selector__item--selected');   // remove selected class for all items
        $(this).addClass('selector__item--selected');                   // add selected class to current selected item

        $('.selector__item').each(function(key, value) {
            var target = $(this).attr('target');
            $('#' + target).css('display', 'none');                     // Set all targets to be hidden
        });

        var target = $(this).attr('target');
        $('#' + target).css('display', 'flex');                         // Only show the selected target
    });


    /*
    *  Add shake affect to form inputs
    */
    if ($('.update-form__error')[0]) {                                      // Check that an error exists within the form
        errors = ['name', 'surname', 'email', 'phone', 'birth',
                    'address_1', 'address_2', 'city', 'zipcode', 
                    'current_password', 'password', 'confirm_password', 
                    'price', 'description', 'icon', 'image',
                    'cost', 'date', 'time', 'discount', 'duration',
                    'activity_id', 'amount', 'usr_email', 'rcpt_email'];

        $.each(errors, function(key, value) {
            if ($('#' + value + '-error')[0]) {                             // Find the error that exists
                $('#' + value).addClass('wobble-horizontal');               // Add the shake effect 
            }
        });
    }



    /*
    *  Set the default icon of the icon picker
    */
    if ($('.update-form__icon')[0]) {
        $('.update-form__icon--' + $('#icon').val().replace('-white', '')).addClass('update-form__icon--selected');
    }


    /*
    *  Icon selection on facilities form; change Icon on selection
    */
    $('.update-form__icon').on('click', function(e) {
        $('#icon').val($(this).attr('data_attr') + "-white");               // Set the input to the selected icon's value
        $('.update-form__icon').removeClass('update-form__icon--selected'); // Remove selected class for all icons (clear)
        $(this).addClass('update-form__icon--selected');                    // Apply selected class to the selected icon
    })


    /*
    *  Slick configuration (for carousel)
    */
    $(".reviews__carousel").slick({
        autoplay: true,
        autoplaySpeed: 3000, // Speed of automatically sliding 
        dots: true,
        customPaging : function(slider, i) {
            var thumb = $(slider.$slides[i]).data();
            return '<a>'+ (i + 1) +'</a>';;
        }
    });


    /*
    *  hamburger dropdown menu open and close effects
    */
    $('.hamburger').on('click', function(e) {
        e.preventDefault();                                                 // Prevent from being submitted (and page reloading)
        hamburgerPressed = !hamburgerPressed;

        console.log("does this worl");

        if (hamburgerPressed) {
            $('.hamburger').addClass('is-active');

            $('.header__dropdown').css('display', 'block').animate({        // Show the header (open)
                backgroundColor: 'rgba(0, 0, 0, .6)'
            })
            $('.dropdown__container').addClass('dropdown__container--open');

        } else {
            $('.hamburger').removeClass('is-active').css('position', 'static');

            $('.header__dropdown').animate({                                // Hide the header (close)
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }, function() {
                $('.header__dropdown').css('display', 'none');              // remove display property to hide
            });
            $('.dropdown__container').removeClass('dropdown__container--open');
        }
    });


    /*
    *  Scroll up function
    */ 
    $('.scroll-to-top').on('click', function(e) {
		$('html, body').animate({scrollTop: 0}, 500);   // Show the scroll-top button
		e.preventDefault();                             // Prevent the button from being submitted 
    });    



    /*
    *  Open the side bar on the accounts pages 
    */ 
    $('.account__side-open').on('click', function(e) {
        accountToggle = !accountToggle;

        if (accountToggle) {                                                // Open
            $('.account__side-bar').addClass('account__side-bar--open');
            $('.label__expand').text("Collapse");
        } else {                                                           // Closed
            $('.account__side-bar').removeClass('account__side-bar--open');
            $('.label__expand').text("Expand");
        }
    });


    /*
    *  Open all Modals (default class)
    */ 
    $(document).on('click', '.modal--open', function(e) {
        $('.modal--modal').css('display', 'flex');
    });


    /*
    *  Open only delete modals (for confirmation)
    */ 
    $('.modal--open-delete').on('click', function(e) {
        $('.modal--delete').css('display', 'flex');
    });


    /*
    *  Close all modals 
    */ 
    $('.modal--close').on('click', function(e) {
        $('.modal').fadeOut();
    });


    /*
    *  If they click off the modal (anywhere outside it), close it
    */ 
    $('.modal').on('click', function(e) {
        var target = $('.modal');

        if (e.target.className.split(" ")[0] == 'modal') {  // Check its not the modal itselef
            target.fadeOut();
        }
    });


    // #### Setting the URL of the delete modals so when pressed they redirect to the specific delete route ####
    /*
    *  URL of the delete-membership modal
    */ 
    $('.content__explore--delete-membership').on('click', function(e) {
        $('#delete-membership').attr('href', '/delete/memberships/' + this.id);
    });


    /*
    *  URL of the delete-payment modal
    */ 
    $('.content__explore--delete-payment').on('click', function(e) {
        $('#delete-payment').attr('href', '/delete/cards/' + this.id);
    });

    $('.form-title__book--delete-facility').on('click', function(e) {
        $('#delete-facility').attr('href', '/delete/facility/' + this.id);
    });

    $('.form-title__book--delete-activity').on('click', function(e) {
        $('#delete-activity').attr('href', '/delete/activity/' + this.id);
    });


    // #### Setting the contents of the book modals, such that they show the bookings ####
    /*
    *  Set the content of the 'My Bookings' modal 
    */ 
    $('.overview__option--qr-modal').on('click', function(e) {
        $('#sportName').text($(this).find('.sportName-value').text());
        $('#start_time').text($(this).find('.start_time-value').text());
        $('#duration').text($(this).find('.duration-value').text());
        $('#status').text($(this).find('.status-value').text());
        $('#qr').attr('src', $(this).attr('attr_qr'));
        $('#delete-booking').attr('href', '/delete/booking/' + $(this).attr('attr_id'));

    });


    /*
    *  Set the content of the booking modal (for a new booking)
    */ 
    $(document).on('click', '.item__book--book-modal', function(e) {
        var target = $(this).parent().parent();

        updateBookingModal(
            target.find('.activity-value').text(),
            target.find('.start_time-value').attr('data_attr'),
            target.find('.duration-value').text(),
            target.find('.capacity-value').attr('data_attr'),
            target.find('.location-value').text(),
            target.find('.price-value').val(),
            $(this).attr('data_attr')
        );
    });


    /*
    *  Automatically open the modal and fill it with the activity details from Id
    *  Input:   Id of activity 
    */ 
    if ($('.modal--open-auto')[0]) {
        var id = $('#full-error').attr('data_attr');
        
        $.ajax({
            url: '/ajax/get/activity',
            type: 'POST',
            data: {
                'activityId': id
            },
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);
                if (!data.error) {

                    console.log(data.results);

                    members = data.results.discount == 0 ? "Free" : "£" + (data.results.cost - data.results.discount);
                    nonMembers = data.results.cost == 0 ? "Free" : "£" + data.results.cost;
                    
                    // replace the modal with the new dats
                    updateBookingModal(
                        data.results.name_sport,
                        data.results.start_time,
                        data.results.duration + " Minutes",
                        data.results.booked_capacity + " / " + data.results.capacity,
                        data.results.facility_name,
                        members + " for members, " + nonMembers + " for non-members",
                        "bob"
                    );

                    $('#full-error').removeClass('modal__error--d-none');          // Show the error
                    $('#book-activity').css('display', 'none');                    // hide the booking option
                    $('.modal--modal').css('display', 'flex');                     // Show the modal
                }
            },
            error: function(error) {
                alert(error);
            }
        });
    }


    /*
    *  Function:   Delete selected Facility image
    *  Input:      ID of selected image
    *              ID of facility
    *  Output:     Re-render all the images 
    */ 
    $(document).on('click', '.image__delete--facility', function(e) {
        facilityId = $(this).attr('facility_attr');

        $.ajax({
            url: '/ajax/delete/image/facility',
            type: 'POST',
            data: {
                'imageId': $(this).attr('image_attr'),
                'facilityId': facilityId
            },
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);

                var $newImages = $("<div id=\"image-container\"></div>")

                var row = ""
                $.each(data.results, function(key, value) {
                    row += "<div class=\"update-form__image\">";
                    row += "<span class=\"image__delete image__delete--facility \" image_attr=\"" + value.id + "\" facility_attr=\"" + facilityId + "\" ><h2>×</h2></span>";
                    row += "<img src=\"/uploads/" + value.id + "." + value.ext + "\" />";
                    row += "</div>";
                });
                $newImages.append(row);
                
                $('#image-container').replaceWith($newImages);

            },
            error: function(error) {
                alert(error);
            }
        });
    });


    /*
    *  Function:   Delete selected actitivity image
    *  Input:      ID of selected image
    *              ID of activity
    *  Output:     Re-render all the images 
    */ 
    $(document).on('click', '.image__delete--activity', function(e) {
        activityId = $(this).attr('activity_attr');

        $.ajax({
            url: '/ajax/delete/image/activity',
            type: 'POST',
            data: {
                'imageId': $(this).attr('image_attr'),
                'activityId': activityId
            },
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);

                var $newImages = $("<div id=\"image-container\"></div>")

                var row = ""
                $.each(data.results, function(key, value) {
                    row += "<div class=\"update-form__image\">";
                    row += "<span class=\"image__delete image__delete--activity \" image_attr=\"" + value.id + "\" activity_attr=\"" + activityId + "\" ><h2>×</h2></span>";
                    row += "<img src=\"/uploads/" + value.id + "." + value.ext + "\" />";
                    row += "</div>";
                });
                $newImages.append(row);
                
                $('#image-container').replaceWith($newImages);

            }, 
            error: function(error) {
                alert(error);
            }
        });
    });


    /*
    *  Function:   Replace payment history data on card selected (from dropdown)
    *  Input:      Selected Cards ID
    *  Output:     Selected cards payment history displayed
    */ 
    $('#card-select').on('change', function(e) {
        $.ajax({
            url: '/ajax/update/payment',
            type: 'POST',
            data: {cardId: $(this).val()},
            datatype: 'json',
            success: function(data) {
                data = JSON.parse(data);

                console.log(data);

                var $payments = $("<div class=\"account__section account__section--full-width account__details\" id=\"payment-history\"></div>")

                if (data.results.length > 0) {
                    $payments.append(`
                        <div class="section__title">
                            <h2>Your Payment History</h2>
                        </div>
                    `);

                    var payment = "";
                    $.each(data.results, function(key, value) {
                        var name = value.activity_name;

                        if (value.membership_type != null) {
                            if (value.membership_type == 3) {
                                name = "Annual Sports Pass Membership";
                            } else if (value.membership_type == 2) {
                                name = "Annual " + value.sport_name + " Membership";
                            } else {
                                name = "Monthly " + value.sport_name + " Membership";
                            }
                        }

                        payment += `
                            <div class="details__content">
                                <div class="content__form-title content__form-title--top">
                                    <div class="form-title__title">
                                        <h2>Payment No. ${value.id}</h2>
                                    </div>
                    
                                    <div class="form-title__desc">
                                        ${name}
                                    </div>

                                    <div class="form-title__book hvr-sweep-to-right">
                                        <a href="/user/account/payment/receipt?payment_id=${value.id}" target="_blank">
                                            <h3>Show Reciept</h3>
                                        </a>
                                    </div>
                                </div>

                                <div class="content__list">
                                    <div class="list__field">
                                        <div class="field__field">
                                            <img src="/img/icons/clock.png" />
                                            <h3>Purchase Date:</h3>
                                            <span>${value.purchase_date}</span>
                                        </div>

                                        <div class="field__field">
                                            <img src="/img/icons/discount.png" />
                                            <h3>Amount Cost:</h3>
                                            <span>£${value.amount}</span>
                                        </div>

                                        <div class="field__field">
                                            <img src="/img/icons/pay.png" />
                                            <h3>Payment Method:</h3>
                                            <span>${value.type} ending in ${value.number}</span>
                                        </div>
                                    </div>
                                </div>
                    
                                <div class="content__form-title content__form-title--side">
                                    <div class="form-title__title">
                                        <h2>Payment No. ${value.id}</h2>

                                    </div>
                    
                                    <div class="form-title__desc">
                                        ${name}
                                    </div>

                                    <div class="form-title__book hvr-sweep-to-right">
                                        <a href="/user/account/payment/receipt?payment_id=${value.id}" target="_blank">
                                            <h3>Show Reciept</h3>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `
                    }); 

                    $payments.append(payment);
                }

                $('#payment-history').replaceWith($payments);
            },
            error: function(error) {
                alert(error);
            }
        });
    });


    /*
    *  Function:   Update activities timetable data on day selection
    *  Input:      Day selected
    *  Output:     New data within the timetable for activities on selected date
    */ 
    $(document).on('click', '.timetable__activity--day', function(e) {
        var selectedDate = $(this).text();
    
        updateActivityTimetable(selectedDate);
    });


    /*
    *  Function:   Update activities timetable data on datepicker
    *  Input:      Datepicker date
    *  Output:     New data within the timetable for activities on selected date
    */
    $('.timetable__activity--week').on('change', function(e) {
        var selectedDate = $(this).val();
    
        updateActivityTimetable(selectedDate);
    });
    
    
    /*
    *  Function:   Update facility timetable data on day selection
    *  Input:      Day selected
    *  Output:     New data within the timetable for activities on selected date
    */ 
    $(document).on('click', '.timetable__facility--day', function(e) {
        var selectedDate = $(this).text();
    
        updateFacilityTimetable(selectedDate);
    });
    
    
    /*
    *  Function:   Update facility timetable data on datepicker
    *  Input:      Datepicker date
    *  Output:     New data within the timetable for activities on selected date
    */ 
    $('.timetable__facility--week').on('change', function(e) {
        var selectedDate = $(this).val();
    
        updateFacilityTimetable(selectedDate); 
    });
});

  
/*
*  Function:   Update booking modal
*  Input:      activity, start time, duration, capacity, location, price, id of activtiy 
*  Output:     Booking modal with new data within
*/ 
function updateBookingModal(activity, start_time, duration, capacity, location, price, id) {
    $('#full-error').addClass('modal__error--d-none'); // hide any errors that could have been shown
    $('#book-activity').css('display', 'inline-block');

    $('#activity').text(activity);
    $('#start_time').text(start_time);
    $('#duration').text(duration);
    $('#capacity').text(capacity);
    $('#location').text(location);
    $('#price').text(price);

    $('#book-activity').attr('href', '/payment/booking/' + id);
}


/*
*  Function:   Show Scroll toggle on scroll down
*  Input:      window location
*  Output:     Show / Hide scroll toggle
*/ 
function showScrollToggle() {
    var self = $(this),
		height = 250,
        top = self.scrollTop(),
        button = $('.scroll-to-top');
    displayTop = top;	
			
	if (displayTop > height){		
		if (!button.is(':visible')){
			button.css('bottom', '0%');
			button.show();
			button.animate({bottom: '5%'}, 300);
		}			
	} else{		
		button.fadeOut();
	}	
}


/*
*  Function:   Update Activity Timetable
*  Input:      Selected date for the timetable
*  Output:     New timetable with activities on the selected date
*/ 
function updateActivityTimetable(selectedDate) {
    $.ajax({
        url: '/ajax/activities/timetable',
        type: 'POST',
        data: {
            'date': selectedDate
        },
        datatype: 'json',
        success: function(data) {
            data = JSON.parse(data);
            replaceHeader('timetable__activity', selectedDate, data);
            replaceOutput('timetable__activity', data);
        },
        error: function(error) {
            alert(error);
        }
    });
}


/*
*  Function:   Update Facility Timetable
*  Input:      Selected date for the timetable
*  Output:     New timetable with activities on the selected date
*/ 
function updateFacilityTimetable(selectedDate) {
    $.ajax ({
        url: '/ajax/facility/timetable',
        type: 'POST',
        data: {
            'id': $('.timetable__id').attr('id'),
            'date': selectedDate
        },
        datatype: 'json',
        success: function(data) {
            data = JSON.parse(data);
            replaceHeader('timetable__facility', selectedDate, data);
            replaceOutput('timetable__facility', data);
        },  
        error: function(error) {
            alert(error);
        }
    });
}


/*
*  Function:   Replace the header dates on the timetable class
*  Input:      Timetable classname
               Selected Date of the timetable
*  Output:     Timetable header to be replaced within the timetable
*/ 
function replaceHeader(className, selectedDate) {
    currentDate = new Date(selectedDate);

    var week = new Array(); 
    currentDate.setDate((currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() == 0 ? -6 : 1)));
    for (var i = 0; i < 7; i++) {
        week.push(new Date(currentDate).toDateString()); 
        currentDate.setDate(currentDate.getDate() +1);
    }

    currentDate = new Date(selectedDate);
    var today = (currentDate.getDay() + (currentDate.getDay() == 0 ? 6 : -1));

    var $newTable = $("<table class=\"timetable__table timetable__table--border " + className + "\"></table>");

    var row = "<tr class=\"table__header\">";
    for (var i = 0; i < week.length; i++) {
        if (i == today) {
            row += "<th class=\"" + className + "--day header__item header__item--selected\">" + week[i] + "</th>";
        } else {
            row += "<th class=\"" + className + "--day header__item hvr-inset\">" + week[i] + "</th>";
        }
    }
    row += "</tr>"

    $newTable.append(row);

    $('.' + className).replaceWith($newTable);
}


/*
*  Function:   Replace the output within the timetable (display activities on selected date)
*  Input:      Timetable classname
               Data activities on selected day
*  Output:     Timetable output to be replaced within the timetable
*/ 
function replaceOutput(className, data) {
    var $newTable = $("<table class=\"timetable__table " + className + "--output\"></table>");

    if (data.results.length > 0) {
        $newTable.append(`
            <tr class="table__header">
            <th class="header__item header__item--time">Time</th>
            <th class="header__item header__item--activity">Activity</th>
            <th class="header__item header__item--duration">Duration</th>
            <th class="header__item header__item--location">Location</th>
            <th class="header__item header__item--book"></th>
            </tr>
        `);

        $.each(data.results, function(key, value) {
            row = "<tr class=\"table__row\"><td class=\"row__item start_time-value\"  data_attr=\"" + value.start_time + "\">" + value.start_time.substr(value.start_time.length - 8) + "</td>";
            row += "<td class=\"row__item activity-value\">" + value.name_sport + "</td>";
            row += "<td class=\"row__item duration-value\">" + value.duration + " Minutes</td>";
            row += "<input type=\"hidden\" class=\"capacity-value\" data_attr=\"" + value.booked_capacity + " / " + value.capacity + "\" />";
            row += "<td class=\"row__item location-value\">" + value.facility_name + "</td>";

            if (value.discount == 0) 
                members = "Free";
            else 
                members = "£" + (value.cost - value.discount);

            if (value.cost == 0) 
                nonMembers = "Free"
            else 
                nonMembers = "£" + value.cost;


            row += "<input type=\"hidden\" class=\"price-value\" value=\"" + members + " for members, " + nonMembers + " for non-members\" />";

            if (value.booked_capacity >= value.capacity) {
                row += "<td class=\"row__item\"><button type=\"button\" disabled class=\"item__book\"><h3>Fully Booked</h3></button></td></tr>";
            } else {
                row += "<td class=\"row__item\"><div data_attr=\"" + value.id + "\" class=\"item__book item__book--book-modal hvr-sweep-to-right modal--open\"><h3>Book</h3></div></td></tr>";
            }
            $newTable.append(row);
        });
    } else {
        $newTable.append(`
            <tr class="table__row">
                <td class="row__item row__item--none">No Activities Found on Selected Date</td>
            </tr>
        `);
    }

    $('.' + className + '--output').replaceWith($newTable);
}