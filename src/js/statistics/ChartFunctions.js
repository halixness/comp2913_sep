/*
    statistics > chatFunctions.js
        -- functions for getting data to populate the charts; weekly, monthly
        and overall
        
    Contributers
        -- Samuel Barnes
        -- Diego Calanzone
*/


/*
*  Function:   Form date
*  Input:      date
*  Output:     date: year, month, day
*/
function formatDate(date) {

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

/*
 *  Function:   Init chart with report
*/
function overallActivityChart(elements){

    // Data preprocessing
    var dates = [];
    var users = [];

    elements.forEach(function(val){

        // Date formatting
        let date = new Date(val.purchase_date);
        let dateStr = formatDate(date);

        // Data
        users.push(val.users);
        dates.push(["£" + val.income, dateStr]);
    });

    // Chart
    var ctx = document.getElementById('single-activity-usage').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '# of users per booking day',
                data: users,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0
                    }
                }],

                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0,
                    }
                }]
            }
        },
        plugins: [{
            beforeDraw: function(c) {
               var chartHeight = c.chart.height;
               c.scales['y-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 13);
               c.scales['x-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 12);
            }
        }],
        onAnimationComplete: function () {

            var ctx = this.chart.ctx;
            ctx.font = this.scale.font;
            ctx.fillStyle = this.scale.textColor
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
    
            this.datasets.forEach(function (dataset) {
                dataset.bars.forEach(function (bar) {
                    ctx.fillText(bar.value, bar.x, bar.y - 5);
                });
            })
        }
    });
}

/*
 *  Function:   Init chart with report
*/
function overallFacilityChart(elements){

    // Data preprocessing
    var dates = [];
    var users = [];
    elements.forEach(function(val){

        // Date formatting
        let date = new Date(val.purchase_date);
        let dateStr = formatDate(date);

        // Data
        users.push(val.users);
        dates.push(["£" + val.income, dateStr]);
    });

    // Chart
    var ctx = document.getElementById('single-facility-usage').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '# of users per booking day',
                data: users,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0
                    }
                }],

                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0,
                    }
                }]
            }
        },
        plugins: [{
            beforeDraw: function(c) {
               var chartHeight = c.chart.height;
               c.scales['y-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 13);
               c.scales['x-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 12);
            }
        }]
    });
}

/*
 *  Function:   Init chart with report
*/
function overallSportChart(elements){

    // Data preprocessing
    var dates = [];
    var users = [];
    elements.forEach(function(val){

        // Date formatting
        let date = new Date(val.purchase_date);
        let dateStr = formatDate(date);

        // Data
        users.push(val.users);
        dates.push(["£" + val.income, dateStr]);
    });

    // Chart
    var ctx = document.getElementById('single-sport-usage').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '# of users per booking day',
                data: users,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0
                    }
                }],

                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0,
                    }
                }]
            }
        },
        plugins: [{
            beforeDraw: function(c) {
               var chartHeight = c.chart.height;
               c.scales['y-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 13);
               c.scales['x-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 12);
            }
        }]
    });
}

/*
 *  Function:   Init chart with report
*/
function weeklySportChart(elements){

    // Data preprocessing
    var dates = [];
    var users = [];
    elements.forEach(function(val){

        // Date formatting
        let date = new Date(val.purchase_date);
        let dateStr = formatDate(date);

        // Data
        users.push(val.users);
        dates.push(["£" + val.income, dateStr]);
    });

    // Chart
    var ctx = document.getElementById('weekly-sport-usage').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '# of users per booking day',
                data: users,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0
                    }
                }],

                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0,
                    }
                }]
            }
        },
        plugins: [{
            beforeDraw: function(c) {
               var chartHeight = c.chart.height;
               c.scales['y-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 13);
               c.scales['x-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 12);
            }
        }]
    });
}


/*
 *  Function:   Init chart with report
*/
function weeklyActivityChart(elements){

    // Data preprocessing
    var dates = [];
    var users = [];
    elements.forEach(function(val){

        // Date formatting
        let date = new Date(val.purchase_date);
        let dateStr = formatDate(date);

        // Data
        users.push(val.users);
        dates.push(["£" + val.income , dateStr]);
    });

    // Chart
    var ctx = document.getElementById('weekly-activity-usage').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '# of users per booking day',
                data: users,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0
                    }
                }],

                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0,
                    }
                }],
            }
        },
        plugins: [{
            beforeDraw: function(c) {
               var chartHeight = c.chart.height;
               c.scales['y-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 13);
               c.scales['x-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 12);
            }
        }]
    });
}

/*
 *  Function:   Init chart with report
*/
function weekLoginChart(elements){

    // Data preprocessing
    var dates = [];
    var users = [];
    elements.forEach(function(val){

        // Date formatting
        let date = val.day + "/" + val.month + "/" + val.year;

        // Data
        users.push(val.users);
        dates.push([date]);
    });

    // Chart
    var ctx = document.getElementById('weekly-login-usage').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '# of users per active day',
                data: users,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0
                    }
                }],

                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0,
                    }
                }]
            }
        },
        plugins: [{
            beforeDraw: function(c) {
               var chartHeight = c.chart.height;
               c.scales['y-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 13);
               c.scales['x-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 12);
            }
        }]
    });
}

/*
 *  Function:   Init chart with report
*/
function weeklyFacilityChart(elements){

    // Data preprocessing
    var dates = [];
    var users = [];

    console.log(elements);

    elements.forEach(function(val){

        // Date formatting
        let date = new Date(val.purchase_date);
        let dateStr = formatDate(date);

        // Data
        users.push(val.users);
        dates.push(["£" + val.income, dateStr]);
    });

    // Chart
    var ctx = document.getElementById('weekly-facility-usage').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            
            datasets: [{
                label: '# of users per booking day',
                data: users,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0
                    }
                }],

                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        fontSize: 11,
                        fontStyle: "bold",
                        precision: 2,
                        suggestedMin: 0,
                    }
                }]
            }
        },
        plugins: [{
            beforeDraw: function(c) {
               var chartHeight = c.chart.height;
               c.scales['y-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 13);
               c.scales['x-axis-0'].options.ticks.fontSize = Math.min(chartHeight * 6 / 100, 12);
            }
        }]
    });
}

/*
 *  Function:   Reload chart on input
*/
function renderActivity(id){
    
    // Render
    $.getJSON('/ajax/report/overall/activity/' + id, function(result) { 

        // Error check
        if(result.error == undefined){

            // Render
            let reports = result.results;
            overallActivityChart(reports);
        } else 
            alert("Error retrieving weekly data for session.")
    }); 
}

/*
 *  Function:   Reload chart on input
*/
function renderWeeklyActivity(id){

    var start = $('#activity-week-start').val();
    var end = $('#activity-week-end').val();

    // Query
    $.ajax({
        type: "POST",
        url: "/ajax/report/weekly/activity/",
        data: JSON.stringify({

            id: id,
            start: start,
            end: end
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            
            // Error check
            if(result.error == undefined){

                // Render
                let reports = result.results;
                weeklyActivityChart(reports);
            
            } else            
                alert("Error retrieving weekly data for session.")

        // Error
        },
        error: function (request, status, errorThrown) {

            alert("Error retrieving weekly data for session.")
        }
    });
}

/*
 *  Function:   Reload chart on input
*/
function renderFacility(id){
    
    // Render
    $.getJSON('/ajax/report/overall/facility/' + id, function(result) { 

        // Error check
        if(result.error == undefined){

            // Render
            let reports = result.results;
            overallFacilityChart(reports);
        } else 
            alert("Error retrieving weekly data for facility.")
    }); 
}

/*
 *  Function:   Reload chart on input
*/
function renderWeeklyFacility(id){

    var start = $('#facility-week-start').val();
    var end = $('#facility-week-end').val();

    // Query
    $.ajax({
        type: "POST",
        url: "/ajax/report/weekly/facility/",
        data: JSON.stringify({

            id: id,
            start: start,
            end: end
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            
            // Error check
            if(result.error == undefined){

                // Render
                let reports = result.results;
                weeklyFacilityChart(reports);
            
            } else            
                alert("Error retrieving weekly data for facility.")

        // Error
        },
        error: function (request, status, errorThrown) {

            alert("Error retrieving weekly data for facility.")
        }
    });
}

/*
 *  Function:   Reload chart on input
*/
function renderSport(id){
    
    // Render
    $.getJSON('/ajax/report/overall/sport/' + id, function(result) { 

        // Error check
        if(result.error == undefined){

            // Render
            let reports = result.results;
            overallSportChart(reports);
        } else {
            // TODO: RENDER THAT THERE IS NO DATA TO SHOW INSTEAD OF ERROR
            alert("Error retrieving weekly data for activity.")
        }
    }); 
}

/*
 *  Function:   Reload chart on input
*/
function renderWeeklySport(id){

    var start = $('#sport-week-start').val();
    var end = $('#sport-week-end').val();

    // Query
    $.ajax({
        type: "POST",
        url: "/ajax/report/weekly/sport/",
        data: JSON.stringify({

            id: id,
            start: start,
            end: end
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            
            // Error check
            if(result.error == undefined){

                // Render
                let reports = result.results;
                weeklySportChart(reports);
            
            } else {    
                // TODO: RENDER THAT THERE IS NO DATA TO SHOW INSTEAD OF ERROR
                alert("Error retrieving weekly data for activity.")
            }

        // Error
        },
        error: function (request, status, errorThrown) {

            alert("Error retrieving weekly data for activity.")
        }
    });
}

/*
 *  Function:   Reload chart on input
*/
function renderWeeklyLoginUsage(){

    var start = $('#login-week-start').val();
    var end = $('#login-week-end').val();

    console.log(start, end);

    

    // Query
    $.ajax({
        type: "POST",
        url: "/ajax/report/usage/weekly/",
        data: JSON.stringify({

            start: start,
            end: end
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {

            console.log(result.results);
            
            // Error check
            if(result.error == undefined){

                // Render
                let reports = result.results;
                weekLoginChart(reports);
            
            } else            
                alert("Error retrieving weekly data for general usage.")

        // Error
        },
        error: function (request, status, errorThrown) {

            alert("Error retrieving weekly data for general usage.")
        }
    });
}