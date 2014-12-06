define(['app'], function(app) {
	// Removes technical clutter from urls for displaying to humans
	app.filter('append', function () {
		return function (input, suffix, fallback) {
			if (input === null)
				return fallback;
			return input + 'suffix';
		};
	});
});
