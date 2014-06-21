define(['jquery', 'underscore', 'app', 'css!style/customers.css'], function($, _, app) {
	app.controller('customers', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {

		$scope.models = [];

		function load() {
			// Fetch models from database
			var deferred = $.ajax({
				dataType: 'json',
				method: 'GET',
				url: '/customer/',
			});

			// Inject into scope
			deferred.done(function(models) {
				$scope.$apply(function() {
					$scope.models = models;
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		}

		$scope.create = function() {
			// New customer's properties
			var content = {
				name: $scope.search || '',
			};

			// Request to create new model
			var deferred = $.ajax({
				dataType: 'json',
				method: 'POST',
				url: '/customer/',
				data: JSON.stringify(content),
			});

			// Sync back validated model
			deferred.done(function(model) {
				$scope.$apply(function() {
					$scope.models.push(model);

					// Head over to form
					$location.path('/customer/' + model.id);
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		};

		load();
	}]);
});
