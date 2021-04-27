/*
    statistics > main.js
        -- javascript front end functions for providing interation to the user
        on the statistics page (including fetching and replacing data)
        
    Contributers
        -- Samuel Barnes
        -- Diego Calanzone
*/


/*
 *  Function:   Get all activities id to populate dropdown (session)
*/
$.getJSON('/ajax/data/activity/all/', function(result) { 
    // Error check
    if(result.error == undefined && result.activities.length > 0){

        let activities = result.activities;

        // Populate select
        activities.forEach(function(activity){

            $('.a-select')
                .append('<option value="' + activity.id + '">' + activity.name + '</option>')
        });

        // Render first by default
        renderActivity(activities[0].id);
        renderWeeklyActivity(activities[0].id);

        // Enable and trigger
        $('.a-select').prop('disabled', false);
        $('#loader-1').fadeOut();
        $('#loader-2').fadeOut();

    } else {
        // Do something if no activities
        $('.activity-result').css('display', 'none');
    }
});


/*
 *  Function:   Get all facilities id to populate dropdown
*/
$.getJSON('/ajax/data/facility/all/', function(result) { 

    
    // Error check
    if(result.error == undefined && result.facilities.length > 0){

        console.log(result);

        let facilities = result.facilities;

        // Populate select
        facilities.forEach(function(facility){

            $('.a-select-2')
                .append('<option value="' + facility.id + '">' + facility.name + '</option>')
        });

        // Render first by default
        renderFacility(facilities[0].id);
        renderWeeklyFacility(facilities[0].id);

        // Enable and trigger
        $('.a-select-2').prop('disabled', false);
        $('#loader-3').fadeOut();
        $('#loader-4').fadeOut();

    } else {
        console.log("facility is empty");
        $('.facility-result').css('display', 'none');
    }
});


/*
 *  Function:   Get all sports id to populate dropdown (activities)
*/
$.getJSON('/ajax/data/sport/all/', function(result) { 
    
    console.log(result);

    // Error check
    if(result.error == undefined && result.sports.length > 0){

        let sports = result.sports;

        // Populate select
        sports.forEach(function(sport){

            $('.a-select-3')
                .append('<option value="' + sport.id + '">' + sport.name + '</option>')
        });

        // Render first by default
        renderSport(sports[0].id);
        renderWeeklySport(sports[0].id);

        // Enable and trigger
        $('.a-select-3').prop('disabled', false);
        $('#loader-5').fadeOut();
        $('#loader-6').fadeOut();

    } else {
        console.log("sport is empty");
        $('.sport-result').css('display', 'none');
    }
});


/*
 *  Function:   Load login activity
*/
renderWeeklyLoginUsage();
$('#loader-7').fadeOut();


/*
 *  Function:   Login week start change
*/
$('#login-week-start').on('change', function(e) {
    renderWeeklyLoginUsage();
});


/*
 *  Function:   Load week end change
*/
$('#login-week-end').on('change', function(e) {
    renderWeeklyLoginUsage();
});


/*
 *  Function:   Handle overall activity select change
*/
$('#activity-select-1').on('change', function() {
    var id = this.value;
    renderActivity(id);
});


/*
 *  Function:   Handle weekly activity select change
*/
$('#activity-select-2').on('change', function() {
    var id = this.value;
    renderWeeklyActivity(id);
});


/*
 *  Function:   Handle weekly activity week start select change
*/
$('#activity-week-start').on('change', function(e) {
    var id = $('#activity-select-2').val();
    renderWeeklyActivity(id);
});


/*
 *  Function:   Handle weekly activity week end select change
*/
$('#activity-week-end').on('change', function(e) {
    var id = $('#activity-select-2').val();
    renderWeeklyActivity(id);
});


/*
 *  Function:   Handle overall facility select change
*/
$('#facility-select-1').on('change', function() {
    
    var id = this.value;
    renderFacility(id);
});


/*
 *  Function:   Handle weekly facility select change
*/
$('#facility-select-2').on('change', function() {
    
    var id = this.value;
    renderWeeklyFacility(id);
});


/*
 *  Function:   Handle weekly facility week state select change
*/
$('#facility-week-start').on('change', function(e) {
    var id = $('#facility-select-2').val();
    renderWeeklyFacility(id);

});


/*
 *  Function:   Handle weekly facility week end select change
*/
$('#facility-week-end').on('change', function(e) {
    var id = $('#facility-select-2').val();
    renderWeeklyFacility(id);
})


/*
 *  Function:   Handle overall sport select change
*/
$('#sport-select-1').on('change', function() {
    
    var id = this.value;
    renderSport(id);
});


/*
 *  Function:   Handle weekly sport select change
*/
$('#sport-select-2').on('change', function() {
    
    var id = this.value;
    renderWeeklySport(id);
});


/*
 *  Function:   Handle weekly sport start date select change
*/
$('#sport-week-start').on('change', function(e) {
    var id = $('#sport-select-2').val();
    renderWeeklySport(id);
});


/*
 *  Function:   Handle weekly sport end date select change
*/
$('#sport-week-end').on('change', function(e) {
    var id = $('#sport-select-2').val();
    renderWeeklySport(id);
});