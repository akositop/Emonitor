app.controller('loginCtrl',function($scope,$state,$ionicPopup,$timeout,$ionicLoading,ionicMaterialInk,$ionicHistory,$stateParams,Service) {





    // Ink effect
   ionicMaterialInk.displayEffect();
   //////////////////////////////////
   
   //Login controller//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    $scope.data = {};

      ///////shows ionic loading component
      $scope.show = function() {
      $ionicLoading.show({
        template: '<p>Loading...</p><ion-spinner></ion-spinner>'
      });
      };
      ////////////////////////////////////

      //////hide ionic loading/////////
      $scope.hide = function(){
          $ionicLoading.hide();
      };
      ////////////////////////////////

      ////////ng-click didto sa login
      $scope.login = function() {
       
        $scope.show($ionicLoading);  
        Service.loginUser($scope.data.username, $scope.data.password).then(function(data) {
            /////////for time out nga overlay nga loading///////////                
             $timeout(function(){
                $ionicLoading.hide();
              },200);
            ///////////////////////////////////////////////////////
           
            ////response from the php/server
            if (data.status == "success") {
              // alert(data.status );
              $scope.data.password = "";
               
              $state.go('menu.top5');

            }
            if (data.status == "error") {
                ////////pop up//////
                var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
                });
                ///////////////////
              
            }
          /////////////////////////////////


        });
        
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

})