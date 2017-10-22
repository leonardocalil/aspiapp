mainApp.controller('MainCtrl', function($scope, $timeout, $http) {
	$scope.events = [];
	
	
	$scope.navigatorConfig = {
		selectMode: "day",
		showMonths: 3,
		skipMonths: 3, 
		onTimeRangeSelected: function(args) {
			$scope.weekConfig.startDate = args.day;
			$scope.dayConfig.startDate = args.day;
			loadEvents();
		}
	};
	
	$scope.dayConfig = {
		viewType: "Day",
		eventMoveHandling: "Disabled",
		eventResizeHandling: "Disabled",
		timeRangeSelectedHandling: "Disabled",
		onTimeRangeSelected: function(args) {
			/*var params = {
				start: args.start.toString(),
				end: args.end.toString(),
				text: "New event"
			};

			
			$http.post("backend_create.php", params).success(function(data) {
				$scope.events.push({
					start: args.start,
					end: args.end,
					text: "New event",
					id: data.id
				});
			});*/
			console.log('onTimeRangeSelected');
			
		},
		onEventClick: function(args) {
			console.log('onEventClick');
			var modal = new DayPilot.Modal({
				onClosed: function(args) {
					if (args.result) {  // args.result is empty when modal is closed without submitting
						loadEvents();
					}
				}
			});
			var params = {
				action: 'select',
				id: args.e.id()
			};
			console.log(params);
			
			$http.post("backend/main/agenda.php", params).success(function(data) {
				console.log(data);
				$scope.id = data.id;
				$scope.text = data.text;
				modal.showUrl("edit.html");
			});
			
			
		}
	};

	$scope.weekConfig = {
		visible: false,
		viewType: "Week",
		eventMoveHandling: "Disabled",
		eventResizeHandling: "Disabled",
		timeRangeSelectedHandling: "Disabled",
		onEventClick: function(args) {
			var modal = new DayPilot.Modal({
				onClosed: function(args) {
					if (args.result) {  // args.result is empty when modal is closed without submitting
						loadEvents();
					}
				}
			});
			var params = {
				action: 'select',
				id: args.e.id()
			};
			$http.post("backend/main/agenda.php", params).success(function(data) {
				$scope.id = data.id;
				$scope.text = data.text;
				modal.showUrl("edit.html");
			});
		}
	};

	$scope.showDay = function() {
		$scope.dayConfig.visible = true;
		$scope.weekConfig.visible = false;
		$scope.navigatorConfig.selectMode = "day";
	};

	$scope.showWeek = function() {
		$scope.dayConfig.visible = false;
		$scope.weekConfig.visible = true;
		$scope.navigatorConfig.selectMode = "week";
	};

	loadEvents();

	function loadEvents() {
		// using $timeout to make sure all changes are applied before reading visibleStart() and visibleEnd()
		$timeout(function() {
			var params = {
				action: 'load',
				start: $scope.week.visibleStart().toString(),
				end: $scope.week.visibleEnd().toString()
			};
			$http.post("backend/main/agenda.php", params).success(function(data) {
				$scope.events = data;
			});
		});
	}
});