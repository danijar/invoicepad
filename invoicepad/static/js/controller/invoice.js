define(['jquery', 'underscore', 'app', 'helper/message', 'css!style/invoice.css'], function($, _, app, Message) {
	app.controller('invoice', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
		// Fetch model id from route
		var id = $routeParams.id;

		function load() {
			// Fetch model from server
			var deferred = $.ajax({
				dataType: 'json',
				method: 'GET',
				url: '/invoice/' + id + '/',
			});

			// Inject into scope
			deferred.done(function(model) {
				$scope.$apply(function() {
					// Parse dates
					if ('date' in model && model.date)
						model.date = new Date(model.date);

					$scope.model = model;
					// Keep copy to compare changes
					$scope.initial = $.extend({}, model);
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		}

		// Restore initial logo if field cleared
		$scope.$watch('model.logo', function() {
			if (!$scope.model)
				return;
			if ($scope.model.logo.length < 1)
				$scope.model.logo = $scope.initial.logo;
		});

		function changes() {
			// List of field ids
			var fields = ['date', 'customer', 'value', 'pdf'];

			// Read field values into a map
			var values = {};
			fields.map(function(field) {
				if (field in $scope.model) {
					// Filter changes
					var value = $scope.model[field];
					var changed = true;
					if (field in $scope.initial)
						changed = (value != $scope.initial[field]);
					if (changed)
						values[field] = value;
				}
			});

			return values;
		}

		$scope.save = function() {
			// Get changes
			var content = changes();

			// Skip if no changes were made
			if (!Object.keys(content).length) {
				$scope.message = 'You did not make any changes.';
				return;
			}

			// Serialize dates
			if ('date' in content && content.date)
				content.date = content.date.toISOString().slice(0, 10);

			// Send request to server
			var deferred = $.ajax({
				dataType: 'json',
				method: 'PUT',
				url: '/invoice/' + id + '/',
				data: JSON.stringify(content),
			});

			// Sync back validated model
			deferred.done(function(model) {
				$scope.$apply(function() {
					$scope.model = model;
					$scope.message = 'All changes saved.';
					$location.path('/invoice');
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		};

		$scope.delete = function() {
			// Ask user to confirm
			if (!confirm("Please confirm to delete invoice '" + $scope.model.counter + "' permanently."))
				return;

			// Send request to server
			var deferred = $.ajax({
				method: 'DELETE',
				url: '/invoice/' + id + '/',
			});

			// Sync back validated model
			deferred.done(function() {
				$scope.$apply(function() {
					$scope.message = 'This invoice was deleted.';
					$location.path('/invoice');
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		};

		$scope.abort = function() {
			// Find out if changes were made
			var changed = Object.keys(changes()).length ? true : false;

			// Ask user to confirm if there are changes
			if (!changed || confirm('Unsaved changes will be discarded.'))
				$location.path('/invoice');
		}

		load();
	}]);
});
