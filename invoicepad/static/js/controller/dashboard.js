define(['app'], function(app) {
	app.controller('dashboard', function($scope) {
		function load() {
			// Fetch model from server
			var deferred = $.ajax({
				dataType: 'json',
				method: 'GET',
				url: '/user/',
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

		load();
	});
});
