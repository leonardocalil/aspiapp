var app = angular.module("AdminApp", ["ngRoute","angularUtils.directives.dirPagination","angular-md5","ui.bootstrap"]); 

app.config(function($routeProvider) {
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

app.factory('Auth', function(){
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

app.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
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
            thousandsSeparator: ''
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

app.controller('LoginCtrl', function($scope,$http,$location,md5,Auth) {
	$scope.user = "";
	$scope.password = "";
	
	
	$scope.login = function() {
		
		$http.post(url_validate_employee_user,{user:$scope.user,password:md5.createHash($scope.password)}).
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

app.controller('HomeCtrl',function ($scope,$http, Auth) {
	
	$scope.page = "";
	
	$scope.menuPage = function(vpage) {
		
		$scope.page = "pages/"+vpage+".html";    	
		

	}
	
});


app.controller('ProductTypeCtrl',function ($scope,$http) {
	
	var page_new = "pages/product/product_type_new.html";
	var page_list = "pages/product/product_type_list.html"; 	
	
	$scope.page  = page_list; 
	
	
	$scope.submitted = false;
	
	$scope.models = [];
	
	$http.get(url_product_type_get_all)
	.then(function(response) {
		$scope.models = response.data;		
	});    	
	
	
	$scope.ordenar = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };
	
	$scope.new_ = function(vpage) {
		$scope.model = newProductType();				
		
		$scope.page = page_new;    			
	}
	$scope.back = function() {		
		$http.get(url_product_type_get_all)
		.then(function(response) {
			$scope.models = response.data;		
		});    	
		$scope.page  = page_list;    			
	}
	$scope.edit = function(vmodel) {
		
		$scope.model = vmodel;
		$scope.page = page_new;
	}
	$scope.delete_ = function(vmodel) {
		if(confirm("Deseja realmente excluir esse registro ("+vmodel.id+" - "+vmodel.description+")?")) {
			$http.get(url_product_type_delete+vmodel.id).
    		then(function(response) {
    			if(response.data == true) {
    				$scope.back();
    				alert('Registro deletado com sucesso!');
    			} else {
    				alert('Erro ao deletar o registro, por gentileza, entre em contato com seu suporte');
    			}
    		});
		}
	}
	$scope.save = function() {
		
		$scope.submitted = true;
		
		if($scope.model.description != null && $scope.model.description.length > 0) {
			
			
			$http.post(url_product_type_save,$scope.model)
			.then(function(response) {
				if(response.data == true) {
					$scope.submitted = false;
					$scope.back();
				} else {
					alert('Erro ao salvar registro, por gentileza, contate o seu suporte.');
				} 		
				
			});    	
			
		}
		
	}
	
}); 



app.controller('ProductItemCtrl',function ($scope,$http) {
	
	var page_list = "pages/product/product_item_list.html";
	var page_new = "pages//product/product_item_new.html";
	
	$scope.page  = page_list;
	
	$scope.submitted = false;
	
	$scope.models = [];
	
	$scope.productTypes = [];
	
	$scope.model = newProductItem();
	
	
	$http.get(url_product_item_get_all)
	.then(function(response) {
		$scope.models = response.data;		
	});
	
	$http.get(url_product_type_get_all)
	.then(function(response) {
		$scope.productTypes = response.data;
		$scope.productTypes.unshift({id:"",description:"--Selecione--"})
	});    	
	
	
	$scope.ordenar = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };
	
	$scope.new_ = function(vpage) {
		$scope.model = newProductItem();				
		
		$scope.page = page_new;    			
	}
	$scope.back = function() {		
		$http.get(url_product_item_get_all)
		.then(function(response) {
			$scope.models = response.data;		
		});    	
		$scope.page  = page_list;    			
	}
	$scope.edit = function(vmodel) {
		
		$scope.model = vmodel;
		
		$scope.page = page_new;
	}
	$scope.delete_ = function(vmodel) {
		if(confirm("Deseja realmente excluir esse registro ("+vmodel.id+" - "+vmodel.name+")?")) {
			$http.get(url_product_item_delete+vmodel.id).
    		then(function(response) {
    			if(response.data == true) {
    				$scope.back();
    				alert('Registro deletado com sucesso!');
    			} else {
    				alert('Erro ao deletar o registro, por gentileza, entre em contato com seu suporte');
    			}
    		});
		}
	}
	$scope.save = function() {
		
		$scope.submitted = true;
		
		if($scope.model.productType != null && $scope.model.productType.id != 0 &&
		   $scope.model.name != null && $scope.model.name.length > 0 &&
		   $scope.model.sale_price != null && $scope.model.sale_price.length > 0) {
			
			$scope.submitted = false;
			
			$http.post(url_product_item_save,$scope.model)			
			.then(function(response) {
				if(response.data == true) {
					
					$scope.back();
				} else {
					alert('Erro ao salvar registro, por gentileza, contate o seu suporte.');
				} 		
				
			});    	
			
		}
		
	}
	
}); 


app.controller('EmployeeRoleCtrl',function ($scope,$http) {
	
	var page_list = "pages/employee/employee_role_list.html";
	var page_new = "pages/employee/employee_role_new.html";
	
	$scope.page  = page_list; 
	
	$scope.submitted = false;
	
	$scope.models = [];
	
	$http.get(url_employee_role_get_all)
	.then(function(response) {
		$scope.models = response.data;		
	});    	
	
	
	$scope.ordenar = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };
	
	$scope.new_ = function(vpage) {
		$scope.model = newEmployeeRole();				
		
		$scope.page = page_new;    			
	}
	$scope.back = function() {		
		$http.get(url_employee_role_get_all)
		.then(function(response) {
			$scope.models = response.data;		
		});    	
		$scope.page  = page_list;    			
	}
	$scope.edit = function(vmodel) {
		
		$scope.model = vmodel;
		$scope.page = page_new;
		
	}
	$scope.delete_ = function(vmodel) {
		if(confirm("Deseja realmente excluir esse registro ("+vmodel.id+" - "+vmodel.name+")?")) {
			$http.get(url_employee_role_delete+vmodel.id).
    		then(function(response) {
    			if(response.data == true) {
    				$scope.back();
    				alert('Registro deletado com sucesso!');
    			} else {
    				alert('Erro ao deletar o registro, por gentileza, entre em contato com seu suporte');
    			}
    		});
		}
	}
	$scope.save = function() {
		
		$scope.submitted = true;
		
		if($scope.model.name != null && $scope.model.name.length > 0) {
			
			
			$http.post(url_employee_role_save,$scope.model)
			.then(function(response) {
				if(response.data == true) {
					$scope.submitted = false;
					$scope.back();
				} else {
					alert('Erro ao salvar registro, por gentileza, contate o seu suporte.');
				} 		
				
			});    	
			
		}
		
	}
	
}); 


app.controller('EmployeePersonCtrl',function ($scope,$http,md5) {
	
	var page_list = "pages/employee/employee_person_list.html";
	var page_new = "pages/employee/employee_person_new.html";
	
	$scope.page  = page_list;
	
	$scope.submitted = false;
	
	$scope.models = [];
	
	$scope.roles = [];

	$scope.access_levels = [{id:0,name:"Administrador"},{id:1,name:"Usuário"}];
	
	$scope.persons = [];
	$scope.password_tmp = "";
	
	
	$scope.model = newEmployeePerson();
	
		
	$scope.getSupervisors = function () {
		$http.get(url_employee_person_get_all)
		.then(function(response) {
			$scope.persons = response.data;
			$scope.persons.unshift({id:"0",name:"--N/A--"})
			if($scope.model.id != 0) {
				angular.forEach($scope.persons, function(value, key){
					if(value.id == $scope.model.id) {
						$scope.persons.splice(splice);	
					}
		    		
		    		    		
		    	});
			}
			
			
		});
	}
	
	$http.get(url_employee_role_get_all)
	.then(function(response) {
		$scope.roles = response.data;		
		$scope.roles.unshift({id:"",name:"--Selecione--"})
	});
	
	$http.get(url_employee_person_get_all)
	.then(function(response) {
		$scope.models = response.data;
	});
	
	    	
	$scope.getSupervisors();
	
	$scope.ordenar = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };
	
	$scope.new_ = function(vpage) {
		$scope.model = newEmployeePerson();				
		
		$scope.page = page_new;    			
	}
	$scope.back = function() {		
		$http.get(url_employee_person_get_all)
		.then(function(response) {
			$scope.models = response.data;
		}); 
		$scope.page  = page_list; 
		   			
	}
	$scope.edit = function(vmodel) {
		
		$scope.model = vmodel;
		
		$scope.page = page_new;
	}
	$scope.delete_ = function(vmodel) {
		if(confirm("Deseja realmente excluir esse registro ("+vmodel.id+" - "+vmodel.name+")?")) {
			$http.get(url_employee_person_delete+vmodel.id).
    		then(function(response) {
    			if(response.data == true) {
    				$scope.back();
    				alert('Registro deletado com sucesso!');
    			} else {
    				alert('Erro ao deletar o registro, por gentileza, entre em contato com seu suporte');
    			}
    		});
		}
	}
	$scope.save = function() {
		
		$scope.submitted = true;
		
		if($scope.model.name != null &&
		   $scope.model.document != null && ($scope.model.document.length == 14 || $scope.model.document.length == 19) && 
		   $scope.model.address_name != null &&
		   $scope.model.address_number != null &&
		   $scope.model.address_complement != null &&
		   $scope.model.zip_code != null &&
		   $scope.model.role.id != null && $scope.model.role.id != 0 &&
		   $scope.model.boss.id != null ) {
			
			
			$scope.submitted = false;
			
			$http.post(url_employee_person_save,$scope.model)			
			.then(function(response) {
				if(response.data == true) {
					alert('Registro salvo com sucesso!');
					$scope.back();
				} else {
					alert('Erro ao salvar registro, por gentileza, contate o seu suporte.');
				} 		
				
			});    
			
		}
		
	}
	$scope.update_access = function() {
		$scope.model.password = md5.createHash($scope.password_tmp);  
		
		$http.get(url_employee_person_exists_login+$scope.model.login)			
		.then(function(response) {
			if(response.data != 0 && response.data != $scope.model.id ) {
				alert('Usuário ('+$scope.model.login+') não pode ser utilizado pois já está sendo usado por outro funcionario.');
				
			} else {
				$http.post(url_employee_person_update_access,$scope.model)			
				.then(function(response) {
					if(response.data == true) {
						
						alert('Nível de Acesso atualizado com sucesso!');
					} else {
						alert('Erro ao atualizar o N&iacute;vel de Acesso, por gentileza, contate o seu suporte.');
					} 		
					
				});
				
			} 		
			
		});
		
		
	}
	
	
});


app.controller('OrderQueueCtrl',function ($scope,$http,$interval) {
	
	var page_list = "pages/order/order_queue_list.html";
	var promise;
	
	$scope.page = page_list;
	
	$scope.models = [];
	$scope.sites = [];
	$scope.site = "0";
	
	$http.get(url_site_get_all)
	.then(function(response) {
		$scope.sites = response.data;		
		$scope.sites.unshift({id:"0",name:"TODOS"})
	});
	
	getOrderQueue();
	
	// starts the interval
    $scope.start = function() {
      // stops any running interval to avoid two intervals running at the same time
      $scope.stop(); 
      
      // store the interval promise
      promise = $interval(getOrderQueue, 1000);
    };
  
    // stops the interval
    $scope.stop = function() {
      $interval.cancel(promise);
    };
  
    // starting the interval by default
    $scope.start();
 
    // stops the interval when the scope is destroyed,
    // this usually happens when a route is changed and 
    // the ItemsController $scope gets destroyed. The
    // destruction of the ItemsController scope does not
    // guarantee the stopping of any intervals, you must
    // be responsible of stopping it when the scope is
    // is destroyed.
    $scope.$on('$destroy', function() {
      $scope.stop();
    });
            
    function getOrderQueue() {
		$http.get(url_order_get_queue+$scope.site)
		.then(function(response) {
			$scope.models = response.data;
			angular.forEach($scope.models, function(value, key){
				if(value.status.id == 1) {
					value.viewOpen = true;
				} else {
					value.viewOpen = false;
				}				
	    		    		
	    	});
			
		});
	    
    }


	$scope.setStatus = function(model,status) {
		if(model.status.id != status) {
			$http.get(url_order_update_status+model.id+"/"+status)
			.then(function(response) {
				if(response.data == true) {
					getOrderQueue();
				}
				
			});
		}
		
	}
	
	$scope.changeFilter = function(site) {
		$scope.site = site;
		getOrderQueue();
	} 
	
	
	
	
	
}); 



app.controller('StoreCtrl',function ($scope,$http,md5) {
	
	var page_list = "pages/store/store_list.html";
	var page_new = "pages/store/store_new.html";
	
	$scope.page  = page_list;
	
	$scope.submitted = false;
	
	$scope.models = [];
	
	$scope.model = newStore();
		
		
	$http.get(url_site_get_all)
	.then(function(response) {
		$scope.models = response.data;
	});
	
	   
	$scope.ordenar = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    };
	
	$scope.new_ = function(vpage) {
		$scope.model = newStore();				
		
		$scope.page = page_new;    			
	}
	$scope.back = function() {		
		$http.get(url_site_get_all)
		.then(function(response) {
			$scope.models = response.data;
		}); 
		$scope.page  = page_list; 
		   			
	}
	$scope.edit = function(vmodel) {
		
		$scope.model = vmodel;
		
		$scope.page = page_new;
	}
	$scope.delete_ = function(vmodel) {
		if(confirm("Deseja realmente excluir esse registro ("+vmodel.id+" - "+vmodel.name+")?")) {
			$http.get(url_site_delete+vmodel.id).
    		then(function(response) {
    			if(response.data == true) {
    				$scope.back();
    				alert('Registro deletado com sucesso!');
    			} else {
    				alert('Erro ao deletar o registro, por gentileza, entre em contato com seu suporte');
    			}
    		});
		}
	}
	$scope.save = function() {
		
		$scope.submitted = true;
		
		if($scope.model.name != null) {
			
			if($scope.model.physical_store == 0) {
				$scope.model.document = null;
				$scope.model.phone = null;
				$scope.model.email = null;
				$scope.model.address_name = null
				$scope.model.address_number = null;
				$scope.model.address_complement = null;
				$scope.model.zip_code = null;
			}
			
			$scope.submitted = false;
			
			$http.post(url_site_save,$scope.model)			
			.then(function(response) {
				if(response.data == true) {
					alert('Registro salvo com sucesso!');
					$scope.back();
				} else {
					alert('Erro ao salvar registro, por gentileza, contate o seu suporte.');
				} 		
				
			});    
			
		}
		
	}
	
	
});


