adminApp.controller('OrderQueueCtrl',function ($scope,$http,$interval) {
	
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
