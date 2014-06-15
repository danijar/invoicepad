define(['app'], function(app) {
	// Removes technical clutter from urls for displaying to humans
	app.filter('domain', function () {
		return function (input) {
			input = input.replace(/(^http:\/\/www\.)/m, '');
			input = input.replace(/(^http:\/\/)/m, '');
			input = input.replace(/\/$/m, '');
			return input;
		};
	});
});
