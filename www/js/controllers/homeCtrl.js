var refreshGlobal = null;
app.controller('homeCtrl',function($scope,$timeout,Service) { 

  ///////////////////////REFRESHER/////////////////////////////
  $scope.doRefresh = function() {
    
    $timeout( function() {
      //simulate async response
      Service.getRankAll().then(function(data){
      $scope.ranks = data.data;
      });
      Service.getRankWeek().then(function(data){
      $scope.ranksW = data.data;
      });

    //Compliance Vertical Chart
    Service.getCo().then(function(data){
    $scope.barChart1.data = data.data;
    });
    
    //Pie
    Service.getPie().then(function(data){
    $scope.pieChrt.data = data.data;
    });

    Service.getPie1().then(function(data){
    $scope.pieChart.data = data.data;
    });
    
    //  Horizontal
    Service.getHorizontal().then(function(data){
    $scope.horizontal.data = data.data;
    });

    //  Vertical
    Service.getVertical().then(function(data){
    $scope.barChart.data = data.data;
    });

    //Donut
    Service.getDon().then(function(data){
    $scope.donut.data = data.data;
    });
//Algo
    Service.getCompli().then(function(data){
    $scope.comp = data.data;
    });


    ////

     Service.getBarPercentage().then(function(data){
        $scope.horizontal1.data = data.data;
        var rS = data.data[0].values;

        var total   = 0;
        var counter = 0;
        var prediction = "";

        for (var i = 0; i < rS.length; i++) {
            if (i != 0 && rS[i].value == 0) {
                break;
            }
            else {
                total += rS[i].value;
                counter += 1;
            }
        }

        if (total / counter >= 0.5) {
            prediction = "perform well";
        }
        else {
            prediction = "needs assessment (possible failure)";
        }

        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        document.getElementById("prediction").innerHTML = "This <u>" + monthNames[counter] + "</u> predicted performance indicates that it will <b>" + prediction + "</b> based on previous results";
        

        });
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };



  refreshGlobal = $scope.doRefresh1;
///////////////////////////////////////////////////////////

//Table of ranks
    Service.getRankAll().then(function(data){
    $scope.ranks = data.data;
    });
    Service.getRankWeek().then(function(data){
    $scope.ranksW = data.data;
    });
//////////////////////////////////////////////


//Algo
    Service.getCompli().then(function(data){
    $scope.comp = data.data;
    });
////////////////////////////////////////////////////////




//CHARTS SHITS


//PIE CHART
/////////////////////////////////////////////////////////////
        $scope.pieChrt = {};
        $scope.pieChrt.options = {
           chart: {
               type: 'pieChart',
               height: 500,
               x: function(d){return d.key;},
               y: function(d){return d.y;},
               showLabels: true,
               duration: 500,
               legend: {
                        margin: {
                            top: 5,
                            right: 20,
                            bottom: 5,
                            left: 0
                        }
                    },
               labelThreshold: 0.01,
               labelType: 'percent',
               valueFormat: function(d) {
               return d3.format(',2f')(d);
               }
           }
       };

  //Pie
    Service.getPie().then(function(data){
    $scope.pieChrt.data = data.data;
    });

////////////////////////////////////////////////////////////

//Horizontal
$scope.horizontal = {};
$scope.horizontal.options = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 450,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                duration: 500,
                xAxis: {
                    showMaxMin: false
                    },
                    yAxis: {
                        axisLabel: 'Values',
                        tickFormat: function(d){
                            return d3.format(',2f')(d);
                        }
                    }
            }
        };

//  Horizontal
    Service.getHorizontal().then(function(data){
    $scope.horizontal.data = data.data;
    });


///////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////////////////////////       

//END LINE//////////////////


///stacked

   var chart = nv.models.multiBarChart();
d3.select('#chart svg').datum([
  {
    key: "S1",
    color: "#51A351",
    values:
    [      
      { x : "A", y : 40 },
      { x : "B", y : 30 },
      { x : 5,   y : 20 }  
    ]
  },
  {
    key: "S2",
    color: "#BD362F",
    values:
    [      
      { x : "A", y : 60 },
      { x : "B", y : 50 },
      { x : 5,   y : 70 } 
    ]
  }
]).transition().duration(500).call(chart);

//Donut
    $scope.donut = {};
    $scope.donut.options = {
                chart: {
                    type: 'pieChart',
                    height: 450,
                    donut: true,
                    x: function(d){return d.key;},
                    y: function(d){return d.y;},
                    showLabels: true,
                    labelType: 'percent',
                   valueFormat: function(d) {
                   return d3.format(',2f')(d);
                   },

                    pie: {
                        startAngle: function(d) { return d.startAngle},
                        endAngle: function(d) { return d.endAngle }
                    },
                    duration: 500,
                    legend: {
                        margin: {
                            top: 5,
                            right: 20,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };
    //Donut
        Service.getDon().then(function(data){
        $scope.donut.data = data.data;
        });
/////////


//bar chart
$scope.barChart = {};
$scope.barChart.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'Parameters Inspected'
                },
                yAxis: {
                    axisLabel: 'Frequency',
                    axisLabelDistance: -10
                }
            }
        };
//  Vertical
    Service.getVertical().then(function(data){
    $scope.barChart.data = data.data;
    });

////////////////////////////////////////////////////////////////////////////



//Compliance chart
$scope.barChart1 = {};
$scope.barChart1.options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 55
                },
                x: function(d){return d.labels;},
                y: function(d){return d.value1;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: 'Compliances'
                },
                yAxis: {
                    axisLabel: 'Frequency',
                    axisLabelDistance: -10
                }
            }
        };
//  data
    Service.getCo().then(function(data){
    $scope.barChart1.data = data.data;
    });

////////////////////////////////////////////////////////////////////////////



//PIE CHART
/////////////////////////////////////////////////////////////
        $scope.pieChart = {};
        $scope.pieChart.options = {
           chart: {
               type: 'pieChart',
               height: 500,
               x: function(d){return d.key;},
               y: function(d){return d.y;},
               showLabels: true,
               labelType: 'percent',
               color: (['#04FD00', 'red']),
               valueFormat: function(d) {
               return d3.format(',2f')(d);
               },
               legend: {
                        margin: {
                            top: 40,
                            right: 10,
                            bottom: 5,
                            left: 0
                        }
                    }
           }
       };
    Service.getPie1().then(function(data){
    $scope.pieChart.data = data.data;
    });
    
////////////////////////
//Horizontal in Monitoring
$scope.horizontal1 = {};
$scope.horizontal1.options = {
            chart: {
                type: 'multiBarHorizontalChart',
                height: 450,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                duration: 500,
                xAxis: {
                    showMaxMin: false
                    },
                    yAxis: {
                        axisLabel: 'Values',
                        tickFormat: function(d){
                            return d3.format(',2f')(d);
                        }
                    }
            }
        };

        //  Data
        Service.getBarPercentage().then(function(data){
        $scope.horizontal1.data = data.data;
        var rS = data.data[0].values;

        var total   = 0;
        var counter = 0;
        var prediction = "";

        for (var i = 0; i < rS.length; i++) {
            if (i != 0 && rS[i].value == 0) {
                break;
            }
            else {
                total += rS[i].value;
                counter += 1;
            }
        }

        if (total / counter >= 0.5) {
            prediction = "perform well";
        }
        else {
            prediction = "needs assessment (possible failure)";
        }

        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        document.getElementById("prediction").innerHTML = "This <u>" + monthNames[counter] + "</u> predicted performance indicates that it will <b>" + prediction + "</b> based on previous results";
        

        });
        
        // $scope.horizontal1.data = 
        // [
        //     {
        //         key: "Cumulative Return",
        //         values: [
        //             {
        //                 "label" : "JAN" ,
        //                 "value" : 29.765957771107
        //             } ,
        //             {
        //                 "label" : "FEB" ,
        //                 "value" : 20
        //             } ,
        //             {
        //                 "label" : "MAR" ,
        //                 "value" : 32.807804682612
        //             } ,
        //             {
        //                 "label" : "APR" ,
        //                 "value" : 0
        //             } ,
        //             {
        //                 "label" : "MAY" ,
        //                 "value" : 0
        //             } ,
        //             {
        //                 "label" : "JUN" ,
        //                 "value" : 0
        //             } ,
        //             {
        //                 "label" : "JUL" ,
        //                 "value" : 0
        //             } ,
        //             {
        //                 "label" : "AUG" ,
        //                 "value" : 0
        //             },
        //             {
        //                 "label" : "SEP" ,
        //                 "value" : 0
        //             } ,
        //             {
        //                 "label" : "OCT" ,
        //                 "value" : 0
        //             } ,
        //             {
        //                 "label" : "NOV" ,
        //                 "value" : 0
        //             } ,
        //             {
        //                 "label" : "DEC" ,
        //                 "value" : 0
        //             } 
        //         ]
        //     }
        // ]
///////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//


;























})