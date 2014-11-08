define(['app', 'css!style/dashboard.css'], function(app) {
	app.controller('dashboard', function($scope) {
		function load(url, model) {
			// Fetch model from server
			var deferred = $.ajax({
				dataType: 'json',
				method: 'GET',
				url: url,
			});

			// Inject into scope
			deferred.done(function(content) {
				$scope.$apply(function() {
					$scope[model] = content;
				});
			}).error(function(e) {
				$scope.$apply(function() {
					console.error(e);
					$scope.message = 'There was an error sending the request.';
				});
			});
		}

		load('/user/', 'user');
		load('/customer/', 'customers');
		load('/project/', 'projects');
		$scope.invoices = [];
	});
});
