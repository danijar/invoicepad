define(['app', 'underscore'], function(app, _) {
	// Check whether an object or array is empty
	app.filter('empty', function () {
		return function (input) {
			return _.isEmpty(input);
		};
	});
});
