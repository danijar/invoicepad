define(['jquery', 'underscore', 'app', 'css!style/console.css'], function($, _, app) {
	app.controller('console', function($scope) {
		// Example requests
		// Split by action and model, support 50% width select fields for that.
		$scope.presets = [
			{ name: 'All customers',   method: 'GET',    url: '/customer/',    content: '' },
			{ name: 'Get customer',    method: 'GET',    url: '/customer/42/', content: '' },
			{ name: 'Create customer', method: 'POST',   url: '/customer/',    content: '{}' },
			{ name: 'Update customer', method: 'PUT',    url: '/customer/42/', content: '{\n    "name": "Customer",\n    "fullname": "",\n    "address1": "",\n    "address2": "",\n    "address3": "",\n    "mail": "",\n    "website": "",\n    "notes": "",\n    "ustid": "",\n    "logo": ""\n}' },
			{ name: 'Delete customer', method: 'DELETE', url: '/customer/42/', content: '' },
			{ name: '',                method: '',       url: '',              content: '' },
			{ name: 'All projects',    method: 'GET',    url: '/project/',     content: '' },
			{ name: 'Get project',     method: 'GET',    url: '/project/42/',  content: '' },
			{ name: 'Create project',  method: 'POST',   url: '/project/',     content: '{}' },
			{ name: 'Update project',  method: 'PUT',    url: '/project/42/',  content: '{\n    "invoice": null,\n    "name": "",\n    "description": "",\n    "deadline": null,\n    "agreement": null,\n    "finished": null,\n    "value": 0,\n    "hours": 0\n}' },
			{ name: 'Delete project',  method: 'DELETE', url: '/project/42/',  content: '' },
			{ name: '',                method: '',       url: '',              content: '' },
			{ name: 'All invoices',    method: 'GET',    url: '/invoice/',     content: '' },
			{ name: 'Get invoice',     method: 'GET',    url: '/invoice/42/',  content: '' },
			{ name: 'Create invoice',  method: 'POST',   url: '/invoice/',     content: '{}' },
			{ name: 'Update invoice',  method: 'PUT',    url: '/invoice/42/',  content: '{\n    "customer": null,\n    "date": "2000-01-01",\n    "counter": 0,\n    "number": 0,\n    "value": null,\n    "pdf": null\n}' },
			{ name: 'Delete invoice',  method: 'DELETE', url: '/invoice/42/',  content: '' },
		];

		$scope.send = function() {
			// Send request
			var deferred = $.ajax({
				dataType: 'json',
				method:   $scope.method,
				url:      $scope.url,
				data:     $scope.content,
			});

			// Show response to user
			deferred.always(function(e) {
				$scope.$apply(function() {
					$scope.message = JSON.stringify(e, null, 4);
				});
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
