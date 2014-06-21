define(['app', 'jquery'], function(app, $) {
	app.directive('arrow', function($parse) {

		function follow(selector) {
			// Select from DOM
			var target = $(selector).first();

			// Has single target
			if (target.length) {
				// Focus target
				if (!target.attr('tabindex'))
					target.attr('tabindex', 0);
				target.focus();

				// Prevent scrolling
				return false;
			} else {
				console.error('Directive \'arrow\' could not find focus target \'' + selector + '\'.');
			}
		}

		return {
			restrict: 'A',
			link: function($scope, $element, $attrs) {
				var targets = $parse($attrs.arrow)($scope);
				$element.on('keydown', function(e) {
					// Arrow up
					if (targets.up && e.which == 38)
						return follow(targets.up);

					// Arrow down
					if (targets.down && e.which == 40)
						return follow(targets.down);
				});
			},
		};
	});
});
