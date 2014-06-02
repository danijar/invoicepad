requirejs.config({
    baseUrl: 'static/js',
    urlArgs: 'time=' + (new Date()).getTime(), // prevent caching for development
    paths: {
        underscore: '../lib/underscore-1.6.0/underscore',
        jquery:     '../lib/jquery-2.1.0/jquery-2.1.0',
        text:       '../lib/text-2.0.12/text',
        css:        '../lib/require-css-0.1.2/css',
        template:   '../template',
        style:      '../css',
    },
    shim: {
        jquery: {
            exports: '$',
        },
        underscore: {
            exports: '_',
        },
    }
});

require(['jquery', 'view/dashboard', 'view/customers', 'view/customer', 'view/console'],
	function($, Dashboard, Customers, Customer, Console) {

    // Initialize routes
    var routes = {
        '/?':                 Dashboard,
        '/console/?':         Console,
        '/customer/?':        Customers,
        '/customer/(\\d+)/?': Customer,
    };

    // Listen to route changes
    $(window).on('hashchange', function() {
        // Find matching route
        var hash = window.location.hash.substr(1);
        for (var i in routes) {
        	// Test regex against current route
        	var regex = new RegExp('^' + i + '$', 'gm');
        	var matches = regex.exec(hash);
        	if (matches) {
        		// Cleanup old view
        		$('.content').children().remove();

        		// Create view with captured groups
        		var args = matches.slice(1, matches.length);
        		routes[i].apply(undefined, args);
        		return;
        	}
        }
        
        // No route found
        console.error("No route matches the hash '" + hash + "'.");
    });

    // Load initial view
    $(window).trigger('hashchange');
});
