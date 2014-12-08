define(['jquery', 'underscore', 'app', 'css!style/list.css'], function($, _, app) {
	app.controller('customers', ['$scope', '$routeParams', '$location', 'Models', function($scope, $routeParams, $location, Models) {
		// Messages
		$scope.message = '';
		function requestError() {
			var text = 'There was an error sending the request.';
			$scope.message = text;
			console.error(text);
		}

		// Connect to backend model
		$scope.server = new Models('customer');
		$scope.server.load().catch(requestError);

		// Create new model
		$scope.create = function() {
			$scope.server.create().then(function(model) {
				$location.path('/customer/' + model.id);
			}, requestError);
		};
	}]);
});
