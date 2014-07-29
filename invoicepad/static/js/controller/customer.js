define(['jquery', 'underscore', 'app', 'helper/message', 'css!style/customer.css'], function($, _, app, Message) {
	app.controller('customer', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {

		setInterval(function() { console.log(typeof $scope.model.logo, $scope.model.logo); }, 1000);

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
			var fields = ['name', 'fullname', 'mail', 'website', 'address1', 'address2', 'address3', 'notes', 'logo'];

			// Read field values into a map
			var values = {};
			fields.map(function(field) {
				if (field in $scope.model) {
					// Filter changes
					var value = $scope.model[field].trim();
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
				console.log($scope.model.logo);
				return;
			}

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
			// Find out if changes were made
			var changed = Object.keys(changes()).length ? true : false;

			// Ask user to confirm if there are changes
			if (!changed || confirm('Unsaved changes will be discarded.'))
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

			// Logo from Stackexchange sites
			var sites = 'stackoverflow serverfault superuser stackexchangemeta webapps webmasters math gamedev diy photo stats gis stackapps gaming unix tex english rpg programmers electronics cstheory sharepoint drupal mathematica workplace patents'.split(' ');
			$scope.model.logo = 'http://cdn.sstatic.net/' + _.sample(sites) + '/img/apple-touch-icon.png';
		};

		load();
	}]);
});
