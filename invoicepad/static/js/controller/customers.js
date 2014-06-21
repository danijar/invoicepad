define(['jquery', 'underscore', 'app', 'css!style/customers.css'], function($, _, app) {
	app.controller('customers', function($scope) {

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
			// Skip if no name specified
			if (!$scope.search) {
				$scope.message = 'Please provide a name for the new customer in the search box next to the button.';
				return;
			}

			// New customer's properties
			var content = {
				name: $scope.search,
			};

			// Request to create new model
			var deferred = $.ajax({
				dataType: 'json',
				method: 'POST',
				url: '/customer/',
				data: JSON.stringify(content),
			});

			// Clear filter text
			$scope.search = '';

			// Sync back validated model
			deferred.done(function(model) {
				$scope.$apply(function() {
					$scope.models.push(model);
					$scope.message = 'Created new customer. You may want to edit its properties now.';
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		};

		load();
	});
});
