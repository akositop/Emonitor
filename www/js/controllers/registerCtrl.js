app.controller('registerCtrl', function ($scope, $cordovaFile, $cordovaFileTransfer,$ionicHistory ,$cordovaDevice,$timeout,$ionicLoading, $timeout, $ionicPlatform, $cordovaCamera, $ionicActionSheet, $ionicPopup, ionicMaterialInk, $stateParams, $rootScope, $state, Service, user, Data) {
		
	    var userID = ($stateParams.userID) ? parseInt($stateParams.userID) : 0;
	    $rootScope.title = (userID > 0) ? 'Edit User' : 'Add User';
	    $scope.buttonText = (userID > 0) ? 'Update User' : 'Add New User';

	    var original = user.data;
	    original._id = userID;
	    $scope.user = angular.copy(original);
	    $scope.user._id = userID;

	    $scope.isClean = function() {
	      return angular.equals(original, $scope.user);
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
	    $scope.saveUser = function(user) {
	        if (userID <= 0) {

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
	                $scope.show($ionicLoading); 
	               	user.user_img = filename; 
	                Service.insertUser(user).then(function (yow) {
                        
	                    $scope.user.user_fname = "";
	                    $scope.user.user_lname = "";
	                    $scope.user.ua_username = "";
	                    $scope.user.ua_password = "";
	                    $state.go('menu.top5');
	                    /////////for time out nga overlay nga loading///////////                
			             $timeout(function(){
			                $ionicLoading.hide();
			              },200);
			            ///////////////////////////////////////////////////////
		                //disable ionic nav history
                        $ionicHistory.nextViewOptions({
                         disableBack: true
                        });
	                    alert(yow.status);
	                })
	            }, function (err) {
	                console.log("ERROR UPLOAD" + JSON.stringify(err));
	                //$scope.showAlert('Error', 'Image upload failed.');
	            });

			 }
			 else {
				        // services.updateUser(userID, user);
				  }
				      
				      // $state.go('/');
				    };	

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

      	//Populate ang select/combobox
      	Service.getposition().then(function(data){
		    $scope.positions = data.data;
		});


		Service.getfarms().then(function(data){
  			$scope.farms = data.data;
  		});

  		/////////////////////////////////////////////////////////////////

  		
  		//ink control, ayaw hilabti kay wala na nanghilabot nimo	
	  	ionicMaterialInk.displayEffect();
  		///////////////////////////////////////////////////////
})