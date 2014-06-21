define(['app', 'jquery'], function(app, $) {
	app.directive('arrows', function() {
		// Function to select an item
		function focus(target) {
			// Has single target
			if (target.length == 1) {
				// Prevent focus outline
				target.css('outline', 'none');

				// Focus target
				if (!target.attr('tabindex'))
					target.attr('tabindex', 0);
				target.focus();

				// Move selected class
				$('*').removeClass('selected');
				target.addClass('selected');

				// Prevent scrolling
				return false;
			}
		}

		// Execute once per usage
		function link(scope, $element) {
			// Make element focusable
			if (!$element.attr('tabindex'))
				$element.attr('tabindex', 0);

			$element.on('focus', function() {
				// Step in at first element
				focus($element.children().first());
			});

			$element.on('focusout', function() {
				// Clear selection
				$(this).children().removeClass('selected');
			});

			$element.on('keydown', 'li', function(e) {
				// Items to select
				var items = $element.children();
				var current = items.filter('.selected');

				// Step in at first element
				if (!current.length)
					return focus(items.first());

				// Arrow down
				if (e.which == 40)
					return focus(current.next());

				// Arrow up
				if (e.which == 38)
					return focus(current.prev());

				// Follow link on enter
				if (e.which == 13)
					current.find('a').first().click();
			});

			$element.on('mouseenter', 'li', function() {
				// Focus item pointed on
				if ($element.find(':focus').length)
					return focus($(this));
			});
		}

		// Return directive
		return {
			restrict: 'A',
			link: link
		};
	});
});
