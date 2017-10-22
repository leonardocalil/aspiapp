adminApp.controller('StoreCtrl',function ($scope,$http,md5) {
	
	var page_list = "pages/store/store_list.html";
	var page_new = "pages/store/store_new.html";
	var backend = "../backend/admin/store/store.php";
	
	$scope.page  = page_list;
	
	$scope.submitted = false;
	
	$scope.models = [];
	
	$scope.model = newStore();
		
		
	$http.post(backend,{action:'load'})
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
		$http.post(backend,{action:'load'})
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


