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
					// Arrow left
					if (e.which == 37 && targets.left)
						return follow(targets.left);

					// Arrow up
					if (e.which == 38 && targets.up)
						return follow(targets.up);

					// Arrow right
					if (e.which == 39 && targets.right)
						return follow(targets.right);

					// Arrow down
					if (e.which == 40 && targets.down)
						return follow(targets.down);
				});
			},
		};
	});
});
