var adminApp = angular.module("AdminApp", ["ngRoute","angularUtils.directives.dirPagination","angular-md5","ui.bootstrap"]); 

adminApp.config(function($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl : 'login.html',
		controller: 'LoginCtrl'
	})
	.when('/forgotPassword', {
		templateUrl : 'forgotpassword.html'	
	})
	.when('/home', {
		templateUrl : 'home.html'	
	})
	.otherwise({
	       redirectTo: '/login'
	});
	
});

adminApp.factory('Auth', function(){
	var employee;
	return{
	    setEmployee : function(aEmployee){
	    	employee = aEmployee;
	    },
	    isLoggedIn : function(){	    	
	    	return(employee)? employee : false;
	    }
	  }
});

adminApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event) {

        if (!Auth.isLoggedIn()) {
            //event.preventDefault();
            $location.path('/login')
        }
        else {
            $location.path('/home');
        }
    });
}]);


adminApp.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function (viewValue) {
                              
          elem.priceFormat({
            prefix: '',
            centsSeparator: ',',
            thousandsSeparator: ''
        });                
                         
                return elem[0].value;
            });
        }
    };
}]);

adminApp.directive("formatPhone", function() {
	return {
	    link : function(scope, element, attrs) {
	        var options = {
	        	onKeyPress: function(val, e, field, options) {
	        		$(element).mask('(00) 00000-0000', options);
	            }
	        }
	        element.bind('blur', function() {
	            adjustMask();
	          });
	 
	        $(element).mask('(00) 00000-0000', options);
	 
	        function adjustMask() {
	            var mask;
	            var cleanVal = element[0].value.replace(/\D/g, '');//pega o valor sem mascara
	            if(cleanVal.length < 11) {//verifica a quantidade de digitos.
	                mask = "(00) 0000-0000";
	                $(element).mask(mask, options);//aplica a mascara novamente
	            }
	            
	        }
	       
	    }
	  }
});


adminApp.directive("formatDocument", function() {
	return {
	    link : function(scope, element, attrs) {
	        var options = {
	        	onKeyPress: function(val, e, field, options) {
	        		$(element).mask('000.000.000/0000-00', options);
	            }
	        }
	        element.bind('blur', function() {
	            adjustMask();
	        });
	 
	        $(element).mask('000.000.000/0000-00', options);
	 
	        function adjustMask() {
	            var mask;
	            var cleanVal = element[0].value.replace(/\D/g, '');//pega o valor sem mascara
	            if(cleanVal.length < 12) {//verifica a quantidade de digitos.
	                mask = "000.000.000-00";
	                $(element).mask(mask, options);//aplica a mascara novamente
	            }
	            
	        }
	       
	    }
	  }
});


adminApp.directive("formatZipCode", function() {
	return {
	    link : function(scope, element, attrs) {
	        var options = {
	        	onKeyPress: function(val, e, field, options) {
	        		//$(element).mask('000.000.000/0000-00', options);
	            }
	        }
	        
	        $(element).mask('00.000-000', options);
	 	       
	    }
	  }
});


adminApp.directive('validPassword', function() {
	  return {
	    require: 'ngModel',
	    scope: {

	      reference: '=validPassword'

	    },
	    link: function(scope, elm, attrs, ctrl) {
	      ctrl.$parsers.unshift(function(viewValue, $scope) {

	        var noMatch = viewValue != scope.reference
	        ctrl.$setValidity('noMatch', !noMatch);
	        return (noMatch)?noMatch:!noMatch;
	      });

	      scope.$watch("reference", function(value) {;
	        ctrl.$setValidity('noMatch', value === ctrl.$viewValue);

	      });
	    }
	  }
});