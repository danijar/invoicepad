define(['angular', 'angular.route'], function(angular) {
	var app = angular.module('invoicepad', ['ngRoute']);
	angular.element(document).ready(function() {
		angular.bootstrap(document, ['invoicepad']);
	});
	return app;
});
