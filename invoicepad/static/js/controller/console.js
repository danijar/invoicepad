define(['jquery', 'underscore', 'app', 'css!style/console.css'], function($, _, app) {
	app.controller('console', function($scope) {

		// Example requests
		$scope.presets = [
			{ name: 'Get all customers',        method: 'GET',    url: '/customer/',    content: '' },
			{ name: 'Get single customer',      method: 'GET',    url: '/customer/42/', content: '' },
			{ name: 'Create new customer',      method: 'POST',   url: '/customer/',    content: '{\n    "name": "Customer",\n    "fullname": "",\n    "address1": "",\n    "address2": "",\n    "address3": "",\n    "mail": "",\n    "website": "",\n    "notes": "",\n    "ustid": "",\n    "logo": ""\n}' },
			{ name: 'Update existing customer', method: 'PUT',    url: '/customer/42/', content: '{\n    "name": "Customer",\n    "fullname": "",\n    "address1": "",\n    "address2": "",\n    "address3": "",\n    "mail": "",\n    "website": "",\n    "notes": "",\n    "ustid": "",\n    "logo": ""\n}' },
			{ name: 'Delete existing customer', method: 'DELETE', url: '/customer/42/', content: '' },
		];

		$scope.send = function() {
			// Send request
			var deferred = $.ajax({
				dataType: 'json',
				method:   $scope.method,
				url:      $scope.url,
				data:     $scope.content,
			});

			// Set user message
			deferred.always(function(e) {
				$scope.message = JSON.stringify(e, null, 4);
			});
		};

		$scope.select = function() {
			// Read preset
			$scope.method  = $scope.selection.method;
			$scope.url     = $scope.selection.url;
			$scope.content = $scope.selection.content;
		};
	});
});
