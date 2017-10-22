adminApp.controller('EmployeePersonCtrl',function ($scope,$http,md5) {
	
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