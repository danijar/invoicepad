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
			// New customer's properties
			var content = {
				name: $scope.name,
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

		/*
		function relax() {
			// Find maximum with of each cell
			var widths = [];
			el.find('ul').children().each(function() {
				// Iterate of each cell in current row
				$(this).children().each(function(index) {
					// Guarantee index bounds
					while (index > widths.length - 1)
						widths.push(0);

					// Update width if larger
					var width = $(this).width();
					if (widths[index] < width)
						widths[index] = width;
				});
			});

			// Relax table colums
			el.find('ul').children().each(function() {
				$(this).children().each(function(index) {
					// Set cell with to maximum
					$(this).width(widths[index]);
				});
			});
		}
		*/
	});
});
