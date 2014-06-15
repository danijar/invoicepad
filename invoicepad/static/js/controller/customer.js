define(['jquery', 'underscore', 'app', 'helper/message', 'css!style/customer.css'], function($, _, app, Message) {
	app.controller('customer', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {

		// Fetch model id from route
		var id = $routeParams.id;

		function load() {
			// Fetch model from server
			var deferred = $.ajax({
				dataType: 'json',
				method: 'GET',
				url: '/customer/' + id + '/',
			});

			// Inject into scope
			deferred.done(function(model) {
				$scope.$apply(function() {
					$scope.model = model;
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		}

		$scope.save = function() {
			// List of field ids
			var fields = ['name', 'fullname', 'mail', 'website', 'address1', 'address2', 'address3', 'notes'];

			// Read field values into a map
			var content = {};
			fields.map(function(field) {
				var value = $scope.model[field].trim();
				if (value.length)
					content[field] = value;
			});

			// Upload new logo if provided
			if ($scope.upload)
				content.logo = $scope.upload.trim();

			// Send request to server
			var deferred = $.ajax({
				dataType: 'json',
				method: 'PUT',
				url: '/customer/' + id + '/',
				data: JSON.stringify(content),
			});

			// Sync back validated model
			deferred.done(function(model) {
				$scope.$apply(function() {
					$scope.model = model;
					$scope.message = 'All changes saved.';
					$location.path('/customer');
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		}

		$scope.delete = function() {
			// Ask user to confirm
			if (confirm("Please confirm to delete customer '" + $scope.model.name + "' permanently.")) {
				// Send request to server
				var deferred = $.ajax({
					method: 'DELETE',
					url: '/customer/' + id + '/',
				});

				// Sync back validated model
				deferred.done(function() {
					$scope.$apply(function() {
						$scope.message = 'This customer was deleted.';
						$location.path('/customer');
					});
				}).error(function(e) {
					$scope.$apply(function() {
						console.error(e);
						$scope.message = 'There was an error sending the request.';
					});
				});
			}
		};

		$scope.abort = function() {
			$location.path('/customer');
		}

		load();
	}]);
});
