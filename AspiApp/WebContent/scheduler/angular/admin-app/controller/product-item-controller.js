adminApp.controller('ProductItemCtrl',function ($scope,$http) {
	
	var page_list = "pages/product/product_item_list.html";
	var page_new = "pages/product/product_item_new.html";
	
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
