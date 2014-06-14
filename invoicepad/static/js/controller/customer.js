define(['jquery', 'underscore', 'app', 'helper/message', 'css!style/customer.css'], function($, _, app, Message) {
	app.controller('customer', ['$scope', '$routeParams', function($scope, $routeParams) {

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
				$scope.model = model;
			}).error(function(e) {
				console.error(e);
				$scope.message = 'There was an error sending the request.';
			});
		}

		$scope.save = function() {
			// List of field ids
			var fields = ['name', 'fullname', 'mail', 'website', 'address1', 'address2', 'address3', 'notes', 'logo'];

			// Read field values into a map
			var data = {};
			fields.map(function(field) {
				var value = el.find('#' + field).val().trim();
				if (value.length)
					data[field] = value;
			});

			// Send to server
			var deferred = $.ajax({
				dataType: 'json',
				method: 'PUT',
				url: '/customer/' + id + '/',
				data: JSON.stringify(data),
			});

			// Sync back validated model
			deferred.done(function(model) {
				$scope.model = model;
				$scope.message = 'All changes saved.';
			}).error(function(e) {
				console.error(e);
				$scope.message = 'There was an error sending the request.';
			});
		}

		load();
	}]);
});
