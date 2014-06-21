define(['app', 'jquery'], function(app, $) {
	app.directive('autofocus', function() {
		// Set focus when inserted lazily into content frame
		return {
			restrict: 'A',
			link: function($scope, $element, $attrs) {
				$($element).focus();
			},
		};
	});
});
