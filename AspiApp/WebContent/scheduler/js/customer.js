var app = angular.module('CustomerApp', []); 


app.controller('CustomerCtrl', function($scope,$http,$window) {
    
    var url = 'http://localhost:8080/SurveyWSRest/rest/customer/';
    $scope.customer = {"id":0,"name":"","phone":"","email":""};
    $scope.urlTemplate = "templates/formCustomer.html";
    
    $scope.save = function() {
    	
    	$scope.submitted = true;
    	
    	if($scope.customer.name != null && 
    			$scope.customer.phone != null &&
    			$scope.customer.email != null) {
    	
	    	$http.post(url+"saveNew",$scope.customer).
	    	then(function(response) {
	    		console.log("resultado save: "+response.data);
	    		if(response.data > -1) {
	    			$window.location.href = "questionnaire.html?customer="+response.data;	    			
	    		} else {
	    			alert('Erro ao efetuar cadastro');
	    		}
	    	});
    	}
    	
    };
});

