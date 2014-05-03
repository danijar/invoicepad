requirejs.config({
    baseUrl: 'static/js',
    urlArgs: 'time=' + (new Date()).getTime(), // prevent caching for development
    paths: {
        underscore: '../libs/underscore-1.6.0/underscore',
        jquery:     '../libs/jquery-2.1.0/jquery-2.1.0',
        text:       '../libs/text-2.0.12/text',
        css:        '../libs/require-css-0.1.2/css',
        template:   '../template',
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

require(['jquery', 'underscore'], function ($, _) {
    $('article').append('<p>Frontend system loaded.</p>');
});
