var refreshGlobal = null;

app.controller('enviReportCtrl', function($scope,$state,$ionicLoading,$timeout,$ionicModal,$ionicPopup,$stateParams,Service) {

///////////////////////REFRESHER/////////////////////////////
  $scope.doRefresh = function() {
    
      //simulate async response
      Service.getenvireport().then(function(data){
          $scope.reports = data.data;
      });
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
  };

  refreshGlobal = $scope.doRefresh;

  $scope.isRate = ['Rated','Not Yet Rate'];
  /////////////////////////////////////////////////////////////
////////////////////edit
// var enviID = ($stateParams.enviID) ? parseInt($stateParams.enviID) : 0;
//       // $rootScope.title = (enviID > 0) ? 'Edit User' : 'Add User';
//       // $scope.buttonText = (enviID > 0) ? 'Update User' : 'Add New User';

//       var original = envi.data;
//       original._id = enviID;
//       $scope.envi = angular.copy(original);
//       $scope.envi._id = enviID;

//       $scope.isClean = function() {
//         return angular.equals(original, $scope.envi);
//       }
      // $scope.saveCustomer = function(customer) {
      //    Service.updateCustomer(customerID, customer);
      // };
///////shows ionic loading component
 $scope.show = function() {
   $ionicLoading.show({
     template: '<p>Loading Reports</p><ion-spinner></ion-spinner>'
   });
 };
 /////////////////////////////////
 //////hide ionic loading/////////
 $scope.hide = function(){
     $ionicLoading.hide();
 };
////////////////////////////////  
$scope.show($ionicLoading);
////////Populate List Card////
Service.getenvireport().then(function(data){
  
  /////////for time out nga overlay nga loading///////////                
           $timeout(function(){
              $ionicLoading.hide();
            },200);
          ///////////////////////////////////////////////////////
  $scope.reports = data.data;
});
/////////////////////////////

})