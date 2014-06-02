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

require(['jquery', 'dashboard/index', 'user/test'], function($, Index, Test) {
    // Initialize views
    var index = new Index();
    var test = new Test();

    // Register navigation events
    $('nav a.index').click(function() { index.render(); });
    $('nav a.test').click(function() { test.render(); });

    // Load current view
    index.render();
});
