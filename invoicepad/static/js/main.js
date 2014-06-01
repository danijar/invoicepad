requirejs.config({
    baseUrl: 'static/js',
    urlArgs: 'time=' + (new Date()).getTime(), // prevent caching for development
    paths: {
        underscore: '../lib/underscore-1.6.0/underscore',
        jquery:     '../lib/jquery-2.1.0/jquery-2.1.0',
        text:       '../lib/text-2.0.12/text',
        css:        '../lib/require-css-0.1.2/css',
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
    $('article h1').first().after('<p class="message">Frontend system loaded.</p>');
});
