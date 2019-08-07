  app.controller('healthAndSafetyCtrl', function($scope, $cordovaFile, $cordovaFileTransfer, $cordovaDevice,$timeout,$ionicLoading,$ionicHistory ,$ionicPlatform, $cordovaCamera, $ionicActionSheet, $ionicPopup, ionicMaterialInk, $stateParams, $rootScope, $state, Service, hands, Data) {


 ////////////INSERT///////////////////////////////////////////
      var handsID = ($stateParams.handsID) ? parseInt($stateParams.handsID) : 0;
      // $rootScope.title = (enviID > 0) ? 'Edit User' : 'Add User';
      // $scope.buttonText = (enviID > 0) ? 'Update User' : 'Add New User';

      var original = hands.data;
      original._id = handsID;
      $scope.hands = angular.copy(original);
      $scope.hands._id = handsID;

      $scope.isClean = function() {
        return angular.equals(original, $scope.hands);
      }

      $scope.deleteCustomer = function(user) {
        $location.path('user-list/');
       if(confirm("Are you sure to delete user number: "+$scope.user._id)==true)
        Service.deleteCustomer(user.userNumber);
      };

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

      $scope.saveHands = function(hands) {

        setTimeout(function(){
          refreshGlobal();
        }, 1000);
        
        if (handsID <= 0) {

          // Destination URL
              var url = 'https://test-server-shinaska109.c9users.io/testserver/emon/www/server/UploadReg';
              //var serviceBase1 = 'http://192.168.0.40/emonitor/www/server/UploadReg'
              // File for Upload
              var targetPath = $scope.pathForImage($scope.image);

              // File name only
              var filename = $scope.image;;

              var options = {
                  fileKey: "file",
                  fileName: filename,
                  chunkedMode: false,
                  mimeType: "multipart/form-data",
                  params: { 'fileName': filename }
              };

              $cordovaFileTransfer.upload(url, targetPath, options).then(function (result) {
                  console.log("SAKSES UPLOAD" + JSON.stringify(result));
                  //alert("SAKSES UPLOAD" + JSON.stringify(result));
        
                  hands.hands_img = filename;
                  $scope.show($ionicLoading);        
                  Service.insertHands(hands).then(function(yow){
                  /////////for time out nga overlay nga loading///////////                
                      $timeout(function(){
                         $ionicLoading.hide();
                       },200);
                  /////////////////////////////////////////////////////// 
                  alert(yow.status);
                  $scope.hands.hands_req_of = " ";
                  $scope.hands.hands_time_frame = " ";
                  $scope.hands.hands_findings = " ";
                  $scope.hands.hands_action_plan = " ";

                   //disable ionic nav history
                    $ionicHistory.nextViewOptions({
                     disableBack: true,
                     disableAnimate: true,
                     historyRoot: false
                    });

                  $state.go('menu.top5');
                
                 })
              }, function (err) {
                  console.log("ERROR UPLOAD" + JSON.stringify(err));
                  //$scope.showAlert('Error', 'Image upload failed.');
              });
          
        }
        else {
          Service.updateHands(handsID, hands).then(function(yow){
          alert(yow.msg);
          $state.go('menu.handsReports');
        });
        }
        
        // $state.go('/');
      };

///////////////////////////IMAGE CONTROLLER////////////////////////////////////////////////////
//Image Controll//////////////////////////////////////////////////
    $scope.loadImage = function() {
          //var alertPopup = $ionicPopup.alert({
          //   title: 'Login failed!',
          //   template: 'Please check your credentials!'
          //});
          // $scope.image = null;
            
            var options = {
                title: 'Select Image Source',
                buttonLabels: ['Load from Library', 'Use Camera'],
                addCancelButtonWithLabel: 'Cancel',
                androidEnableCancelButton: true,
            };

                $ionicActionSheet.show({
                    titleText: 'Choose Option',
                    buttons: [
                          { text: '<i class="icon ion-images"></i> Gallery' },
                          { text: '<i class="icon ion-ios-camera-outline"></i> Camera' },
                    ],
                    cancelText: 'Cancel',
                    cancel: function () {
                        console.log('CANCELLED');
                    },
                    buttonClicked: function (index) {
                        var type = null;
                        if (index === 0) {
                                type = Camera.PictureSourceType.PHOTOLIBRARY;
                        } else if (index === 1) {
                                type = Camera.PictureSourceType.CAMERA;
                        }
                       if (type !== null) {
                                $scope.selectPicture(type);
                        }
                        return true;
                    }
                });

            //$cordovaActionSheet.show(options).then(function (btnIndex) {
            //    var type = null;
            //    if (btnIndex === 1) {
            //        type = Camera.PictureSourceType.PHOTOLIBRARY;
            //    } else if (btnIndex === 2) {
            //        type = Camera.PictureSourceType.CAMERA;
            //    }
            //    if (type !== null) {
            //        $scope.selectPicture(type);
            //    }
            //});

        $scope.selectPicture = function(sourceType) {
            var options = {
              quality: 80,
              destinationType: Camera.DestinationType.FILE_URI,
              sourceType: sourceType,
              saveToPhotoAlbum: false,
              allowEdit: true,
                targetWidth: 300,
                targetHeight: 500

            };
         
            $cordovaCamera.getPicture(options).then(function(imagePath) {
              // Grab the file name of the photo in the temporary directory
              var currentName = imagePath.replace(/^.*[\\\/]/, '');
         
              //Create a new name for the photo
              var d = new Date(),
              n = d.getTime(),
              newFileName =  n + ".jpg";
         
              // If you are trying to load image from the gallery on Android we need special treatment!
              if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
                window.FilePath.resolveNativePath(imagePath, function(entry) {
                  window.resolveLocalFileSystemURL(entry, success, fail);
                  function fail(e) {
                    console.error('Error: ', e);
                  }
         
                  function success(fileEntry) {
                    var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                    // Only copy because of access rights
                    $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                      $scope.image = newFileName;
                    
                    }, function(error){
                      $scope.showAlert('Error', error.exception);
                    });
                  };
                }
              );
              } else {
                var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                // Move the file to permanent storage
                $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
                  $scope.image = newFileName;

                }, function(error){
                  $scope.showAlert('Error', error.exception);
                });
              }
            },
            function(err){
              // Not always an error, maybe cancel was pressed...
            })
          };

          // Returns the local path inside the app for an image
          $scope.pathForImage = function(image) {
            if (image === null) {
              return '';
            } else {
              return cordova.file.dataDirectory + image;
            }
          };
          


    }


        //////////////////////////////////////////////////////////////////



///////////////////COMBO BOX /////////////////////////////////////
   Service.getPTI().then(function(data){
        $scope.PTIS = data.data;
      });
   
   Service.getStatus().then(function(data){
        $scope.statuss = data.data;
      });
//////////////////////////////////////////////////////////////////

$scope.date = new Date();

//////////////////////////////////////////////////////////////////////////////////
  $scope.getImage = function() {  

  var options = {
      quality: 80,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 280,
      targetHeight: 280,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      // var image = document.getElementById('myImage');
      // image.src = "data:image/jpeg;base64," + imageData;
       $scope.imgURI = 'data:image/jpeg;base64, ' + imageData;
    }, function(err) {
      // error
    }); 


  }

//////////////////////////////////////////////////////////////////////////////////




/////////////////////////////////////
  ionicMaterialInk.displayEffect();
/////////////////////////////////////
})