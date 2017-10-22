adminApp.controller('LoginCtrl', function($scope,$http,$location,md5,Auth) {
	$scope.user = "";
	$scope.password = "";
	
	
	$scope.login = function() {
		
		var params = {
				login: $scope.user,
				password: md5.createHash($scope.password)
		};
		
		$http.post("../backend/login/validate_employee_user.php", params).
		then(function(response) {
    		var employee = response.data;
    		if(employee.id != null) {
    			Auth.setEmployee(employee);    	
    			$location.path( "/home" );
    		} else {    			
    			alert('Usuario e/ou senha invalido!');
    		}
    	});    	
		

	}
}); 