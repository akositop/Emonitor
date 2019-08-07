app.controller('menuCtrl', function($scope,$state,$ionicHistory,$ionicLoading,$timeout,$ionicPopup,Data,Service) {
/////////////REFRESHER
    $scope.doRefresh = function() {
    
    $timeout( function() {
      //simulate async response
      Service.getStaffRep().then(function(data){
      $scope.staffReportss = data.data;
      });
      //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };

  

///////////////////////////////////////////
	  ///////shows ionic loading component
      $scope.show = function() {
      $ionicLoading.show({
        template: '<p>Please Wait..</p><ion-spinner></ion-spinner>'
      });
      };
      ////////////////////////////////////

      //////hide ionic loading/////////
      $scope.hide = function(){
          $ionicLoading.hide();
      };
      ////////////////////////////////  
  $scope.doLogout = function () {

	  $scope.show($ionicLoading);
	  Data.get('logout').then(function (results) {
	      /////////for time out nga overlay nga loading///////////                
           $timeout(function(){
              $ionicLoading.hide();
            },200);
          ///////////////////////////////////////////////////////
          if (results.message == "Logged out successfully") {
             	
             	var confirmPopup = $ionicPopup.confirm({
		            title: 'Confirm',
		            template: 'Are you sure to log out?'
		        });
 
		        confirmPopup.then(function (res) {
		            if (res) {
                    //disable ionic nav history
                        $ionicHistory.nextViewOptions({
                         disableBack: true,
                         disableAnimate: true,
                         historyRoot: false
                        });
                  
		              $state.go('login');
		            }
		 
		          });
          }
	      
	  });
  
  }





  //////////////////TADA SURPRISE MADAFA!
  Service.getStaffRep().then(function(data){
      $scope.staffReportss = data.data;
      });


  ///////////////////////////////


})