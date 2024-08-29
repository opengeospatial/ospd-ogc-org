google.charts.load('current', {'packages':['corechart', 'bar', 'geochart', 'line']});

// Ensure drawing function only runs after library has loaded
google.charts.setOnLoadCallback(function() {
    drawChart(activeUsers);
    drawRegionChart(activeUsers);
    drawTrafficSourcesChart(sessionMedium);
    drawUserChart(usersOverTime);
    drawDeviceCategoryChart(deviceCategory);
    //drawOperatingSystemChart(operatingSystem);
    drawAverageSessionChart(averageSession);
    drawNewVsReturningChart(newVsReturning);

    $('#dateRangeSelector').change(function() {
        var selectedRange = $(this).val();
        $.ajax({
            url: 'analytics_data.php',
            method: 'GET',
            dataType: 'json',
            data: {
                action: 'fetchData',
                startDate: selectedRange,
                endDate: 'today',
                metrics: JSON.stringify(['activeUsers']),
                dimensions: JSON.stringify(['country'])
            },
            success: function(response) {
                drawChart(response);
		            drawRegionChart(response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching data: ', textStatus, errorThrown);
            }
        });
    });
    
    $('#trafficSourcesDateRangeSelector').change(function() {
        var selectedRange = $(this).val();
        $.ajax({
            url: 'analytics_data.php',
            method: 'GET',
            dataType: 'json',
            data: {
                action: 'fetchData',
                startDate: selectedRange,
                endDate: 'today',
                metrics: JSON.stringify(['sessions']),
                dimensions: JSON.stringify(['sessionMedium'])
            },
            success: function(response) {
                drawTrafficSourcesChart(response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching data: ', textStatus, errorThrown);
            }
        });
    });    
    
    $('#userVisitsDateRangeSelector').change(function() {
        var selectedRange = $(this).val();
        $.ajax({
            url: 'analytics_data.php',
            method: 'GET',
            dataType: 'json',
            data: {
                action: 'fetchData',
                startDate: selectedRange,
                endDate: 'today',
                metrics: JSON.stringify(['activeUsers']),
                dimensions: JSON.stringify(['date'])
            },
            success: function(response) {
                drawUserChart(response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching data: ', textStatus, errorThrown);
            }
        });
    });  
    
    $('#deviceCategoryDateRangeSelector').change(function() {
        var selectedRange = $(this).val();
        $.ajax({
            url: 'analytics_data.php',
            method: 'GET',
            dataType: 'json',
            data: {
                action: 'fetchData',
                startDate: selectedRange,
                endDate: 'today',
                metrics: JSON.stringify(['sessions']),
                dimensions: JSON.stringify(['deviceCategory'])
            },
            success: function(response) {
                drawDeviceCategoryChart(response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching data: ', textStatus, errorThrown);
            }
        });
    });     
    
    $('#operatingSystemDateRangeSelector').change(function() {
        var selectedRange = $(this).val();
        $.ajax({
            url: 'analytics_data.php',
            method: 'GET',
            dataType: 'json',
            data: {
                action: 'fetchData',
                startDate: selectedRange,
                endDate: 'today',
                metrics: JSON.stringify(['sessions']),
                dimensions: JSON.stringify(['operatingSystem'])
            },
            success: function(response) {
                drawOperatingSystemChart(response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching data: ', textStatus, errorThrown);
            }
        });
    });     

    $('#averageSessionDurationSelector').change(function() {
        var selectedRange = $(this).val();
        $.ajax({
            url: 'analytics_data.php',
            method: 'GET',
            dataType: 'json',
            data: {
                action: 'fetchData',
                startDate: selectedRange,
                endDate: 'today',
                metrics: JSON.stringify(['averageSessionDuration']),
                dimensions: JSON.stringify(['date'])
            },
            success: function(response) {
                drawAverageSessionChart(response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching data: ', textStatus, errorThrown);
            }
        });
    }); 

    $('#newVsReturningDateRangeSelector').change(function() {
        var selectedRange = $(this).val();
        $.ajax({
            url: 'analytics_data.php',
            method: 'GET',
            dataType: 'json',
            data: {
                action: 'fetchData',
                startDate: selectedRange,
                endDate: 'today',
                metrics: JSON.stringify(['sessions']),
                dimensions: JSON.stringify(['newVsReturning'])
            },
            success: function(response) {
                drawNewVsReturningChart(response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error fetching data: ', textStatus, errorThrown);
            }
        });
    });     
});

function drawChart(dataArray) {
    var data = google.visualization.arrayToDataTable(dataArray);
    
    var options = {
        title: '',
        chartArea: { width: '70%', height: 350},
	      legend: { position: 'none' },
  	    height: 450, // Match the GeoChart height
        hAxis: {
        title: '',
        minValue: 0,
        },
        vAxis: {
            title: '',
        }
    };

    var chart = new google.visualization.BarChart(document.getElementById('visitorsChart'));
    chart.draw(data, options);    
}

function drawRegionChart(dataArray) {
    var data = google.visualization.arrayToDataTable(dataArray);
    
    var options = {
        colorAxis: {colors: ['#add8e6', '#00008b']},
	      height: 500 // Fixed height for consistency
    };

    var chart = new google.visualization.GeoChart(document.getElementById('regionChart'));
    chart.draw(data, options);    
}

function drawTrafficSourcesChart(dataArray) {
    
    // Modify dataArray by replacing "(none)" with "Direct" in the sessionMedium
    for (var i = 1; i < dataArray.length; i++) { // Start at 1 to skip header row
        if (dataArray[i][0] === "(none)") {
            dataArray[i][0] = "Direct"; 
        }
        if (dataArray[i][0] === "referral") {
            dataArray[i][0] = "Referral"; 
        }	
        if (dataArray[i][0] === "organic") {
            dataArray[i][0] = "Organic"; 
        }	        
    }

    var data = google.visualization.arrayToDataTable(dataArray);
    
    var options = {
        title: '',
        chartArea: { width: '70%'},
	      legend: { position: 'none' },
        hAxis: {
            title: '',
            minValue: 0,
        },
        vAxis: {
            title: '',
        }
    };

    var chart = new google.visualization.BarChart(document.getElementById('trafficSourcesChart'));    

    chart.draw(data, options);
}

function drawUserChart(dataArray) {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Active Users');

    var formattedData = dataArray.slice(1).map(function(row) {
        var year = parseInt(row[0].substring(0, 4), 10);
        var month = parseInt(row[0].substring(4, 6), 10) - 1; // JavaScript months are 0-indexed
        var day = parseInt(row[0].substring(6, 8), 10);
        return [new Date(year, month, day), row[1]];
    });

    // Sort by date
    formattedData.sort(function(a, b) {
        return a[0] - b[0];
    });

    formattedData.forEach(function(item) {
        data.addRow(item);
    });

    // Define a custom tick formatter
    var dateFormatter = new google.visualization.DateFormat({pattern: "dd MMM"});
    var ticks = formattedData.map(function(row) {
        return {v: row[0], f: dateFormatter.formatValue(row[0])};
    });
    
    //console.log('ticks: ' + ticks);

    var options = {
        title: '',
        hAxis: {
            title: '',
            format: 'dd MMM',
            gridlines: { count: -1 },
            ticks: ticks // Custom formatted ticks
        },
        vAxis: {
            title: ''
        },
        legend: { position: 'none' },
        chartArea: { width: '80%', height: '70%' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('userVisitsChart'));
    chart.draw(data, options);
}

function drawDeviceCategoryChart(dataArray) {
    var data = google.visualization.arrayToDataTable(dataArray);

    var options = {
        title: '',
        pieHole: 0.4, // This creates the donut effect
        chartArea: { width: '70%', height: '70%' },
        height: 450,
        legend: { position: 'right' }
    };

    var chart = new google.visualization.PieChart(document.getElementById('deviceCategoryChart'));
    chart.draw(data, options);
}

function drawOperatingSystemChart(dataArray) {
    var data = google.visualization.arrayToDataTable(dataArray);

    var options = {
        title: '',
        chartArea: { width: '70%', height: '70%' },
        legend: { position: 'none' },
        height: 450,
        hAxis: {
            title: '', // Adjust according to the metric you are displaying
            minValue: 0,
        },
        vAxis: {
            title: ''
        }
    };

    var chart = new google.visualization.BarChart(document.getElementById('operatingSystemChart'));
    chart.draw(data, options);
}

function drawAverageSessionChart(dataArray) {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Average Session Duration');

    var formattedData = dataArray.slice(1).map(function(row) {
        var year = parseInt(row[0].substring(0, 4), 10);
        var month = parseInt(row[0].substring(4, 6), 10) - 1; // JavaScript months are 0-indexed
        var day = parseInt(row[0].substring(6, 8), 10);
        return [new Date(year, month, day), row[1]];
    });

    // Sort by date
    formattedData.sort(function(a, b) {
        return a[0] - b[0];
    });

    formattedData.forEach(function(item) {
        data.addRow(item);
    });

    // Define a custom tick formatter
    var dateFormatter = new google.visualization.DateFormat({pattern: "dd MMM"});
    var ticks = formattedData.map(function(row) {
        return {v: row[0], f: dateFormatter.formatValue(row[0])};
    });
    
    //console.log('ticks: ' + ticks);

    var options = {
        title: '',
        hAxis: {
            title: '',
            format: 'dd MMM',
            gridlines: { count: -1 },
            ticks: ticks // Custom formatted ticks
        },
        vAxis: {
            title: 'Seconds'
        },
        legend: { position: 'none' },
        chartArea: { width: '80%', height: '70%' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('averageSessionDurationChart'));
    chart.draw(data, options);
}


function drawNewVsReturningChart(dataArray) {
    
    // Modify dataArray by replacing "(none)" with "Direct" in the sessionMedium
    for (var i = 1; i < dataArray.length; i++) { // Start at 1 to skip header row
        if (dataArray[i][0] === "(not set)") {
            dataArray[i][0] = "unspecified"; 
        }	        
    }

    var data = google.visualization.arrayToDataTable(dataArray);
    
    var options = {
        title: '',
        chartArea: { width: '70%'},
	      legend: { position: 'none' },
        hAxis: {
            title: '',
            minValue: 0,
        },
        vAxis: {
            title: '',
        }
    };

    var chart = new google.visualization.BarChart(document.getElementById('newVsReturningChart'));    

    chart.draw(data, options);
}
