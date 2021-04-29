gapi.analytics.ready(function() {

    // init

    // Step 3: Authorize the user.

    var CLIENT_ID = '302333126777-h88e8uomqbdkli3qimnf66jt5u9k48jb.apps.googleusercontent.com';

    gapi.analytics.auth.authorize({
        container: 'auth-button',
        clientid: CLIENT_ID,
    });

    // Step 4: Create the view selector.

    var viewSelector = new gapi.analytics.ViewSelector({
        container: 'view-selector'
    });

    // Step 6: Hook up the components to work together.

    gapi.analytics.auth.on('success', function(response) {
        viewSelector.execute();
    });

    viewSelector.on('change', function(ids) {
        var newIds = {
            query: {
                ids: ids
            }
        }
        // var viewIdGa = newIds.query.ids;
        // var viewIdValue = viewIdGa.str.replace("ga:", "");
        var viewId = newIds.query.ids.replace("ga:", "");

        // Replace with your view ID.
        var VIEW_ID = viewId;

        // Display circle diagram browsers and number of visits statistics
        function queryCircle() {
            gapi.client.request({
                path: '/v4/reports:batchGet',
                root: 'https://analyticsreporting.googleapis.com/',
                method: 'POST',
                body: {
                    reportRequests: [
                        {
                            viewId: VIEW_ID,
                            dateRanges: [
                                {
                                    startDate: '30daysAgo',
                                    endDate: 'today'
                                }
                            ],
                            "metrics":[
                                {
                                    "expression":"ga:sessions"
                                }],
                            "dimensions": [
                                {
                                    "name":"ga:browser"
                                }]
                        }
                    ]
                }
            }).then(circleDiagramData, console.error.bind(console));
        }
        function circleDiagramData(response) {
            var totals = response.result.reports[0].data.totals[0].values[0];
            var data = [];
            response.result.reports[0].data.rows.forEach(function(item){
                var dataObject = {
                    name: item.dimensions[0],
                    y: ((item.metrics[0].values[0]) * 100)/totals
                }
                data.push(dataObject);
            });

            // Build the chart
            Highcharts.chart('container-browsers', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Number of sessions by browser'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Browsers',
                    colorByPoint: true,
                    data: data
                }]
            });
        }
        queryCircle();

        // Display circle diagram browsers and number of visits statistics
        function queryCircleDevices() {
            gapi.client.request({
                path: '/v4/reports:batchGet',
                root: 'https://analyticsreporting.googleapis.com/',
                method: 'POST',
                body: {
                    reportRequests: [
                        {
                            viewId: VIEW_ID,
                            dateRanges: [
                                {
                                    startDate: '30daysAgo',
                                    endDate: 'today'
                                }
                            ],
                            "metrics":[
                                {
                                    "expression":"ga:sessions"
                                }],
                            "dimensions": [
                                {
                                    "name":"ga:deviceCategory"
                                }]
                        }
                    ]
                }
            }).then(circleDiagramDevicesData, console.error.bind(console));
        }
        function circleDiagramDevicesData(response) {
            var totals = response.result.reports[0].data.totals[0].values[0];
            var data = [];
            response.result.reports[0].data.rows.forEach(function(item){
                var dataObject = {
                    name: item.dimensions[0],
                    y: ((item.metrics[0].values[0]) * 100)/totals
                }
                data.push(dataObject);
            });

            // Build the chart
            Highcharts.chart('container-devices', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Number of sessions by device'
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series: [{
                    name: 'Devices',
                    colorByPoint: true,
                    data: data
                }]
            });
        }
        queryCircleDevices();


        // Display map diagram number of visits by countries
        function queryMap() {
            gapi.client.request({
                path: '/v4/reports:batchGet',
                root: 'https://analyticsreporting.googleapis.com/',
                method: 'POST',
                body: {
                    reportRequests: [
                        {
                            viewId: VIEW_ID,
                            "dimensions": [
                                {
                                    "name":"ga:country"
                                },
                                {
                                    "name":"ga:countryIsoCode"
                                }]
                        }
                    ]
                }
            }).then(mapDiagramData, console.error.bind(console));
        }
        function mapDiagramData(response) {
            var data = [];
            response.result.reports[0].data.rows.forEach(function(item){
                var dataObject = {
                    code: item.dimensions[1],
                    value: item.metrics[0].values[0],
                    name: item.dimensions[0]
                }
                data.push(dataObject);
            });

            Highcharts.mapChart('container', {
                chart: {
                    map: 'custom/world',
                    borderWidth: 1
                },

                colors: ['rgba(19,64,117,0.05)', 'rgba(19,64,117,0.2)', 'rgba(19,64,117,0.4)',
                    'rgba(19,64,117,0.5)', 'rgba(19,64,117,0.6)', 'rgba(19,64,117,0.8)', 'rgba(19,64,117,1)'],

                title: {
                    text: 'Number of sessions per country'
                },

                mapNavigation: {
                    enabled: true
                },

                legend: {
                    title: {
                        text: 'Number of sessions per country',
                        style: {
                            color: ( // theme
                                Highcharts.defaultOptions &&
                                Highcharts.defaultOptions.legend &&
                                Highcharts.defaultOptions.legend.title &&
                                Highcharts.defaultOptions.legend.title.style &&
                                Highcharts.defaultOptions.legend.title.style.color
                            ) || 'black'
                        }
                    },
                    align: 'left',
                    verticalAlign: 'bottom',
                    floating: true,
                    layout: 'vertical',
                    valueDecimals: 0,
                    backgroundColor: ( // theme
                        Highcharts.defaultOptions &&
                        Highcharts.defaultOptions.legend &&
                        Highcharts.defaultOptions.legend.backgroundColor
                    ) || 'rgba(255, 255, 255, 0.85)',
                    symbolRadius: 0,
                    symbolHeight: 14
                },

                colorAxis: {
                    dataClasses: [{
                        to: 3
                    }, {
                        from: 3,
                        to: 10
                    }, {
                        from: 10,
                        to: 30
                    }, {
                        from: 30,
                        to: 100
                    }, {
                        from: 100,
                        to: 300
                    }, {
                        from: 300,
                        to: 1000
                    }, {
                        from: 1000
                    }]
                },

                series: [{
                    data: data,
                    joinBy: ['iso-a2', 'code'],
                    animation: true,
                    name: 'Numbers of users',
                    states: {
                        hover: {
                            color: '#a4edba'
                        }
                    },
                    shadow: false
                }]
            });
        }
        queryMap();

        // Display number of visits diagram
        function queryDailyVisits() {
            gapi.client.request({
                path: '/v4/reports:batchGet',
                root: 'https://analyticsreporting.googleapis.com/',
                method: 'POST',
                body: {
                    reportRequests: [{
                        dateRanges: [
                            {
                                startDate: '30daysAgo',
                                endDate: 'yesterday'
                            }
                        ],
                        viewId: VIEW_ID,
                        metrics: [{ expression: "ga:users" }],
                        dimensions: [{name: 'ga:date'}]
                    }]
                }
            }).then(dailyVisitsDiagramData, console.error.bind(console));
        }
        function getMillisecondsTime(dateValue) {
            var year = dateValue.substring(0, 4);
            var month = dateValue.substring(4, 6);
            var day = dateValue.substring(6, 8);
            var displayDate = year + '-' + month + '-' + day;
            date = new Date(displayDate);
            return date;
        }
        function dailyVisitsDiagramData(response) {
            var data = [];
            var startDateY = getMillisecondsTime(response.result.reports[0].data.rows[0].dimensions[0]);
            var startDate = getMillisecondsTime(response.result.reports[0].data.rows[0].dimensions[0]).getTime();

            for(var i=0;i<response.result.reports[0].data.rows.length;i++) {
                if(startDate == getMillisecondsTime(response.result.reports[0].data.rows[i].dimensions[0]).getTime()) {
                    data.push(response.result.reports[0].data.rows[i].metrics[0].values[0] * 1);
                    startDate = getMillisecondsTime(response.result.reports[0].data.rows[i].dimensions[0]).getTime();
                    startDate = startDate + 86400000;
                } else {
                    data.push(0);
                    startDate = startDate + 86400000;
                    i--;
                }
            }

            // Build the chart
            Highcharts.chart('container-daily', {

                title: {
                    text: 'Number Of Users'
                },

                yAxis: {
                    title: {
                        text: 'Number of Sessions'
                    }
                },
                xAxis: {
                    type: 'datetime'
                },

                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle'
                },

                plotOptions: {
                    series: {
                        lineWidth: 4,
                        states: {
                            hover: {
                                lineWidth: 5
                            }
                        },
                        marker: {
                            enabled: true
                        },
                        pointInterval: 3600000*24, // one day
                        pointStart: Date.UTC(startDateY.getFullYear(), startDateY.getMonth(), startDateY.getDate(), 0, 0, 0)
                    }
                },

                series: [{
                    data: data
                }],

                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 500
                        },
                        chartOptions: {
                            legend: {
                                layout: 'horizontal',
                                align: 'center',
                                verticalAlign: 'bottom'
                            }
                        }
                    }]
                }

            });
        }
        queryDailyVisits();

        // Display sessions information
        function querySessionInfo() {
            gapi.client.request({
                path: '/v4/reports:batchGet',
                root: 'https://analyticsreporting.googleapis.com/',
                method: 'POST',
                body: {
                    reportRequests: [
                        {
                            viewId: VIEW_ID,
                            dateRanges: [
                                {
                                    startDate: '30daysAgo',
                                    endDate: 'today'
                                }
                            ],
                            "metrics":[
                                {
                                    "expression":"ga:avgSessionDuration"
                                },{
                                    "expression":"ga:percentNewSessions"
                                },{
                                    "expression":"ga:bounceRate"
                                },{
                                    "expression":"ga:sessions"
                                },{
                                    "expression":"ga:pageviewsPerSession"
                                },{
                                    "expression":"ga:goalCompletionsAll"
                                }
                            ]
                        }
                    ]
                }
            }).then(sessionInfoData, console.error.bind(console));
        }
        function sessionInfoData(response) {
            document.getElementById('avgSessionDuration').innerHTML = Math.floor(response.result.reports[0].data.rows[0].metrics[0].values[0]);
            document.getElementById('percentNewSessions').innerHTML = Math.floor(response.result.reports[0].data.rows[0].metrics[0].values[1]);
            document.getElementById('bounceRate').innerHTML = Math.floor(response.result.reports[0].data.rows[0].metrics[0].values[2]);
            document.getElementById('sessions').innerHTML = Math.floor(response.result.reports[0].data.rows[0].metrics[0].values[3]);
            document.getElementById('pageviewsPerSession').innerHTML = Math.floor(response.result.reports[0].data.rows[0].metrics[0].values[4]);
            document.getElementById('goalCompletionsAll').innerHTML = Math.floor(response.result.reports[0].data.rows[0].metrics[0].values[5]);
        }
        querySessionInfo();

    });
});
