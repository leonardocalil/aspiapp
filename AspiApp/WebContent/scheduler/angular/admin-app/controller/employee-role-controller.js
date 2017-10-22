adminApp.controller('EmployeeRoleCtrl',function ($scope,$http) {
	
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
