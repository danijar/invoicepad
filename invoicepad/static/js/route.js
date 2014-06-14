define(['app', 'controller/dashboard', 'controller/console', 'controller/customers', 'controller/customer'], function(app) {
	app.config(function($routeProvider) {
		$routeProvider.when('/', {
			controller: 'dashboard',
			templateUrl: '/static/template/dashboard.html'
		}).when('/console', {
			controller: 'console',
			templateUrl: '/static/template/console.html'
		}).when('/customer', {
			controller: 'customers',
			templateUrl: '/static/template/customers.html'
		}).when('/customer/:id', {
			controller: 'customer',
			templateUrl: '/static/template/customer.html'
		}).otherwise({
			redirectTo: '/'
		});
	});
});
