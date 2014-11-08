define(['app', 'controller/dashboard', 'controller/console', 'controller/customers', 'controller/customer', 'controller/projects', 'controller/project'], function(app) {
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
		}).otherwise({
			redirectTo: '/'
		});
	});
});
