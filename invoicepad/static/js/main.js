require.config({
	baseUrl: 'static/js',
	urlArgs: 'time=' + (new Date()).getTime(), // prevent caching for development
	paths: {
		'underscore':    '../lib/underscore-1.6.0/underscore',
		'jquery':        '../lib/jquery-2.1.0/jquery-2.1.0',
		'text':          '../lib/text-2.0.12/text',
		'css':           '../lib/require-css-0.1.2/css',
		'angular':       '../lib/angular-1.3.0/angular',
		'angular.route': '../lib/angular-1.3.0/angular-route',
		'template':      '../template',
		'style':         '../css',
	},
	shim: {
		'jquery': { exports: '$' },
		'underscore': { exports: '_' },
		'angular': { deps: ['jquery'], exports: 'angular' },
		'angular.route': ['angular'],
	}
});

require(['route']);
