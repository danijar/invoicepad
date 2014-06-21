define(['app', 'jquery'], function(app, $) {
	app.directive('buttons', function() {
		return function($scope, $element, $attrs) {
			$element.on('keydown', 'a', function(e) {
				// Only listen to enter and space keys
				if (e.which != 13 && e.which != 32)
					return;

				// Fire click event if it's a soft link
				if (!$(this).attr('href'))
					$(this).click();
			});
		};
	});
});
