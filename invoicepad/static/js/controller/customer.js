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
		};

		$scope.delete = function() {
			// Ask user to confirm
			if (!confirm("Please confirm to delete customer '" + $scope.model.name + "' permanently."))
				return;

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
		};

		$scope.abort = function() {
			// Ask user to confirm
			if (confirm("Unsaved changes will be discarded."))
				$location.path('/customer');
		}

		$scope.random = function() {
			// Generate title case words
			var words = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
			words = words.replace(/[^A-Za-z ]/g, '').split(' ').map(titleCase);

			// Helper functions
			function pick(number) { return 1 + parseInt(Math.random() * number) % number; }
			function titleCase(word) { return word[0].toUpperCase() + word.substr(1); }
			function sentence() { var text = _.sample(words); var length = 5 + pick(10); for (var i = 0; i < length; ++i) text += ' ' + _.sample(words).toLowerCase(); return text + '.'; }
			function text() { var text = sentence(); var length = 5 + pick(10); for (var i = 0; i < length; ++i) text += ' ' + sentence(); return text; }
			function postal() { var text = ''; for (var i = 0; i < 5; ++i) text += pick(9); return text; }

			// Generate random model data
			var domain = _.sample(words, pick(2)).join('-').toLowerCase();
			$scope.model.name = _.sample(words, 1 + pick(1)).join(' ');
			$scope.model.fullname = _.sample(words, 1 + pick(2)).join(' ');
			$scope.model.mail = _.sample(words).toLowerCase() + '@' + domain + '.com';
			$scope.model.website = 'http://www.' + domain + '.com';
			$scope.model.address1 = _.sample(words, pick(3)).join(' ') + ' ' + pick(100);
			$scope.model.address2 = postal() + ' ' + _.sample(words, pick(2)).join(' ');
			$scope.model.address3 = _.sample(words, 2).join(' ');
			$scope.model.notes = text();
		};

		load();
	}]);
});
