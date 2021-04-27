/*
    pageFunctions.js
        -- javascript front end functions for use in multi-form page forms
        that needs access to cross-functions
        
    Contributers
        -- Samuel Barnes
*/


/*
    *  Function:   Change the current page of the form
    *  Input:      int count:        the current page the form is on
    *              string direction: 'prev' or 'next' for which page to go to
    *              int size:         how many pages are in the form 
    *  Output:     The new page count / the page the form is on
*/
function changePage(count, direction, size) {
    if (direction == "next") {
        $('#slide-' + count).addClass('half__slide--d-none');
        $('#slide-' + (count + 1)).removeClass('half__slide--d-none');
    } else {
        $('#slide-' + (count + 2)).addClass('half__slide--d-none');
        $('#slide-' + (count + 1)).removeClass('half__slide--d-none');
    }
}