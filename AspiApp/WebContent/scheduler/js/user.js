var app = angular.module("UserApp", ["angular-md5","ngCart"]); 



app.directive('format', ['$filter', function ($filter) {
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
            thousandsSeparator: '.'
        });                
                         
                return elem[0].value;
            });
        }
    };
}]);

app.directive("formatPhone", function() {
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


app.directive("formatDocument", function() {
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


app.directive("formatZipCode", function() {
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

app.directive("formatCreditcard", function() {
	return {
	    link : function(scope, element, attrs) {
	        var options = {
	        	onKeyPress: function(val, e, field, options) {
	        		//$(element).mask('000.000.000/0000-00', options);
	            }
	        }
	        
	        $(element).mask('0000 0000 0000 0000', options);
	 	       
	    }
	  }
});

app.directive('validPassword', function() {
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


app.controller('HomeCtrl',function ($scope,$http,$window, md5,ngCart) {
	
	var page_home = "home.html";
	var page_user = "user.html"; 
	var page_product = "product.html";
	var page_product_detail = "detail.html";
	var page_checkout = "checkout.html";
	var page_order_confirmed = "order_confirmed.html";


	$scope.user = {};
	$scope.menus = {};
	$scope.menu = {};
	$scope.site = {};
	$scope.page = page_home;
	
	$scope.firstname = "";
	
	$scope.logged = ngCart.isLoggedIn();
	
	
	if(ngCart.isLoggedIn()) {
		$scope.user = ngCart.getClient();
		console.log($scope.user);
		$scope.firstname = $scope.user.name.split(' ')[0];
	}
	
	$scope.loadMenu = function () {
		console.log("loadMenu");
		$http.get(url_product_type_get_all).
		then(function(response) {
			$scope.menus = response.data;		
		});
	}
	$scope.loadMenu();
	$scope.menuPage = function(vpage) {
		$scope.page = vpage+".html";    	
		
	}

	$scope.newAccount = function() {
		$scope.user = newUser();
		$scope.page = page_user;
		
	}
	$scope.logout = function() {
		ngCart.setClient(null);
		$scope.logged = false;
		$scope.firstname = "";
		$scope.page = page_home;
		$window.location.reload();
	}
	
	$scope.login = function() {

		$http.post(url_validate_client_user,{user:$scope.user.login,password:md5.createHash($scope.user.password)}).
		then(function(response) {
    		var client = response.data;
    		if(client.id != null) {
    			
    			$scope.user = client;
    				
    			ngCart.setClient($scope.user);

    			$scope.logged = true;
    			$scope.firstname = $scope.user.name.split(' ')[0];
    			$scope.page = page_home;
    			$window.location.reload();
    		} else {
    			
    			alert('Usuario e/ou senha invalido!');
    		}
    	});    	
		
		
	}
	
	$scope.save = function() {
	
		$scope.user.password = md5.createHash($scope.user.password);  
		
		$http.get(url_client_exists_login+$scope.user.login)			
		.then(function(response) {
			if(response.data != 0 && response.data != $scope.user.id ) {
				alert('Usuário ('+$scope.user.login+') não pode ser utilizado pois já está sendo usado por outra pessoa');
				
			} else {
				$http.post(url_client_save,$scope.user)			
				.then(function(response) {
					if(response.data > 0) {
						
						$scope.user.id = response.data; 
						
						ngCart.setClient($scope.user);
		    			
		    			$scope.logged = true;
		    			$scope.firstname = $scope.user.name.split(' ')[0];
		    			$scope.page = page_home;  
					} else {
						alert('Erro ao cadastrar Cliente, desculpe-nos pelo transtorno e, por gentileza, entre em contato com a empresa e informe este problema');
					} 		
					
				});
				
			} 		
			
		});
	}
	
	$scope.list_product = function(id) {
		
		
		
		$http.get(url_product_get_by_type+id)			
		.then(function(response) {
			angular.forEach($scope.menus, function(value, key){
				if(value.id == id) {
					console.log(value);
					$scope.menu = value;	
				}	    		    	
	    	});
			$scope.products = response.data;
			$scope.page = page_product;
		});
		
	}
	$scope.product_detail = function(vProduct) {
		console.log("Product: "+vProduct);
		$scope.product = vProduct;
		$scope.page = page_product_detail;
	}
	$scope.checkout = function() {
		
		
		$http.get(url_site_get_all)			
		.then(function(response) {
			$scope.sites = response.data;				
			$scope.page = page_checkout;
		});
		
		
	}
	$scope.confirm_order = function() {
		
		if($scope.site.id == null || $scope.site.id == "") {
			return;
		}
		ngCart.setSite($scope.site);
		$http.post(url_order_put,ngCart.getCart())			
		.then(function(response) {
			if(response.data > 0) {
				
				$scope.order_number = response.data; 
				
				$scope.page = page_order_confirmed;
				ngCart.empty();
				
			} else {
				alert('Erro ao efetuar pedido, desculpe-nos pelo transtorno e, por gentileza, entre em contato com a empresa e informe este problema');
			} 		
			
		});
	}

	$(window).on('resize.doResize', function () {
	    console.log('resize:'+window.innerWidth);
	    $window.location.reload();
	    //$scope.loadMenu();
	    //$(window).off("resize.doResize");
	    //$scope.$apply();
	    /*$scope.$apply(function(){
	         //do something to update current scope based on the new innerWidth and let angular update the view.
	    	console.log('resize apply:'+window.innerWidth);
	    	$(window).off("resize.doResize");
	     });*/
	});

	
});




