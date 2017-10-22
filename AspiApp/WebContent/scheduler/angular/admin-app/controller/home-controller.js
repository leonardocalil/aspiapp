adminApp.controller('HomeCtrl',function ($scope,$http, Auth) {
	
	$scope.page = "";
	
	$scope.menuPage = function(vpage) {
		
		$scope.page = "pages/"+vpage+".html";    	
		

	}
	
});