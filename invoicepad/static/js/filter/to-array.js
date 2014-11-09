define(['app'], function(app) {
	// Converts dictionary into array to allow sorting filters. Thanks to Pete
	// Darwin, https://github.com/petebacondarwin/angular-toArrayFilter.
	app.filter('toArray', function () {
		return function (dict) {
			if (typeof dict === 'object') {
				return Object.keys(dict).map(function(key) {
					return dict[key];
				});
			} else {
				return dict;
			}
		};
	});
});
