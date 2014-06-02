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

require(['jquery', 'dashboard/index', 'user/test', 'customer/customers'], function($, Index, Test, Customers) {
    // Initialize routes
    var routes = {
        '': new Index(),
        'test': new Test(),
        'customer': new Customers(),
    };

    // Listen to route changes
    $(window).on('hashchange', function() {
        // Extract route
        var route = window.location.hash;
        route = route.substr(2).replace(/\/$/g, '');
        
        // Load view
        if (route in routes)
            routes[route].render();
    });

    // Load initial view
    $(window).trigger('hashchange');
});
