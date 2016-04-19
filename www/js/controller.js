// JavaScript Document
angular.module('starter.controllers', [])

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.attendees = [
    { firstname: 'Nicolas', lastname: 'Cage' },
    { firstname: 'Jean-Claude', lastname: 'Van Damme' },
    { firstname: 'Keanu', lastname: 'Reeves' },
    { firstname: 'Steven', lastname: 'Seagal' }
  ];
  
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
})

.controller('menuCtrl', function($scope, $ionicSideMenuDelegate,$state,CalcService,$window) {
	token = localStorage.getItem("token");
	
	$scope.logout = function() {
		localStorage.setItem("userid",-1);
		localStorage.setItem("logoutyn",1);
		localStorage.setItem("slocid",-1);
		localStorage.setItem("orgid",-1);
		localStorage.setItem("thermame",-1); 
		localStorage.setItem("thermid",-1);
		localStorage.setItem("token",-1);
		CalcService.disconnect();
		$state.go('signin');
		setTimeout(function () {
			window.location.reload(1);
		},10); 
  	};
})

.controller('SignInCtrl', function($scope,$state,$http,$ionicPopup,$rootScope) {
	var userid = localStorage.getItem("userid");
	var username = localStorage.getItem("localusername");
	
	var logoutyn = localStorage.getItem("logoutyn");
	console.log(username);
	console.log(logoutyn);
	if((username != null) && (username != -1) && (logoutyn != 1)){
		var password = localStorage.getItem("localpassword");
		var data_parameters = "username="+username+ "&password="+password;
		$http.post(globalip,data_parameters, {
			headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response) {
			if(response[0].status == "Y"){
				localStorage.setItem("therm_online",response[0].online);
				$state.go('eventmenu.checkin');
			}
		});
	}
	else{
		if((localStorage.getItem("localusername") != null) && (localStorage.getItem("localpassword") != null)){
			var uname = localStorage.getItem("localusername");
			var upassword = localStorage.getItem("localpassword");
			$scope.user = {
				username: uname,
				password : upassword,
				remember : true
			}
		}
		else{
			$scope.user = {
				username: '',
				password : '',
				remember : false
			};
		}
		$scope.signIn = function(user) {
			var username = user.username;
			var password = user.password;
			var check = user.remember;
			var action = "login";
			
			if(typeof username === "undefined" || typeof password === "undefined" || username == "" || password == ""){
				$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
				})
			}
			else{
				var data_parameters = "username="+username+ "&password="+password+ "&action="+action;
				$http.post(globalip,data_parameters, {
					headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				.success(function(response) {
					if(response[0].status == "Y"){
						localStorage.setItem("therm_online",response[0].online);
						$state.go('eventmenu.checkin');
					}
					else{
						$ionicPopup.show({
						  template: '',
						  title: 'Username or password is wrong',
						  scope: $scope,
						  buttons: [
							{
							  text: 'Ok',
							  type: 'button-assertive'
							},
						  ]
						})
					}
				});
			}
		};
	}
})

.controller('forgotCtrl', function($scope,$state,$http,$ionicPopup){
	$scope.user = {email: ''};
	$scope.forget = function(user) {
		var email = user.email;
		var flag = "A";
		
		if(email != ""){
			var data_parameters = "slocid="+0+ "&orgid="+0+ "&id="+0+ "&emailid="+email+ "&flag="+flag;
			$http.post("http://"+globalip+"/email_exists",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status == "N"){
					$ionicPopup.show({
					  template: '',
					  title: 'Email address not registered.',
					  scope: $scope,
					  buttons: [
						{
						  text: 'Ok',
						  type: 'button-assertive'
						},
					  ]
					})
				}else{
					sendmail(email);
				}
			});
		}
		else{
			$ionicPopup.show({
			  template: '',
			  title: 'Please enter email address.',
			  scope: $scope,
			  buttons: [
				{
				  text: 'Ok',
				  type: 'button-assertive'
				},
			  ]
			})
		}
	}
	
	function sendmail(email){
		var data_parameters = "emailid="+email;
		$http.post("http://"+globalip+"/forgot_password",data_parameters, {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
		})
		.success(function(response){
			$scope.user = {email: ''};
			$ionicPopup.show({
			  template: '',
			  title: 'An email has been sent to the email address.',
			  scope: $scope,
			  buttons: [
				{
				  text: 'Ok',
				  type: 'button-assertive',
				  onTap:function(e){
            			$state.go('signin');
       				}
				},
			  ]
			})
			
		});
	}
})

.controller('signupCtrl', function($scope,$state,$http,$ionicPopup) {
	
	if((localStorage.getItem("rusername") != null)){
		$scope.user = {
			username: localStorage.getItem("rusername")
		}
	}
	else{
		$scope.user = {
			thermostatname : '',
			thermostatid : '',
			locationname : '',
			username : '',
			email : '',
			password : '',
			cpassword : '',
			companyname : '',
			phone : ''
		};
	}
		
	
	// first validation
	$scope.firstvalidation = function(user) {
		if(user.thermostatid != "" && user.thermostatname != "" && user.locationname != ""){
			var data_parameters = "thermostatid="+user.thermostatid;
			$http.post("http://"+globalip+"/valid_thermostat",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status != "N")$state.go('signup2');
				else{
					$ionicPopup.show({
						  template: '',
						  title: 'Thermostat ID not valid',
						  scope: $scope,
						  buttons: [
							{ 
							  text: 'Ok',
							  type: 'button-assertive'
							},
						  ]
					})
				}
			});
		}
		else{
			$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
			})
		}
	};
	
	//second validation
	$scope.secondvalidation = function(user) {
		if(user.username != "" && user.email != "" && user.password != "" && user.cpassword != ""){
			localStorage.setItem("rusername", user.username);
			
			flag = "A";
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z\-])+\.)+([a-zA-Z]{2,4})+$/;
			
			var data_parameters = "slocid="+0+ "&orgid="+0+ "&id="+0+ "&username="+user.username+ "&flag="+flag;
			$http.post("http://"+globalip+"/user_exists",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status == "Y"){
					$ionicPopup.show({
						  template: '',
						  title: 'Username already exists',
						  scope: $scope,
						  buttons: [
							{ 
							  text: 'Ok',
							  type: 'button-assertive'
							},
						  ]
					})
				}
				else{
					if(!filter.test(user.email))
					{
						$ionicPopup.show({
								  template: '',
								  title: 'Please enter valid email',
								  scope: $scope,
								  buttons: [
									{ 
									  text: 'Ok',
									  type: 'button-assertive'
									},
								  ]
							})
					}
					else{
						if(user.password != user.cpassword){
							$ionicPopup.show({
								  template: '',
								  title: "Confirm password didn't match with old password",
								  scope: $scope,
								  buttons: [
									{ 
									  text: 'Ok',
									  type: 'button-assertive'
									},
								  ]
							})
						}
						else $state.go('signup3');	
					}
				}
			});
		}
		else{
			$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
			})
		}
	};
	
	//third validation
	$scope.thirdvalidation = function(user) {
		if(user.companyname != "" && user.phone != ""){
			var data_parameters = "username="+user.username+ "&password="+user.password+ "&emailid="+user.email+ "&thermostatid="+user.thermostatid+ "&locationname="+user.locationname+ "&companyname="+user.companyname+ "&phoneno="+user.phone+ "&thermostatname="+user.thermostatname;
			$http.post("http://"+globalip+"/signup",data_parameters, {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
			})
			.success(function(response){
				if(response[0].status == "Y")$state.go('signin');
			});
		}
		else{
			$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
			})
		}
	};
})


.controller('CheckinCtrl', function($scope,$http,$rootScope,CalcService,$ionicPopup,$ionicLoading) {
	
	
})

.controller('menusCtrl', function($scope,$http,$rootScope,CalcService,$ionicPopup,$ionicLoading) {
	
	
})

.controller('setting', function($scope,$stateParams,$http,$ionicPopup){
	$scope.user = {
			opassword : '',
			npassword : '',
			cpassword : ''
	};
	
	$scope.changepassword = function(user){
		var oldpass = user.opassword;
		var newpass = user.npassword;
		var confirmpass = user.cpassword;

		var slocid = localStorage.getItem("slocid");
		var orgid = localStorage.getItem("orgid");
		var userid = localStorage.getItem("userid");
		
		if(oldpass != "" && newpass != "" && confirmpass != ""){
			if(newpass != confirmpass){
				$ionicPopup.show({
					  template: '',
					  title: "New & Confirm password didn't match",
					  scope: $scope,
					  buttons: [
						{ 
						  text: 'Ok',
						  type: 'button-assertive'
						},
					  ]
				})
			}
			else{
				var data_parameters = "slocid="+slocid+ "&orgid="+orgid+ "&id="+userid+ "&userid="+userid+ "&oldpass="+oldpass+ "&newpass="+newpass;
				$http.post("http://"+globalip+"/change_password",data_parameters,{
					headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
				})
				.success(function(response) {
					if(response[0].status != "N"){
						$ionicPopup.show({
							  template: '',
							  title: "Password changed successfully",
							  scope: $scope,
							  buttons: [
								{ 
								  text: 'Ok',
								  type: 'button-calm'
								},
							  ]
						})
						$scope.user = {
								opassword: '',
								npassword : '',
								cpassword : ''
						};
					}
					else{
						$ionicPopup.show({
							  template: '',
							  title: "Old password is wrong",
							  scope: $scope,
							  buttons: [
								{ 
								  text: 'Ok',
								  type: 'button-assertive'
								},
							  ]
						})
					}
				});
			}
		}
		else{
			$ionicPopup.show({
				  template: '',
				  title: 'Please fill all fields',
				  scope: $scope,
				  buttons: [
					{ 
					  text: 'Ok',
					  type: 'button-assertive'
					},
				  ]
			})
		}
	}
})
