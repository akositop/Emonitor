  // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('app', ['ionic','ngCordova','ionic-material','nvd3'])

.config(function ($ionicConfigProvider, $sceDelegateProvider, $compileProvider) {
  
  $ionicConfigProvider.backButton.text('').previousTitleText(false);
  $sceDelegateProvider.resourceUrlWhitelist([ 'self','*://www.youtube.com/**', '*://player.vimeo.com/video/**']);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|content|blob‌​|ms-appx|ms-appdata|x-wmapp0|unsafe|local):|data:image\//);
})



.run(function($ionicPlatform,$ionicHistory,$state,$ionicPopup,$location, $rootScope, Data) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    //if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
    //  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    //  cordova.plugins.Keyboard.disableScroll(true);
    //}
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    if(window.Connection) {
                if(navigator.connection.type == Connection.NONE) {
                    $ionicPopup.confirm({
                        title: "No Internet Connection",
                        content: "No internet Connection on your device."
                    })
                    .then(function(result) {
                        if(!result) {
                            ionic.Platform.exitApp();
                        }
                    });
                }
            }

  });

  $ionicPlatform.registerBackButtonAction(function (event) {
        event.preventDefault();
        if ($state.current.name == "login") {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Exit',
            template: 'Confirm Exit'
          });
 
          confirmPopup.then(function (res) {
            if (res) {
              navigator.app.exitApp();
            }
 
          });
        } else {
          //navigator.app.backHistory();
          $ionicHistory.nextViewOptions({ disableBack: true });
          $state.go('menu.top5');
        }
      }, 800);
  

$rootScope.$on('$stateChangeStart', function (event,toState) {

      Data.get('session').then(function (results) {
      //window.alert("OLA at data.get(session)");
      $rootScope.authenticated = false;
      if (results.user_id) {
        //window.alert(results.user_name);
        // var nextUrl1 = next.$$route.originalPath;
        // if (nextUrl1 == '/login') {
        //   // $location.path("/user-list");
        //    window.alert("OLAAA at getSession");
        // }

        $rootScope.authenticated = true;
        $rootScope.user_id = results.user_id;
        $rootScope.user_name = results.user_name;
        $rootScope.farms_desc = results.farms_desc;
        $rootScope.farms_id = results.farms_id;
        $rootScope.position_desc = results.position_desc;
        $rootScope.ua_username = results.ua_username;
        $rootScope.user_img = results.user_img;
        //window.alert("rootscope.username " + $rootScope.user_name);
        $rootScope.hideit = false;
      }
      else {
        // var nextUrl = next.$$route.originalPath;
        // if (nextUrl == '/login') {

        // } else {
          // $location.path("/login");
          // window.alert("OLAAA at getSession else ." + results.user_id);
        //}
        $rootScope.hideit = true;
      }
    });




    // $rootScope.title = current.$$route.title;
  });
  
})


.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}])


.directive('nullIsUndefined', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function postLink(scope, elem, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (newViewValue) {
                if (newViewValue === null) {
                    newViewValue = undefined;
                }
                return newViewValue;
            });
        }
    };
})



 .directive('textarea', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attr){
        var update = function(){
            element.css("height", "auto");
            var height = element[0].scrollHeight; 
            element.css("height", element[0].scrollHeight + "px");
        };
        scope.$watch(attr.ngModel, function(){
            update();
        });
    }
  };
})

    .directive('checkImage', function($http) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                attrs.$observe('ngSrc', function(ngSrc) {
                    $http.get(ngSrc).success(function(){
                        alert('image exist');
                    }).error(function(){
                        alert('image not exist');
                        element.attr('src', 'img/unifrutti.jpg'); // set default image
                    });
                });
            }
        };
    })


/*
  This directive is used to open regular and dynamic href links inside of inappbrowser.
*/
.directive('hrefInappbrowser', function() {
  return {
    restrict: 'A',
    replace: false,
    transclude: false,
    link: function(scope, element, attrs) {
      var place = attrs['hrefInappbrowser'] || '_system';
      element.bind('click', function (event) {

        var href = event.currentTarget.href;

        window.open(href, place, 'location=yes');

        event.preventDefault();
        event.stopPropagation();

      });
    }
  };
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

//routing
  $stateProvider
 // view
   .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'menuCtrl'
    })
  .state('menu.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl'
        }
      }
    })
   
  .state('menu.healthAndSafety', {
      url: '/hands/id=:handsID',
      views: {
        'menuContent': {
          templateUrl: 'templates/healthAndSafety.html',
          controller: 'healthAndSafetyCtrl',
          resolve: {
           hands: function(Service, $stateParams){
            // var userID = $state.current.params.userID;
            // return Service.getUser(userID);
          //   console.log("yawa1");
          return Service.getEnvi($stateParams.enviID);
          }
         }
        }
      }
    })
  .state('menu.environment', {
      url: '/envi/id=:enviID',
      views: {
        'menuContent': {
          templateUrl: 'templates/environment.html',
          controller: 'environmentCtrl',
          resolve: {
           envi: function(Service, $stateParams){
            // var userID = $state.current.params.userID;
            // return Service.getUser(userID);
          //   console.log("yawa1");
          return Service.getEnvi($stateParams.enviID);
          }
         }  
        }
      }
    })

  .state('menu.rate', {
      url: '/rate/id=:enviID',
      views: {
        'menuContent': {
          templateUrl: 'templates/rate.html',
          controller: 'environmentCtrl',
          resolve: {
          envi: function(Service, $stateParams){
          return Service.getEnvi($stateParams.enviID);
          }
        }
        }
      }
    })

.state('menu.updateHandsReport', {
      url: '/UHR/id=:handsID',
      views: {
        'menuContent': {
          templateUrl: 'templates/updateHandsReport.html',
          controller: 'healthAndSafetyCtrl',
          resolve: {
          hands: function(Service, $stateParams){
          return Service.hands($stateParams.handsID);
          }
        }
        }
      }
    })

 .state('menu.register', {
      url: '/reg/id=:userID',
      views: {
        'menuContent': {
          templateUrl: 'templates/register.html',
          controller: 'registerCtrl',
          resolve: {
           user: function(Service, $stateParams){
            // var userID = $state.current.params.userID;
            // return Service.getUser(userID);
          return Service.getUser($stateParams.userID);
          }
         }
        }
       }
    })
 .state('menu.dashboard', {
      url: '/dash',
      views: {
        'menuContent': {
          templateUrl: 'templates/dashboard.html'
        }
      }
    })
 .state('menu.top5', {
      url: '/top5',
      views: {
        'menuContent': {
          templateUrl: 'templates/Top5Freq.html',
          controller: 'homeCtrl'
        }
      }
    })
 .state('menu.freqOper', {
      url: '/FreqOperations',
      views: {
        'menuContent': {
          templateUrl: 'templates/FreqOperation.html',
          controller: 'homeCtrl'
        }
      }
    })
  .state('menu.farmRank', {
      url: '/enviRanking',
      views: {
        'menuContent': {
          templateUrl: 'templates/farmRanking.html',
          controller: 'homeCtrl'
        }
      }
    })  
  .state('menu.CompliFind', {
      url: '/CompliFinds',
      views: {
        'menuContent': {
          templateUrl: 'templates/ComplianceFindings.html',
          controller: 'homeCtrl'
        }
      }
    })
  .state('menu.FreqPTI', {
      url: '/PTIfreq',
      views: {
        'menuContent': {
          templateUrl: 'templates/FreqParams.html',
          controller: 'homeCtrl'
        }
      }
    })
  .state('menu.MonitDash', {
      url: '/monitor',
      views: {
        'menuContent': {
          templateUrl: 'templates/MonitoringDash.html',
          controller: 'homeCtrl'
        }
      }
    })
 .state('menu.enviReports', {
      url: '/envirep',
      views: {
        'menuContent': {
          templateUrl: 'templates/envireports.html',
          controller: 'enviReportCtrl'
        }
      }
    })
  .state('menu.handsReports', {
      url: '/handsReport',
      views: {
        'menuContent': {
          templateUrl: 'templates/handsreports.html',
          controller: 'handsReportCtrl'
        }
      }
    })
  
.state('menu.profile', {
    url: '/prof',
    views: {
        'menuContent': {
          templateUrl: 'templates/profile.html'
        }
      }
  })

.state('menu.myRep', {
      url: '/myReports',
      views: {
        'menuContent': {
          templateUrl: 'templates/staffReports.html',
          controller: 'menuCtrl'
        }
      }
    })
   .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })


$urlRouterProvider.otherwise('/login')

  

})

.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
}])







.factory("Service", ['$http', function($http) {
   //var serviceBase = '/emon/www/server/'  //no intenet / chrome running only
   var serviceBase = 'https://test-server-shinaska109.c9users.io/testserver/emon/www/server/' //cloud pero di mugana
   //var serviceBase = 'http://192.168.0.40/emonitor/www/server/' //local with internet

    var obj = {};

   
    
    obj.loginUser = function (name, pw) {
    //window.alert("OLAAA at loginUser: " + username);
    return $http.post(serviceBase + 'login', {username: name, password: pw}).then(function (results) {
        return results.data;
      
    });
    };
   ///////////////////////////////////////////////////////////////////////////////////

   ///////INSERTS////////////////////////////////////////////////////////////////////
    obj.insertUser = function (user) {
    return $http.post(serviceBase + 'insertUser', user).then(function (results) {
        return results.data;
    });
    };

    obj.getUser = function(userID,userName){
        return $http.get(serviceBase + 'user?id=' + userID);
    }

    obj.insertEnvi = function (envi) {
    return $http.post(serviceBase + 'insertEnvi', envi).then(function (results) {
        return results.data;
    });
    };

    obj.insertHands = function (hands) {
    return $http.post(serviceBase + 'insertHands', hands).then(function (results) {
        return results.data;
    });
    };

    obj.getEnvi = function(enviID){
        return $http.get(serviceBase + 'envi?id=' + enviID);
    }

    obj.getEnvis = function(){
        return $http.get(serviceBase + 'envis');
    }

    obj.hands = function(handsID){
        return $http.get(serviceBase + 'hands?id=' + handsID);
    }

    obj.handss = function(){
        return $http.get(serviceBase + 'handss');
    }
    ///////////////////////////////////////////////////////////////////
    //Update...........
    obj.updateEnvi = function (id,envi) {
        return $http.post(serviceBase + 'updateCriteria', {id:id, envi:envi}).then(function (status) {
            return status.data;
        });
    };

    obj.updateHands = function (id,hands) {
        return $http.post(serviceBase + 'updateHands', {id:id, hands:hands}).then(function (status) {
            return status.data;
        });
    };
    //////////////////////////////////////////////////////////////////

    ///cards//////////////////////////////////////////////////////////
   obj.getenvireport = function(){
    return $http.get(serviceBase + 'getEnviReportCard' + "?mode=" + document.getElementById("enviSelection").value);
    }
    obj.gethandsreport = function(){
    return $http.get(serviceBase + 'getHandsReportCard' + "?mode=" + document.getElementById("handsSelection").value);
    }
    obj.getStaffRep = function(){
    return $http.get(serviceBase + 'getStaffReport');
    }


    /////////////////////////////////////////////////////////////////
    
    //get combo box//////////////////////////////////////////////////
    obj.getposition = function(){
    return $http.get(serviceBase + 'getPositionCB');
    }

    obj.getfarms = function(){
    return $http.get(serviceBase + 'getFarmsCB');
    }

    obj.getlocation = function(){
    return $http.get(serviceBase + 'getLocationCB');
    }

    obj.getoperation = function(){
    return $http.get(serviceBase + 'getOperationCB');
    } 

    obj.getCriteria = function(){
    return $http.get(serviceBase + 'getCriteriaCB');
    }

    obj.getPTI = function(){
    return $http.get(serviceBase + 'getPTICB');
    }
    obj.getStatus = function(){
    return $http.get(serviceBase + 'getStatus');
    }
    ////////////////////////////////////////////////////////////////

    //CAPSTONE ELEMENTS////////////////////////////////
    obj.getPie = function(){
    return $http.get(serviceBase + 'getPies');
    }
    obj.getPie1 = function(){
    return $http.get(serviceBase + 'getPies1');
    }
    obj.getHorizontal = function(){
    return $http.get(serviceBase + 'getHorizontalBar');
    }

    obj.getDon = function(){
    return $http.get(serviceBase + 'getDonut');
    }
    
    obj.getVertical = function(){
    return $http.get(serviceBase + 'getVerticalBar');
    }

    obj.getCo = function(){
    return $http.get(serviceBase + 'getCompliancesVertical');
    }

    //Algo
    obj.getCompli = function(){
    return $http.get(serviceBase + 'getComplianceCounter');
    }

    obj.getBarPercentage = function(){
    return $http.get(serviceBase + 'getHorizontalMonitoring');
    }


    /////////////////////////////////////////

    //ranks..........
    obj.getRankAll = function(){
    return $http.get(serviceBase + 'getRankTableOverall');
    }
    obj.getRankWeek = function(){
    return $http.get(serviceBase + 'getRankTableWeek');
    }
    //////////////////////



  //Return Object
  return obj;   
}]);





// app.run(['$location', '$rootScope', function($location, $rootScope) {
//     $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
//         $rootScope.title = current.$$route.title;
//     });
// }])


