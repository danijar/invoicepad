define(['app'], function(app) {
	// Removes technical clutter from urls for displaying to humans
	app.filter('domain', function () {
		return function (input) {
			return input.replace(/(^http:\/\/www\\.)|(^http:\/\/)|(\/$)/g, '');
		};
	});
});
