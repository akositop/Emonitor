angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
 // view
   .state('menu', {
      url: "/menu",
      abstract: true,
      templateUrl: "templates/menu.html"
      
    })
  // .state('menu.home', {
  //     url: '/home',
  //     views: {
  //       'menuContent': {
  //         templateUrl: 'templates/home.html',
  //         controller: 'homeCtrl'
  //       }
  //     }
  //   })
   
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('healthAndSafety', {
    url: '/hands',
    templateUrl: 'templates/healthAndSafety.html',
    controller: 'healthAndSafetyCtrl'
  })

  .state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('environment', {
    url: '/envi',
    templateUrl: 'templates/environment.html',
    controller: 'environmentCtrl'
  })

  .state('register', {
    url: '/reg',
    templateUrl: 'templates/register.html',
    controller: 'registerCtrl'
  })

  .state('dashboard', {
    url: '/dash',
    templateUrl: 'templates/dashboard.html',
    controller: 'dashboardCtrl'
  })

  .state('reports', {
    url: '/rep',
    templateUrl: 'templates/reports.html',
    controller: 'reportsCtrl'
  })

$urlRouterProvider.otherwise('/home')

  

});
