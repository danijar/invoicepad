define(['jquery', 'underscore', 'app', 'helper/message', 'css!style/customer.css'], function($, _, app, Message) {
	app.controller('customer', ['$scope', '$routeParams', '$location', 'Model', function($scope, $routeParams, $location, Model) {
		// Messages
		$scope.message = '';
		function requestError() {
			var text = 'There was an error sending the request.';
			$scope.message = text;
			console.error(text);
		}
		function unchangedError() {
			var text = 'You did not make any changes.';
			$scope.message = text;
			console.error(text);
		}

		// Connect to backend model
		var fields = ['name', 'fullname', 'mail', 'website', 'address1', 'address2', 'address3', 'notes', 'logo'];
		$scope.model = new Model('customer', $routeParams.id, fields);
		$scope.model.load().catch(requestError);

		$scope.save = function() {
			$scope.message = '';
			try {
				$scope.model.save().then(function() {
					//$scope.$digest();
					$location.path('/customer');
				}, requestError);
			} catch(error) {
				unchangedError();
			}
		};

		$scope.delete = function() {
			$scope.message = '';
			if (!confirm("Please confirm to delete customer '" + $scope.model.name + "' permanently."))
				return;
			$scope.model.delete().then(function() {
				//$scope.$digest();
				$location.path('/customer');
			}, requestError);
		};

		$scope.abort = function() {
			$scope.message = '';
			// Ask user to confirm if there are changes
			if (!$scope.model.changed() || confirm('Unsaved changes will be discarded.'))
				$location.path('/customer');
		};

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
	}]);
});
