define(['app', 'controller/dashboard', 'controller/console', 'controller/customers', 'controller/customer', 'controller/projects', 'controller/project', 'controller/invoices', 'controller/invoice'], function(app) {
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
		}).when('/project', {
			controller: 'projects',
			templateUrl: '/static/template/projects.html'
		}).when('/project/:id', {
			controller: 'project',
			templateUrl: '/static/template/project.html'
		}).when('/invoice', {
			controller: 'invoices',
			templateUrl: '/static/template/invoices.html'
		}).when('/invoice/:id', {
			controller: 'invoice',
			templateUrl: '/static/template/invoice.html'
		}).otherwise({
			redirectTo: '/'
		});
	});
});
